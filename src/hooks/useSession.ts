import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createSession,
    createSessionExerciseLogs,
    getAllUserSessions,
    getExerciseLogsByExerciseId,
    getLatestWorkoutPlanExerciseSets,
    getSessionExerciseLogs,
    getSessionsPage,
} from '../service/sessionService';
import { useUIStore } from '../store/useUIStore';
import { ExerciseSetDBType, SessionDBType } from '../types/session';
const SESSIONS_PAGE_SIZE = 20;
const sessionsQueryKey = (workoutPlanId: string, userId: string) => ['sessions', workoutPlanId, userId] as const;

export const useInfiniteSessions = (userId: string | undefined, workoutPlanId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: sessionsQueryKey(workoutPlanId ?? '', userId ?? ''),
    queryFn: ({ pageParam }) => getSessionsPage(userId!, workoutPlanId!, pageParam, SESSIONS_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === SESSIONS_PAGE_SIZE ? allPages.length + 1 : undefined,
    staleTime: Infinity,
    enabled: !!userId && !!workoutPlanId,
  });
};
export const useSessionCreateWorkout = (user_id: string, workoutPlanId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ session }: { session: SessionDBType }) => await createSession(session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsQueryKey(workoutPlanId, user_id) });
      queryClient.invalidateQueries({ queryKey: ['userWorkoutStats', user_id] });
    },
    onError: (error) => {
      console.error('Mutation Error - Exercise Logs:', error);
    },
  });
};
export const useSessionCreateExerciseLog = (user_id: string, workoutPlanId: string) => {
  const queryClient = useQueryClient();
  const { triggerSuccess } = useUIStore();
  return useMutation({
    mutationFn: async ({ exerciseLog }: { exerciseLog: ExerciseSetDBType[] }) =>
      await createSessionExerciseLogs(exerciseLog),
    onSuccess: (_data, variables) => {
      triggerSuccess('האימון נשמר בהצלחה', 'success');
      queryClient.invalidateQueries({ queryKey: sessionsQueryKey(workoutPlanId, user_id) });
      queryClient.invalidateQueries({ queryKey: ['exercisesWorkoutPlanIds', workoutPlanId, user_id] });
      queryClient.invalidateQueries({ queryKey: ['latestWorkoutPlanExerciseSets', workoutPlanId, user_id] });
      const uniqueExerciseIds = [...new Set(variables.exerciseLog.map((log) => log.exercise_id))];
      uniqueExerciseIds.forEach((exerciseId) => {
        queryClient.invalidateQueries({ queryKey: ['exerciseHistory', exerciseId, user_id] });
      });
    },
    onError: (error) => {
      console.error('Mutation Error - Exercise Logs:', error);
    },
  });
};

export const useGetExerciseHistory = (userId: string, exerciseId: string) => {
  return useQuery({
    queryKey: ['exerciseHistory', exerciseId, userId],
    queryFn: () => getExerciseLogsByExerciseId(userId, exerciseId),
    staleTime: Infinity,
    enabled: !!userId && !!exerciseId,
  });
};

export const useLatestWorkoutPlanExerciseSets = (
  userId: string | undefined,
  workoutPlanId: string | undefined
) => {
  return useQuery({
    queryKey: ['latestWorkoutPlanExerciseSets', workoutPlanId, userId],
    queryFn: () => getLatestWorkoutPlanExerciseSets(userId!, workoutPlanId!),
    staleTime: Infinity,
    enabled: !!userId && !!workoutPlanId,
    select: (sets) => {
      const setsByExercise = sets.reduce<Record<string, ExerciseSetDBType[]>>((accumulator, set) => {
        if (!accumulator[set.exercise_id]) accumulator[set.exercise_id] = [];
        accumulator[set.exercise_id].push(set);
        return accumulator;
      }, {});

      return Object.fromEntries(
        Object.entries(setsByExercise).map(([exerciseId, exerciseSets]) => [
          exerciseId,
          exerciseSets.sort((a, b) => a.set_number - b.set_number).map((set) => set.values ?? {}),
        ])
      ) as Record<string, Record<string, number>[]>;
    },
  });
};

export const useSessionExerciseLogs = (sessionId: string) => {
  return useQuery({
    queryKey: ['sessionDetails', sessionId],
    queryFn: () => getSessionExerciseLogs(sessionId),
    enabled: !!sessionId,
    staleTime: Infinity,
    retry: 0,
  });
};

const getWeekStart = (): Date => {
  const now = new Date();
  const day = now.getDay(); // 0=Sunday
  const diff = now.getDate() - day;
  const weekStart = new Date(now);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

const getWeekKey = (date: Date): string => {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - day);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString().split('T')[0];
};

const calcStreak = (sessions: { started_at: string }[]): number => {
  if (sessions.length === 0) return 0;

  const weekSet = new Set(sessions.map((s) => getWeekKey(new Date(s.started_at))));

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = getWeekKey(cursor);
    if (weekSet.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 7);
    } else {
      break;
    }
  }
  return streak;
};

export const useUserWorkoutStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userWorkoutStats', userId],
    queryFn: () => getAllUserSessions(userId!),
    staleTime: Infinity,
    enabled: !!userId,
    select: (sessions) => {
      const weekStart = getWeekStart();
      const thisWeek = sessions.filter((s) => new Date(s.started_at) >= weekStart);
      return {
        weeklyCount: thisWeek.length,
        weeklyMinutes: Math.floor(thisWeek.reduce((sum, s) => sum + (s.total_time ?? 0), 0) / 60),
        totalCount: sessions.length,
        streak: calcStreak(sessions),
      };
    },
  });
};
