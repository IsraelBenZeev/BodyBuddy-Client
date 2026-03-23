import AddNewFood from '@/src/Features/nutrition/add/food/AddNewFoodForm';
import { calculateNutrients, getPortionUnit } from '@/src/Features/nutrition/utils/nutritionCalc';
import { useCreateFoodItem, useCreateNutritionEntry } from '@/src/hooks/useNutrition';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import type { CreateFoodFormData, MeasurementType } from '@/src/types/nutrition';
import BackGround from '@/src/ui/BackGround';
import Handle from '@/src/ui/Handle';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';

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
    measurement_type?: string;
    category?: string;
    serving_amount?: string;
  }>();

  const initialValues = useMemo(
    () => ({
      food_name: params.food_name,
      protein_per_100: params.protein_per_100 ? parseFloat(params.protein_per_100) : undefined,
      carbs_per_100: params.carbs_per_100 ? parseFloat(params.carbs_per_100) : undefined,
      fat_per_100: params.fat_per_100 ? parseFloat(params.fat_per_100) : undefined,
      calories_per_100: params.calories_per_100 ? parseFloat(params.calories_per_100) : undefined,
      measurement_type: (params.measurement_type as MeasurementType) ?? 'grams',
      category: params.category,
      serving_amount: params.serving_amount ? parseFloat(params.serving_amount) : undefined,
    }),
    [params]
  );

  const { mutate: createFoodItem, isPending: isCreatingFood } = useCreateFoodItem(userId);
  const { mutate: createEntry, isPending: isCreatingEntry } = useCreateNutritionEntry(
    userId,
    today
  );

  const handleSubmit = useCallback(
    (data: CreateFoodFormData, addToJournal: boolean) => {
      const isGrams = data.measurement_type === 'grams';

      // חישוב קלוריות אם לא הוזנו ידנית (מסלול גרמים)
      const calories_per_100 = isGrams
        ? (data.calories_per_100 ??
          Math.round(
            ((data.protein_per_100 ?? 0) * 4 +
              (data.carbs_per_100 ?? 0) * 4 +
              (data.fat_per_100 ?? 0) * 9) *
              10
          ) / 10)
        : null;

      createFoodItem(
        {
          name: data.food_name,
          category: data.category,
          measurement_type: data.measurement_type,
          // grams
          calories_per_100: isGrams ? calories_per_100 : 0,
          protein_per_100: isGrams ? (data.protein_per_100 ?? 0) : 0,
          carbs_per_100: isGrams ? (data.carbs_per_100 ?? 0) : 0,
          fat_per_100: isGrams ? (data.fat_per_100 ?? 0) : 0,
          // units
          calories_per_unit: !isGrams ? (data.calories_per_unit ?? null) : null,
          protein_per_unit: !isGrams ? (data.protein_per_unit ?? null) : null,
          carbs_per_unit: !isGrams ? (data.carbs_per_unit ?? null) : null,
          fat_per_unit: !isGrams ? (data.fat_per_unit ?? null) : null,
        },
        {
          onSuccess: (newFood) => {
            if (!addToJournal) {
              triggerSuccess('המזון נוסף בהצלחה', 'success');
              router.back();
              return;
            }

            const amount = data.portion_size ?? (newFood.measurement_type === 'units' ? 1 : 100);
            const nutrients = calculateNutrients(newFood, amount);
            const portionUnit = getPortionUnit(newFood);

            createEntry(
              {
                user_id: userId,
                date: today,
                food_name: newFood.name,
                ...nutrients,
                portion_size: amount,
                portion_unit: portionUnit,
                food_item_id: newFood.id,
              },
              {
                onSuccess: () => router.back(),
                onError: () => triggerSuccess('שגיאה בהוספה ליומן', 'failed'),
              }
            );
          },
          onError: () => triggerSuccess('שגיאה בשמירת המזון', 'failed'),
        }
      );
    },
    [userId, today, createFoodItem, createEntry, router, triggerSuccess]
  );

  return (
    <BackGround>
      <View className="flex-1">
        <View className="items-center pt-3 pb-2">
          <Handle />
        </View>
        <View className="flex-row justify-end px-5 pb-2">
          <Pressable
            onPress={() => router.back()}
            className="bg-background-800 w-11 h-11 rounded-xl items-center justify-center border border-white/10"
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="סגור"
          >
            <Ionicons name="close" size={20} color="#fff" />
          </Pressable>
        </View>
        <AddNewFood
          onSubmit={handleSubmit}
          isPending={isCreatingFood || isCreatingEntry}
          onBack={() => router.back()}
          mode="standalone"
          initialValues={initialValues}
          defaultConsumedAmount={initialValues.serving_amount}
        />
      </View>
    </BackGround>
  );
};

export default AddFoodScreen;
