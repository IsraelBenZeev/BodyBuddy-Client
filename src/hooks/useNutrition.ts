import {
  createFoodItem,
  createMealWithItems,
  createNutritionEntriesBulk,
  createNutritionEntry,
  deleteNutritionEntriesByGroupId,
  deleteNutritionEntry,
  getFoodItems,
  getMealsWithItems,
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
    onSuccess: (_data, variables) => {
      triggerSuccess('המזון נוסף בהצלחה', 'success');
      queryClient.invalidateQueries({
        queryKey: ['nutrition-entries', variables.user_id, variables.date],
      });
      queryClient.refetchQueries({
        queryKey: ['nutrition-entries', variables.user_id, variables.date],
      });
    },
    onError: () => {
      triggerSuccess('שגיאה בהוספת מזון', 'failed');
    },
  });
};

/** הוספת מספר רשומות (למשל ארוחה שלמה) עם group_id משותף */
export const useCreateNutritionEntriesBulk = (userId: string, date: string) => {
  const queryClient = useQueryClient();
  const { triggerSuccess } = useUIStore();

  return useMutation({
    mutationFn: (payloads: CreateNutritionEntryPayload[]) =>
      createNutritionEntriesBulk(payloads),
    onSuccess: (_data, variables) => {
      if (variables.length > 0) {
        const v = variables[0];
        triggerSuccess('הארוחה נוספה ליומן', 'success');
        queryClient.invalidateQueries({
          queryKey: ['nutrition-entries', v.user_id, v.date],
        });
        queryClient.refetchQueries({
          queryKey: ['nutrition-entries', v.user_id, v.date],
        });
      }
    },
    onError: () => {
      triggerSuccess('שגיאה בהוספת הארוחה ליומן', 'failed');
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

export const useDeleteNutritionEntriesByGroupId = (userId: string, date: string) => {
  const queryClient = useQueryClient();
  const { triggerSuccess } = useUIStore();

  return useMutation({
    mutationFn: (groupId: string) => deleteNutritionEntriesByGroupId(groupId, userId),
    onSuccess: () => {
      triggerSuccess('הארוחה נמחקה', 'success');
      queryClient.invalidateQueries({ queryKey: ['nutrition-entries', userId, date] });
    },
    onError: () => {
      triggerSuccess('שגיאה במחיקת הארוחה', 'failed');
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
      category?: string;
      serving_weight?: number;
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

/** רשימת ארוחות של המשתמש (עם פריטים) */
export const useMealsWithItems = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['meals-with-items', userId],
    queryFn: () => getMealsWithItems(userId!),
    enabled: !!userId,
    staleTime: Infinity,
  });
};

/** יצירת ארוחה חדשה עם פריטים */
export const useCreateMealWithItems = (userId: string) => {
  const queryClient = useQueryClient();
  const { triggerSuccess } = useUIStore();

  return useMutation({
    mutationFn: ({
      name_meal,
      items,
    }: {
      name_meal: string;
      items: { food_item_id: string; amount_g: number }[];
    }) => createMealWithItems(userId, name_meal, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals-with-items', userId] });
      triggerSuccess('הארוחה נשמרה בהצלחה', 'success');
    },
    onError: () => {
      triggerSuccess('שגיאה בשמירת הארוחה', 'failed');
    },
  });
};
