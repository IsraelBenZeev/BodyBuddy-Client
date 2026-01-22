import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSessionExerciseLogs, createSessionWorkout } from "../service/sessionService";
import { ExerciseLogDBType, SessionDBType, SessionFormData } from "../types/session";
import { useUIStore } from "../store/useUIStore";

export const useSessionCreateWorkout = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ session}: { session: SessionDBType }) =>
            await createSessionWorkout(session),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ['workoutLogs', userId] });
        },
        onError: (error) => {
            console.error("Mutation Error - Exercise Logs:", error);
        }
    })
}
export const useSessionCreateExerciseLog = (userId: string) => {
    const queryClient = useQueryClient();
    const { triggerSuccess } = useUIStore();
    return useMutation({
        mutationFn: async({ exerciseLog }: { exerciseLog: ExerciseLogDBType[] }) =>
            await createSessionExerciseLogs(exerciseLog),
        onSuccess: () => {
            triggerSuccess("האימון נשמר בהצלחה");
            queryClient.invalidateQueries({ queryKey: ['workoutLogs', userId] });
        },
        onError: (error) => {
            console.error("Mutation Error - Exercise Logs:", error);
        }
    });
};


