import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createNewWorkoutPlan, deleteWorkoutPlan, getWorkoutPlanById, getWorkoutsByUserId } from '../service/workoutService';
import { WorkoutPlan } from '../types/workout';

export const useWorkoutsPlans = (user_id: string) => {
  return useQuery({
    queryKey: ['workoutsPlans', user_id],
    queryFn: () => getWorkoutsByUserId(user_id),
    staleTime: Infinity,
    enabled: !!user_id,
  });
};
export const useGetWorkoutPlanById = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['workout_plan_detail', id],
    queryFn: async () => {
      if (!id) return null;
      const allQueriesData = queryClient.getQueriesData({ queryKey: ['workoutsPlans'] });
      const flattenedPlans = allQueriesData.flatMap(([_, data]) => {
        if (Array.isArray(data)) return data;
        return [];
      });
      const cachedPlan = flattenedPlans.find(p => p.id === id);
      if (cachedPlan) {
        return cachedPlan;
      }
      const plan = await getWorkoutPlanById(id);
      return plan as WorkoutPlan;
    },
    enabled: !!id,
    staleTime: Infinity,
  });
};

export const useCreateWorkoutPlan = (user_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newWorkoutPlan: WorkoutPlan) => createNewWorkoutPlan(newWorkoutPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutsPlans', user_id] });
    },
  });
};
export const useDeleteWorkoutPlan = (user_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => deleteWorkoutPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutsPlans', user_id] });
    },
  });
};
