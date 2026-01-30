import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSession, createSessionExerciseLogs, getSessionExerciseLogs, getSessions } from "../service/sessionService";
import { useUIStore } from "../store/useUIStore";
import { ExerciseLogDBType, SessionDBType } from "../types/session";
const keyCashSessions = ["sessions"]
export const useGetSessions = (user_id: string, workoutPlanId: string) => {
    return useQuery({
        queryKey: [keyCashSessions, workoutPlanId, user_id],
        queryFn: async () => await getSessions(user_id, workoutPlanId),
        staleTime: Infinity,
        enabled: !!user_id && !!workoutPlanId,
        select: (data) => {
            if (!data) return [];
            return data as SessionDBType[];
        }
    });
}
export const useSessionCreateWorkout = (user_id: string, workoutPlanId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ session }: { session: SessionDBType }) =>
            await createSession(session),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [keyCashSessions, workoutPlanId, user_id] });
            queryClient.invalidateQueries({ queryKey: ['exercisesWorkoutPlanIds', workoutPlanId, user_id] });
        },
        onError: (error) => {
            console.error("Mutation Error - Exercise Logs:", error);
        }
    })
}
export const useSessionCreateExerciseLog = (user_id: string, workoutPlanId: string) => {
    const queryClient = useQueryClient();
    const { triggerSuccess } = useUIStore();
    return useMutation({
        mutationFn: async ({ exerciseLog }: { exerciseLog: ExerciseLogDBType[] }) =>
            await createSessionExerciseLogs(exerciseLog),
        onSuccess: () => {
            triggerSuccess("האימון נשמר בהצלחה");
            queryClient.invalidateQueries({ queryKey: [keyCashSessions, workoutPlanId, user_id] });
        },
        onError: (error) => {
            console.error("Mutation Error - Exercise Logs:", error);
        }
    });
};


export const useSessionExerciseLogs = (sessionId: string) => {
    return useQuery({
        queryKey: ['sessionDetails', sessionId],
        queryFn: () => getSessionExerciseLogs(sessionId),
        enabled: !!sessionId,
        retry: 0,
    });
};

