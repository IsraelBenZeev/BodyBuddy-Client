import { colors } from '@/colors';
import { calculateNutrients } from '@/src/Features/nutrition/utils/nutritionCalc';
import { useCreateNutritionEntriesBulk } from '@/src/hooks/useNutrition';
import type { MealItem, MealItemFoodInfo, MealWithItems } from '@/src/types/meal';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

interface Props {
  visible: boolean;
  meal: MealWithItems | null;
  userId: string;
  date: string;
  onClose: () => void;
  onSuccess?: () => void;
}

/** לכל פריט: כמות (מנות/יחידות) */
interface ItemRowState {
  quantity: number;
}

export default function MealReviewModal({
  visible,
  meal,
  userId,
  date,
  onClose,
  onSuccess,
}: Props) {
  const [rowState, setRowState] = useState<Record<string, ItemRowState>>({});

  /** מאתחל כמות התחלתית מה-amount_g שנשמר */
  useEffect(() => {
    if (!visible || !meal?.meal_items?.length) return;
    const initial: Record<string, ItemRowState> = {};
    for (const mi of meal.meal_items) {
      if (!mi.food_item) continue;
      initial[mi.id] = { quantity: Math.max(0.5, mi.amount_g) };
    }
    setRowState(initial);
  }, [visible, meal]);

  const { mutate: addToJournal, isPending } = useCreateNutritionEntriesBulk(userId, date);

  const items = useMemo(() => meal?.meal_items?.filter((mi) => mi.food_item) ?? [], [meal]);

  const getState = useCallback(
    (mi: (typeof items)[0]): ItemRowState => rowState[mi.id] ?? { quantity: 1 },
    [rowState]
  );

  const getAmount = useCallback(
    (mi: (typeof items)[0]): number => getState(mi).quantity,
    [getState]
  );

  const setQuantity = useCallback((miId: string, delta: number) => {
    setRowState((prev) => {
      const cur = prev[miId] ?? { quantity: 1 };
      const nextQ = Math.max(0.5, Math.round((cur.quantity + delta) * 2) / 2);
      return { ...prev, [miId]: { quantity: nextQ } };
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (!meal || items.length === 0) return;
    const groupId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });

    const payloads = items.map((mi) => {
      const amount = getAmount(mi);
      const info = mi.food_item!;
      const foodForCalc = {
        id: mi.food_item_id,
        name: info.name,
        measurement_type: info.measurement_type,
        unit_weight_g: info.unit_weight_g ?? null,
        calories_per_100: info.calories_per_100,
        protein_per_100: info.protein_per_100,
        carbs_per_100: info.carbs_per_100,
        fat_per_100: info.fat_per_100,
        calories_per_unit: info.calories_per_unit ?? null,
        protein_per_unit: info.protein_per_unit ?? null,
        carbs_per_unit: info.carbs_per_unit ?? null,
        fat_per_unit: info.fat_per_unit ?? null,
        is_active: true,
        created_at: '',
        updated_at: '',
      };
      const nutrients = calculateNutrients(foodForCalc, amount);
      return {
        user_id: userId,
        date,
        food_name: info.name,
        portion_size: amount,
        protein: nutrients.protein,
        carbs: nutrients.carbs,
        fat: nutrients.fat,
        calories: Math.round(nutrients.calories),
        portion_unit: (info.measurement_type === 'units' ? 'unit' : 'g') as 'g' | 'unit',
        food_item_id: mi.food_item_id,
        group_id: groupId,
        group_name: meal.name_meal || 'ארוחה',
      };
    });
    addToJournal(payloads, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
      },
    });
  }, [meal, items, getAmount, userId, date, addToJournal, onSuccess, onClose]);

  const totals = useMemo(
    () =>
      items.reduce(
        (acc, mi) => {
          const amount = getAmount(mi);
          const info = mi.food_item!;
          const foodForCalc = {
            id: mi.food_item_id,
            name: info.name,
            measurement_type: info.measurement_type,
            unit_weight_g: info.unit_weight_g ?? null,
            calories_per_100: info.calories_per_100,
            protein_per_100: info.protein_per_100,
            carbs_per_100: info.carbs_per_100,
            fat_per_100: info.fat_per_100,
            calories_per_unit: info.calories_per_unit ?? null,
            protein_per_unit: info.protein_per_unit ?? null,
            carbs_per_unit: info.carbs_per_unit ?? null,
            fat_per_unit: info.fat_per_unit ?? null,
            is_active: true,
            created_at: '',
            updated_at: '',
          };
          const n = calculateNutrients(foodForCalc, amount);
          acc.calories += Math.round(n.calories);
          acc.protein += Math.round(n.protein);
          return acc;
        },
        { calories: 0, protein: 0 }
      ),
    [items, getAmount]
  );

  if (!meal) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background[900] }}>
        <View className="flex-row items-center justify-between border-b border-background-700 px-5 py-3">
          <Pressable onPress={onClose} className="p-3" accessibilityRole="button" accessibilityLabel="סגור">
            <Ionicons name="close" size={24} color={colors.white} />
          </Pressable>
          <Text className="typo-h4 text-white" numberOfLines={1}>
            {meal.name_meal || 'ארוחה'}
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}
        >
          <Text className="typo-label text-background-400 mb-4 text-right">
            התאם כמות לכל מאכל ואז אשר להוספה ליומן
          </Text>

          {items.map((mi) => (
            <MealReviewRow
              key={mi.id}
              mealItem={mi}
              state={getState(mi)}
              amount={getAmount(mi)}
              onQuantityChange={(delta) => setQuantity(mi.id, delta)}
            />
          ))}

          <View className="mt-4 py-3 border-t border-background-700">
            <View className="flex-row-reverse items-center justify-between mb-1">
              <Text className="typo-body-primary text-lime-400">סה״כ קלוריות</Text>
              <Text className="typo-h4 text-white">{totals.calories} קק״ל</Text>
            </View>
            <View className="flex-row-reverse items-center justify-between">
              <Text className="typo-body-primary text-lime-500">סה״כ חלבון</Text>
              <Text className="typo-h4 text-white">{totals.protein} גרם</Text>
            </View>
          </View>
        </ScrollView>

        <View className="px-5 py-4 bg-background-900 border-t border-background-700">
          <Pressable
            onPress={handleConfirm}
            disabled={isPending || items.length === 0}
            className={`rounded-2xl py-4 flex-row-reverse items-center justify-center ${
              isPending || items.length === 0 ? 'bg-background-700 opacity-60' : 'bg-lime-500'
            }`}
            accessibilityRole="button"
            accessibilityLabel="הוסף ליומן"
          >
            {isPending ? (
              <ActivityIndicator color={colors.background[900]} size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color={colors.background[900]} />
                <Text className="typo-btn-cta text-background-900 mr-2">הוסף ליומן</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

interface MealReviewRowProps {
  mealItem: MealItem & { food_item?: MealItemFoodInfo };
  state: ItemRowState;
  amount: number;
  onQuantityChange: (delta: number) => void;
}

const MealReviewRow = React.memo(function MealReviewRow({ mealItem, state, amount, onQuantityChange }: MealReviewRowProps) {
  const info = mealItem.food_item!;
  const isUnits = info.measurement_type === 'units';
  const unitLabel = isUnits ? 'יחידה' : 'גרם';

  const foodForCalc = {
    id: mealItem.food_item_id,
    name: info.name,
    measurement_type: info.measurement_type,
    unit_weight_g: info.unit_weight_g ?? null,
    calories_per_100: info.calories_per_100,
    protein_per_100: info.protein_per_100,
    carbs_per_100: info.carbs_per_100,
    fat_per_100: info.fat_per_100,
    calories_per_unit: info.calories_per_unit ?? null,
    protein_per_unit: info.protein_per_unit ?? null,
    carbs_per_unit: info.carbs_per_unit ?? null,
    fat_per_unit: info.fat_per_unit ?? null,
    is_active: true,
    created_at: '',
    updated_at: '',
  };

  const nutrients = calculateNutrients(foodForCalc, amount);
  const calories = Math.round(nutrients.calories);

  return (
    <View className="bg-background-800 border border-white/5 rounded-3xl p-4 mb-4 shadow-sm">
      {/* שורה עליונה: שם וקלוריות */}
      <View className="flex-row-reverse items-center justify-between mb-3">
        <View className="flex-1 ml-3">
          <Text className="typo-h4 text-white text-right" numberOfLines={2}>
            {info.name}
          </Text>
        </View>
        <View className="items-end">
          <Text className="typo-h4 text-lime-500">{calories}</Text>
          <Text className="typo-caption text-gray-500">קק״ל</Text>
        </View>
      </View>

      {/* אזור השליטה בכמות */}
      <View className="flex-row-reverse items-center justify-between bg-background-900/40 p-3 rounded-2xl border border-white/5">
        <View className="flex-row-reverse items-center bg-background-700 rounded-xl p-1 shadow-inner">
          <Pressable
            onPress={() => onQuantityChange(0.5)}
            className="w-11 h-11 items-center justify-center bg-lime-500/10 rounded-lg active:bg-lime-500/20"
            accessibilityRole="button"
            accessibilityLabel={`הגדל כמות ${info.name}`}
          >
            <Ionicons name="add" size={22} color="#84cc16" />
          </Pressable>

          <View className="px-4 items-center">
            <Text className="typo-h4 text-white">{state.quantity}</Text>
            <Text className="typo-caption-bold text-gray-500 uppercase">{unitLabel}</Text>
          </View>

          <Pressable
            onPress={() => onQuantityChange(-0.5)}
            className="w-11 h-11 items-center justify-center bg-white/5 rounded-lg active:bg-white/10"
            accessibilityRole="button"
            accessibilityLabel={`הפחת כמות ${info.name}`}
          >
            <Ionicons name="remove" size={22} color="#f87171" />
          </Pressable>
        </View>

        {/* תצוגת חישוב */}
        <View className="flex-1 items-center mr-4">
          <Text className="typo-caption text-gray-400 text-center mb-1">
            {isUnits ? `${amount} ${unitLabel}` : `${amount} גרם`}
          </Text>
          <View className="flex-row-reverse gap-2">
            <Text className="typo-caption text-lime-400">P {nutrients.protein}g</Text>
          </View>
        </View>
      </View>
    </View>
  );
});
