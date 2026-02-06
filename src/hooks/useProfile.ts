import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrUpdateProfile, getProfile } from '../service/profileService';
import { useUIStore } from '../store/useUIStore';
import { CreateProfilePayload } from '../types/profile';

/** שליפת פרופיל משתמש */
export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
    staleTime: Infinity,
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
