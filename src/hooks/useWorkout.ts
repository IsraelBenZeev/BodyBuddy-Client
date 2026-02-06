import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addExerciseToPlan, createNewWorkoutPlan, deleteWorkoutPlan, getExercisesIdsByWorkoutPlanId, getWorkoutPlanById, getWorkoutsByUserUserId } from '../service/workoutService';
import { useUIStore } from '../store/useUIStore';
import { modeAddWorkoutPlan } from '../types/mode';
import { WorkoutPlan } from '../types/workout';

export const useWorkoutsPlans = (user_id: string, onlyNames: boolean = false) => {
  return useQuery({
    queryKey: ['workoutPlans', user_id],
    queryFn: () => getWorkoutsByUserUserId(user_id),
    staleTime: Infinity,
    enabled: !!user_id,
    select: (data) => {
      if (!data) return [];
      if (onlyNames) {
        return data.map((plan: WorkoutPlan) => ({
          id: plan.id,
          name: plan.title
        }));
      }
      return data as WorkoutPlan[];
    }
  });
};
export const useWorkoutPlan = (planId: string, user_id: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['workoutPlan', planId],
    queryFn: () => getWorkoutPlanById(planId),
    enabled: !!planId && !!user_id,
    staleTime: Infinity,

    initialData: () => {
      const allPlans = queryClient.getQueryData<WorkoutPlan[]>(['workoutPlans', user_id]);
      return allPlans?.find((p) => p.id === planId) as WorkoutPlan;
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(['workoutPlans', user_id])?.dataUpdatedAt,
  });
};
export const useGetWorkoutFromCache = (id: string | undefined, user_id: string) => {
  return useQuery({
    queryKey: ['workoutPlans', user_id],
    queryFn: () => getWorkoutsByUserUserId(user_id),
    select: (plans) => plans?.find((p) => p.id === id),
    staleTime: Infinity,
    enabled: !!id && !!user_id,
  });
};




export const useCreateWorkoutPlan = (user_id: string, mode: modeAddWorkoutPlan) => {
  const queryClient = useQueryClient();
  const { triggerSuccess } = useUIStore();
  return useMutation({
    mutationFn: (newWorkoutPlan: WorkoutPlan) => createNewWorkoutPlan(newWorkoutPlan),
    onSuccess: async (data, variables) => {
      triggerSuccess(mode === "create" ? "נוצר בהצלחה" : "עודכן בהצלחה", "success");
      queryClient.invalidateQueries({
        queryKey: ['workoutPlans', user_id]
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ['workoutPlan', variables.id]
        });
      }
    },
  });
};
export const useAddExerciseToPlan = (user_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idExercise, planIds }: { idExercise: string, planIds: string[] }) =>
      addExerciseToPlan(idExercise, planIds),
    // onSuccess: async () => {
    //   console.log("Exercises added, invalidating cache...");
    //   return await queryClient.invalidateQueries({
    //     queryKey: ['workoutPlans', user_id]
    //         // queryKey: ['workoutPlan', planId],

    //   });
    // },

    onSuccess: async (data, variables) => {
      const refreshList = queryClient.invalidateQueries({
        queryKey: ['workoutPlans', user_id]
      });
      const refreshIndividualPlans = variables.planIds.map(planId =>
        queryClient.invalidateQueries({
          queryKey: ['workoutPlan', planId]
        })
      );
      await Promise.all([refreshList, ...refreshIndividualPlans]);
    },

    onError: (error) => {
      console.error("Mutation error:", error);
    }
  });
};

export const useDeleteWorkoutPlan = (user_id: string) => {
  const queryClient = useQueryClient();
  const { triggerSuccess } = useUIStore();
  return useMutation({
    mutationFn: (planId: string) => deleteWorkoutPlan(planId),
    onSuccess: async () => {
      triggerSuccess("נמחק בהצלחה", "success");
      queryClient.refetchQueries({ queryKey: ['workoutsPlans', user_id] });
      return await queryClient.invalidateQueries({
        queryKey: ['workoutPlans', user_id]
      });
    },
  });
};

export const useGetExercisesIdsByWorkoutPlans = (workoutPlanId: string, user_id: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['exercisesWorkoutPlanIds', workoutPlanId, user_id],
    queryFn: () => getExercisesIdsByWorkoutPlanId(workoutPlanId),
    enabled: !!workoutPlanId && !!user_id,
    staleTime: Infinity,
  });
}
