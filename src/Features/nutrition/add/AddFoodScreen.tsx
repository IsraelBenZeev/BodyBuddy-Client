import AddNewFood from '@/src/Features/nutrition/add/AddNewFoodForm';
import { useCreateFoodItem, useCreateNutritionEntry } from '@/src/hooks/useNutrition';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import type { SliderEntryFormData } from '@/src/types/nutrition';
import BackGround from '@/src/ui/BackGround';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';

const AddFoodScreen = () => {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id) ?? '';
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const { triggerSuccess } = useUIStore();

  const params = useLocalSearchParams<{
    mode?: string;
    food_name?: string;
    protein_per_100?: string;
    carbs_per_100?: string;
    fat_per_100?: string;
    calories_per_100?: string;
    serving_weight?: string;
    category?: string;
  }>();

  const initialValues = useMemo(
    () => ({
      food_name: params.food_name,
      protein_per_100: params.protein_per_100 ? parseFloat(params.protein_per_100) : undefined,
      carbs_per_100: params.carbs_per_100 ? parseFloat(params.carbs_per_100) : undefined,
      fat_per_100: params.fat_per_100 ? parseFloat(params.fat_per_100) : undefined,
      serving_weight: params.serving_weight ? parseFloat(params.serving_weight) : undefined,
      category: params.category,
    }),
    [params]
  );

  const { mutate: createFoodItem, isPending: isCreatingFood } = useCreateFoodItem(userId);
  const { mutate: createEntry, isPending: isCreatingEntry } = useCreateNutritionEntry(
    userId,
    today
  );

  const handleSubmit = useCallback(
    (data: SliderEntryFormData, addToJournal: boolean) => {
      const calories =
        Math.round((data.protein_per_100 * 4 + data.carbs_per_100 * 4 + data.fat_per_100 * 9) * 10) / 10;

      createFoodItem(
        {
          name: data.food_name,
          category: data.category,
          serving_weight: data.serving_weight,
          protein_per_100: data.protein_per_100,
          carbs_per_100: data.carbs_per_100,
          fat_per_100: data.fat_per_100,
          calories_per_100: calories,
        },
        {
          onSuccess: (newFood) => {
            if (!addToJournal) {
              triggerSuccess('המזון נוסף בהצלחה', 'success');
              router.back();
              return;
            }
            const ratio = data.portion_size / 100;
            createEntry(
              {
                user_id: userId,
                date: today,
                food_name: newFood.name,
                protein: Math.round(newFood.protein_per_100 * ratio * 10) / 10,
                carbs: Math.round(newFood.carbs_per_100 * ratio * 10) / 10,
                fat: Math.round(newFood.fat_per_100 * ratio * 10) / 10,
                calories: Math.round(newFood.calories_per_100 * ratio * 10) / 10,
                portion_size: data.portion_size,
                portion_unit: data.portion_unit,
                serving_weight: newFood.serving_weight ?? data.serving_weight ?? undefined,
                food_item_id: newFood.id,
              },
              { onSuccess: () => router.back() }
            );
          },
        }
      );
    },
    [userId, today, createFoodItem, createEntry, router, triggerSuccess]
  );

  return (
    <BackGround>
      <AddNewFood
        onSubmit={handleSubmit}
        isPending={isCreatingFood || isCreatingEntry}
        onBack={() => router.back()}
        mode="standalone"
        initialValues={initialValues}
      />
    </BackGround>
  );
};

export default AddFoodScreen;
