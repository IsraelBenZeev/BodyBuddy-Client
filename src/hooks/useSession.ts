import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createSession,
    createSessionExerciseLogs,
    getAllUserSessions,
    getExerciseLogsByExerciseId,
    getSessionExerciseLogs,
    getSessions,
} from '../service/sessionService';
import { useUIStore } from '../store/useUIStore';
import { ExerciseLogDBType, SessionDBType } from '../types/session';
const keyCashSessions = ['sessions'];
export const useGetSessions = (user_id: string, workoutPlanId: string) => {
  return useQuery({
    queryKey: [keyCashSessions, workoutPlanId, user_id],
    queryFn: async () => await getSessions(user_id, workoutPlanId),
    staleTime: Infinity,
    enabled: !!user_id && !!workoutPlanId,
    select: (data) => {
      if (!data) return [];
      return data as SessionDBType[];
    },
  });
};
export const useSessionCreateWorkout = (user_id: string, workoutPlanId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ session }: { session: SessionDBType }) => await createSession(session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keyCashSessions, workoutPlanId, user_id] });
      queryClient.invalidateQueries({
        queryKey: ['exercisesWorkoutPlanIds', workoutPlanId, user_id],
      });
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
    mutationFn: async ({ exerciseLog }: { exerciseLog: ExerciseLogDBType[] }) =>
      await createSessionExerciseLogs(exerciseLog),
    onSuccess: () => {
      triggerSuccess('האימון נשמר בהצלחה', 'success');
      queryClient.invalidateQueries({ queryKey: [keyCashSessions, workoutPlanId, user_id] });
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
        weeklyMinutes: thisWeek.reduce((sum, s) => sum + (s.total_time ?? 0), 0),
        totalCount: sessions.length,
        streak: calcStreak(sessions),
      };
    },
  });
};
