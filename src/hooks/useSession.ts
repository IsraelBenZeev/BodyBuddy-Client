import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSession, createSessionExerciseLogs, getSessionExerciseLogs, getSessions } from "../service/sessionService";
import { useUIStore } from "../store/useUIStore";
import { ExerciseLogDBType, SessionDBType } from "../types/session";
const keyCashSessions = ["sessions"]
export const useGetSessions = (user_id: string, workoutPlanId: string) => {
    return useQuery({
        queryKey: [keyCashSessions, user_id],
        queryFn: async () => await getSessions(user_id, workoutPlanId),
        staleTime: Infinity,
        enabled: !!user_id && !!workoutPlanId,
        select: (data) => {
            if (!data) return [];
            return data as SessionDBType[];
        }
    });
}
export const useSessionCreateWorkout = (user_id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ session }: { session: SessionDBType }) =>
            await createSession(session),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [keyCashSessions, user_id] });
        },
        onError: (error) => {
            console.error("Mutation Error - Exercise Logs:", error);
        }
    })
}
export const useSessionCreateExerciseLog = (user_id: string) => {
    const queryClient = useQueryClient();
    const { triggerSuccess } = useUIStore();
    return useMutation({
        mutationFn: async ({ exerciseLog }: { exerciseLog: ExerciseLogDBType[] }) =>
            await createSessionExerciseLogs(exerciseLog),
        onSuccess: () => {
            triggerSuccess("האימון נשמר בהצלחה");
            queryClient.invalidateQueries({ queryKey: [keyCashSessions, user_id] });
        },
        onError: (error) => {
            console.error("Mutation Error - Exercise Logs:", error);
        }
    });
};


export const useSessionExerciseLogs = (sessionId: string) => {
    console.log("sessionId from hook", sessionId);
    return useQuery({
        queryKey: ['sessionDetails', sessionId],
        queryFn: () => getSessionExerciseLogs(sessionId),
        enabled: !!sessionId,
        retry: 0,
        // select: (data) => {
        //     if (!data) return [];
        //     const grouped = data.reduce((acc: any, log: any) => {
        //         const exerciseId = log.exercise_id;
        //         const exerciseName = log.exercises?.name || "תרגיל לא ידוע";

        //         if (!acc[exerciseId]) {
        //             acc[exerciseId] = {
        //                 id: exerciseId,
        //                 name: exerciseName,
        //                 sets: []
        //             };
        //         }

        //         acc[exerciseId].sets.push({
        //             id: log.id,
        //             weight: log.weight,
        //             reps: log.reps,
        //             index: log.set_index
        //         });

        //         return acc as ExerciseLogDBType[];
        //     }, {});

        //     return Object.values(grouped); // מחזיר מערך של תרגילים
        // }
    });
};

