import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createNewWorkoutPlan, deleteWorkoutPlan, getWorkoutsByUserUserId } from '../service/workoutService';
import { WorkoutPlan } from '../types/workout';

export const useWorkoutsPlans = (user_id: string) => {
  return useQuery({
    queryKey: ['workoutsPlans', user_id],
    queryFn: () => getWorkoutsByUserUserId(user_id),
    staleTime: Infinity,
    enabled: !!user_id,
  });
};
export const useGetWorkoutFromCache = (id: string | undefined, user_id: string) => {
  return useQuery({
    queryKey: ['workoutsPlans', user_id],
    queryFn: () => getWorkoutsByUserUserId(user_id),
    select: (plans) => plans?.find((p) => p.id === id),
    staleTime: Infinity,
    enabled: !!id && !!user_id,
  });
};


export const useCreateWorkoutPlan = (user_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newWorkoutPlan: WorkoutPlan) => createNewWorkoutPlan(newWorkoutPlan),
    onSuccess: async () => {
      console.log("Plan created/updated, refreshing cache...");
      return await queryClient.invalidateQueries({
        queryKey: ['workoutsPlans', user_id]
      });
    },
  });
};
// export const useDeleteWorkoutPlan = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (planId: string) => deleteWorkoutPlan(planId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['workoutsPlans'] });
//     },
//   });
// };
export const useDeleteWorkoutPlan = (user_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => deleteWorkoutPlan(planId),
    onSuccess: async () => {
      console.log("Plan deleted, invalidating main list...");
      queryClient.refetchQueries({ queryKey: ['workoutsPlans', user_id] });
      return await queryClient.invalidateQueries({
        queryKey: ['workoutsPlans', user_id]
      });
    },
  });
};
