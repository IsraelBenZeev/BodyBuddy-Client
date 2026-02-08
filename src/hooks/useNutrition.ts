import {
  createFoodItem,
  createNutritionEntry,
  deleteNutritionEntry,
  getFoodItems,
  getNutritionEntries,
} from '@/src/service/nutritionService';
import { useUIStore } from '@/src/store/useUIStore';
import type { CreateNutritionEntryPayload } from '@/src/types/nutrition';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useNutritionEntries = (userId: string | undefined, date: string) => {
  return useQuery({
    queryKey: ['nutrition-entries', userId, date],
    queryFn: () => getNutritionEntries(userId!, date),
    enabled: !!userId,
    staleTime: Infinity,
  });
};

export const useCreateNutritionEntry = (userId: string, date: string) => {
  const queryClient = useQueryClient();
  const { triggerSuccess } = useUIStore();

  return useMutation({
    mutationFn: (payload: CreateNutritionEntryPayload) =>
      createNutritionEntry(payload),
    onSuccess: () => {
      triggerSuccess('המזון נוסף בהצלחה', 'success');
      queryClient.invalidateQueries({ queryKey: ['nutrition-entries', userId, date] });
    },
    onError: () => {
      triggerSuccess('שגיאה בהוספת מזון', 'failed');
    },
  });
};

export const useDeleteNutritionEntry = (userId: string, date: string) => {
  const queryClient = useQueryClient();
  const { triggerSuccess } = useUIStore();

  return useMutation({
    mutationFn: (entryId: string) => deleteNutritionEntry(entryId, userId),
    onSuccess: () => {
      triggerSuccess('הרשומה נמחקה', 'success');
      queryClient.invalidateQueries({ queryKey: ['nutrition-entries', userId, date] });
    },
    onError: () => {
      triggerSuccess('שגיאה במחיקת הרשומה', 'failed');
    },
  });
};

/** מאכלים לבחירה: גלובליים + של המשתמש (מ־food_items) */
export const useFoodItems = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['food-items', userId],
    queryFn: () => getFoodItems(userId!),
    enabled: !!userId,
    staleTime: Infinity,
  });
};

export const useCreateFoodItem = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (foodData: {
      name: string;
      protein_per_100: number;
      carbs_per_100: number;
      fat_per_100: number;
      calories_per_100: number;
    }) => createFoodItem(userId, foodData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-items', userId] });
    },
  });
};
