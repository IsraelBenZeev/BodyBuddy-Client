import { colors } from '@/colors';
import { calculateNutrients } from '@/src/Features/nutrition/utils/nutritionCalc';
import { useCreateNutritionEntriesBulk } from '@/src/hooks/useNutrition';
import type { MealItem, MealItemFoodInfo, MealWithItems } from '@/src/types/meal';
import ActionButton from '@/src/ui/ActionButton';
import CloseButton from '@/src/ui/CloseButton';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  visible: boolean;
  meal: MealWithItems | null;
  userId: string;
  date: string;
  onClose: () => void;
  onSuccess?: () => void;
}

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
  const { bottom } = useSafeAreaInsets();
  const [rowState, setRowState] = useState<Record<string, ItemRowState>>({});
  const createUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.floor(Math.random() * 16);
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
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
        : createUuid();

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
          acc.fat += Math.round(n.fat);
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
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
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
          <View>
            <Text className="text-lime-400 text-[10px] font-bold uppercase tracking-[2px] mb-1">
              סקירת ארוחה
            </Text>
            <Text className="text-white text-2xl font-light tracking-tight">
              {meal.name_meal || 'ארוחה חדשה'}
            </Text>
          </View>
          <CloseButton onPress={onClose} variant="default" size={40} iconSize={20} />
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 }}
        >
          {items.map((mi) => (
            <MealReviewRow
              key={mi.id}
              mealItem={mi}
              state={getState(mi)}
              amount={getAmount(mi)}
              onQuantityChange={(delta) => setQuantity(mi.id, delta)}
            />
          ))}

          <View className="bg-lime-500/[0.05] rounded-3xl p-5 border border-lime-500/20 mt-2">
            <Text className="typo-caption-bold text-lime-400 mb-4 text-center tracking-widest">
              סה״כ ארוחה
            </Text>
            <View className="bg-lime-500/10 border border-lime-500/25 rounded-2xl p-4 mb-3 items-center">
              <Text className="typo-caption text-lime-400 mb-0.5">קלוריות</Text>
              <View className="flex-row items-baseline gap-1.5">
                <Text className="text-4xl font-black text-white">{totals.calories}</Text>
                <Text className="typo-body-primary text-lime-400 font-bold">קק״ל</Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1 bg-blue-500/[0.06] border border-blue-500/20 rounded-2xl p-3 items-center">
                <Text className="typo-caption text-blue-400 mb-0.5">חלבון</Text>
                <Text className="typo-h4 text-white">{totals.protein}</Text>
                <Text className="typo-caption text-background-500">גרם</Text>
              </View>
              <View className="flex-1 bg-amber-500/[0.06] border border-amber-500/20 rounded-2xl p-3 items-center">
                <Text className="typo-caption text-amber-400 mb-0.5">פחמימות</Text>
                <Text className="typo-h4 text-white">{totals.carbs}</Text>
                <Text className="typo-caption text-background-500">גרם</Text>
              </View>
              <View className="flex-1 bg-red-500/[0.06] border border-red-500/20 rounded-2xl p-3 items-center">
                <Text className="typo-caption text-red-400 mb-0.5">שומן</Text>
                <Text className="typo-h4 text-white">{totals.fat}</Text>
                <Text className="typo-caption text-background-500">גרם</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* <View
          className="px-5 pt-4 bg-none border-none"
          style={{ paddingBottom: bottom }}
        > */}
          {/* <Pressable
            onPress={handleConfirm}
            disabled={isPending || items.length === 0}
            className={`h-16 rounded-3xl flex-row items-center justify-center ${
              isPending || items.length === 0 ? 'bg-background-800' : 'bg-lime-500'
            }`}
          >
            {isPending ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <Text className="text-background-900 font-black text-lg">הוסף ליומן</Text>
            )}
          </Pressable> */}
          <ActionButton
            onPress={handleConfirm}
            disabled={isPending || items.length === 0}
            label="הוסף ליומן"
            iconName="checkmark-circle"
            variant="outline"
            fullWidth
            
          />
        {/* </View> */}
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
  const unitLabel = isUnits ? 'יח׳' : 'גרם';

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
    <View className="bg-white/[0.03] rounded-3xl p-5 border border-white/[0.05] mb-4">
      <View className="flex-row items-center justify-between mb-5">
        <View>
          <Text className="text-white text-lg font-medium">{info.name}</Text>
          <Text className="text-background-500 text-xs mt-0.5">
            {amount} {isUnits ? 'יחידות' : 'גרם'}
          </Text>
        </View>
        <View className="bg-lime-400/10 px-3 py-1 rounded-full">
          <Text className="text-lime-400 font-bold text-xs">{calories} קק״ל</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <Pressable
          onPress={() => onQuantityChange(-(isUnits ? 0.5 : 10))}
          className="w-12 h-12 items-center justify-center bg-background-700 rounded-xl border border-background-600 active:scale-95"
          accessibilityRole="button"
          accessibilityLabel="הקטן כמות"
        >
          <Ionicons name="remove" size={22} color="#fff" />
        </Pressable>

        <View className="items-center flex-1">
          <Text className="text-4xl font-bold text-white">{state.quantity}</Text>
          <Text className="typo-label text-background-400 mt-1">{unitLabel}</Text>
        </View>

        <Pressable
          onPress={() => onQuantityChange(isUnits ? 0.5 : 10)}
          className="w-12 h-12 items-center justify-center bg-lime-500 rounded-xl active:scale-95"
          accessibilityRole="button"
          accessibilityLabel="הגדל כמות"
        >
          <Ionicons name="add" size={22} color="#000" />
        </Pressable>
      </View>

      <View className="flex-row gap-1.5">
        <View className="flex-1 bg-lime-500/[0.06] border border-lime-500/15 rounded-xl p-2 items-center">
          <Text className="typo-label text-white font-bold">{calories}</Text>
          <Text className="typo-caption text-lime-400">קק״ל</Text>
        </View>
        <View className="flex-1 bg-blue-500/[0.06] border border-blue-500/15 rounded-xl p-2 items-center">
          <Text className="typo-label text-white font-bold">{nutrients.protein}</Text>
          <Text className="typo-caption text-blue-400">חלבון</Text>
        </View>
        <View className="flex-1 bg-amber-500/[0.06] border border-amber-500/15 rounded-xl p-2 items-center">
          <Text className="typo-label text-white font-bold">{nutrients.carbs}</Text>
          <Text className="typo-caption text-amber-400">פחמ׳</Text>
        </View>
        <View className="flex-1 bg-red-500/[0.06] border border-red-500/15 rounded-xl p-2 items-center">
          <Text className="typo-label text-white font-bold">{nutrients.fat}</Text>
          <Text className="typo-caption text-red-400">שומן</Text>
        </View>
      </View>
    </View>
  );
});
