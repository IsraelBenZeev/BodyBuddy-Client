import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createNewWorkoutPlan, getWorkoutsByUserId } from '../service/workoutService';
import { WorkoutPlan } from '../types/workout';

export const useWorkoutsPlans = (user_id: string) => {
  return useQuery({
    queryKey: ['workoutsPlans', user_id],
    queryFn: () => getWorkoutsByUserId(user_id),
    staleTime: Infinity,
    enabled: !!user_id,
  });
};
export const useCreateWorkoutPlan = (user_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newWorkoutPlan: WorkoutPlan) => createNewWorkoutPlan(newWorkoutPlan),
    onSuccess: () => {
      console.log('אימון נוסף בהצלחה');
      queryClient.invalidateQueries({ queryKey: ['workoutsPlans', user_id] });
    },
  });
};
