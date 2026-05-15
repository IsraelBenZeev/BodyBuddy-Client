import { colors } from '@/colors';
import { calculateNutrients } from '@/src/Features/nutrition/utils/nutritionCalc';
import { useCreateNutritionEntriesBulk } from '@/src/hooks/useNutrition';
import type { MealItem, MealItemFoodInfo, MealWithItems } from '@/src/types/meal';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';

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
        id: mi.food_item_id ?? mi.food_id ?? '',
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
        food_item_id: mi.food_item_id ?? undefined,
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
            id: mi.food_item_id ?? mi.food_id ?? '',
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
          acc.carbs += Math.round(n.carbs);
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0 }
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
          <Text className="typo-h4 text-white" numberOfLines={1}>
            {meal.name_meal || 'ארוחה'}
          </Text>
          <View className="w-10" />
          <Pressable
            onPress={onClose}
            className="p-3"
            accessibilityRole="button"
            accessibilityLabel="סגור"
          >
            <Ionicons name="close" size={24} color={colors.white} />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}
        >
          <Text className="typo-label text-background-400 mb-4">
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

          <View className="mt-4 py-3 border-t border-background-700 px-4">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="typo-body-primary text-lime-400">סה״כ קלוריות</Text>
              <Text className="typo-h4 text-white">{totals.calories} קק״ל</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="typo-body-primary text-lime-500">סה״כ חלבון</Text>
              <Text className="typo-h4 text-white">{totals.protein} גרם</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="typo-body-primary text-lime-500">סה״כ פחמימות</Text>
              <Text className="typo-h4 text-white">{totals.carbs} גרם</Text>
            </View>
          </View>
        </ScrollView>

        <View className="px-5 py-4 bg-background-900 border-t border-background-700">
          <Pressable
            onPress={handleConfirm}
            disabled={isPending || items.length === 0}
            className={`rounded-2xl py-4 flex-row items-center justify-center ${
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

const MealReviewRow = React.memo(function MealReviewRow({
  mealItem,
  state,
  amount,
  onQuantityChange,
}: MealReviewRowProps) {
  const info = mealItem.food_item!;
  const isUnits = info.measurement_type === 'units';
  const unitLabel = isUnits ? 'יחידה' : 'גרם';

  const foodForCalc = {
    id: mealItem.food_item_id ?? mealItem.food_id ?? '',
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
    <View className="bg-background-800 border border-white/5 rounded-[32px] p-5 mb-4 shadow-lg">
      {/* Header Section */}
      <View className="flex-row items-start justify-between mb-5">
        <View className="flex-1 ml-4">
          <Text className="typo-h3 text-white leading-tight" numberOfLines={2}>
            {info.name}
          </Text>
          <Text className="typo-caption text-gray-500 mt-1">
            {isUnits ? `${amount} ${unitLabel}` : `${amount} גרם`}
          </Text>
        </View>

        <View className="bg-lime-500/10 px-4 py-2 rounded-2xl border border-lime-500/10 items-center justify-center">
          <Text className="text-xl font-bold text-lime-400 leading-none">{calories}</Text>
          <Text className="text-[10px] text-lime-500/70 uppercase font-bold tracking-tighter">
            קק״ל
          </Text>
        </View>
      </View>

      {/* Control Panel */}
      <View className="bg-background-900/60 p-2 rounded-[24px] border border-white/5 flex-row items-center">
        {/* Stepper Group */}
        <View className="flex-row items-center bg-background-700/50 rounded-[20px] p-1.5 border border-white/5">
          <Pressable
            onPress={() => onQuantityChange(10)}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="w-12 h-12 items-center justify-center bg-lime-500 rounded-xl shadow-sm"
          >
            <Ionicons name="add" size={26} color="#000" />
          </Pressable>

          <View className="px-5 items-center min-w-[70px]">
            <Text className="text-xl font-bold text-white">{state.quantity}</Text>
            <Text className="text-[10px] text-gray-500 font-bold uppercase">{unitLabel}</Text>
          </View>

          <Pressable
            onPress={() => onQuantityChange(-0.5)}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="w-12 h-12 items-center justify-center bg-background-600 rounded-xl border border-white/5"
          >
            <Ionicons name="remove" size={26} color="#f87171" />
          </Pressable>
        </View>

        {/* Nutrients Breakdown */}
        <View className="flex-1 items-end mr-4">
          <View className="flex-row gap-3">
            <View className="items-center">
              <Text className="text-[10px] text-blue-400 font-bold uppercase">P</Text>
              <Text className="text-sm font-bold text-blue-400">{nutrients.protein}g</Text>
            </View>
            <View className="w-[1px] h-6 bg-white/5 self-center" />
            <View className="items-center">
              <Text className="text-[10px] text-orange-400 font-bold uppercase">C</Text>
              <Text className="text-sm font-bold text-orange-400">{nutrients.carbs}g</Text>
            </View>
            <View className="w-[1px] h-6 bg-white/5 self-center" />
            <View className="items-center">
              <Text className="text-[10px] text-red-400 font-bold uppercase">F</Text>
              <Text className="text-sm font-bold text-red-400">{nutrients.fat}g</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});
