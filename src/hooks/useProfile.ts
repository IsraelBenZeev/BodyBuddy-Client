import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrUpdateProfile, getProfile, updateProfileDisplaySettings } from '../service/profileService';
import { useUIStore } from '../store/useUIStore';
import { CreateProfilePayload, Profile } from '../types/profile';

/** שליפת פרופיל משתמש */
export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
    staleTime: Infinity,
  });
};

/** עדכון הגדרות תצוגה עם optimistic update */
export const useUpdateProfileDisplaySettings = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: { show_carbs_bar?: boolean; show_fat_bar?: boolean }) =>
      updateProfileDisplaySettings(userId, settings),
    onMutate: async (settings) => {
      await queryClient.cancelQueries({ queryKey: ['profile', userId] });
      const previous = queryClient.getQueryData<Profile | null>(['profile', userId]);
      queryClient.setQueryData<Profile | null>(['profile', userId], (old) =>
        old ? { ...old, ...settings } : old
      );
      return { previous };
    },
    onError: (_err, _settings, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(['profile', userId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
};

/** יצירה/עדכון פרופיל – mutation עם invalidation */
export const useCreateOrUpdateProfile = (userId: string) => {
  const queryClient = useQueryClient();
  const { triggerSuccess } = useUIStore();

  return useMutation({
    mutationFn: (payload: CreateProfilePayload) =>
      createOrUpdateProfile(userId, payload),
    onSuccess: () => {
      triggerSuccess('הפרופיל נשמר בהצלחה', 'success');
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
    onError: () => {
      triggerSuccess('שגיאה בשמירת הפרופיל', 'failed');
    },
  });
};
