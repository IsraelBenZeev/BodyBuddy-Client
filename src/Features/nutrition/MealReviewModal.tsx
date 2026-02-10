import { colors } from '@/colors';
import { useCreateNutritionEntriesBulk } from '@/src/hooks/useNutrition';
import type { MealItem, MealWithItems } from '@/src/types/meal';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
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

/** לכל פריט: כמות (מנות) וערך גרם ידני אופציונלי */
interface ItemRowState {
  quantity: number;
  manualGrams: number | null;
}

const DEFAULT_SERVING = 100;

function getServingWeight(
  mi: MealItem & { food_item?: { serving_weight?: number } }
): number {
  const sw = mi.food_item?.serving_weight;
  return sw != null && sw > 0 ? sw : DEFAULT_SERVING;
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

  const { mutate: addToJournal, isPending } = useCreateNutritionEntriesBulk(
    userId,
    date
  );

  const items = useMemo(
    () => meal?.meal_items?.filter((mi) => mi.food_item) ?? [],
    [meal]
  );

  const getState = useCallback(
    (mi: (typeof items)[0]): ItemRowState => {
      return (
        rowState[mi.id] ?? {
          quantity: 1,
          manualGrams: null,
        }
      );
    },
    [rowState]
  );

  const getGrams = useCallback(
    (mi: (typeof items)[0]): number => {
      const state = getState(mi);
      if (state.manualGrams != null) return state.manualGrams;
      return state.quantity * getServingWeight(mi);
    },
    [getState, items]
  );

  const setQuantity = useCallback((miId: string, delta: number) => {
    setRowState((prev) => {
      const cur = prev[miId] ?? { quantity: 1, manualGrams: null };
      const nextQ = Math.max(1, cur.quantity + delta);
      return {
        ...prev,
        [miId]: { quantity: nextQ, manualGrams: null },
      };
    });
  }, []);

  const setManualGrams = useCallback((miId: string, value: number | null) => {
    setRowState((prev) => {
      const cur = prev[miId] ?? { quantity: 1, manualGrams: null };
      return { ...prev, [miId]: { ...cur, manualGrams: value } };
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
      const grams = getGrams(mi);
      const info = mi.food_item!;
      const ratio = grams / 100;
      return {
        user_id: userId,
        date,
        food_name: info.name,
        portion_size: Math.round(grams),
        protein: Math.round(info.protein_per_100 * ratio * 10) / 10,
        carbs: Math.round(info.carbs_per_100 * ratio * 10) / 10,
        fat: Math.round(info.fat_per_100 * ratio * 10) / 10,
        calories: Math.round(info.calories_per_100 * ratio * 10) / 10,
        portion_unit: 'g' as const,
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
  }, [meal, items, getGrams, userId, date, addToJournal, onSuccess, onClose]);

  const totalCal = useMemo(
    () =>
      items.reduce((sum, mi) => {
        const grams = getGrams(mi);
        const info = mi.food_item!;
        return sum + Math.round((info.calories_per_100 * grams) / 100);
      }, 0),
    [items, getGrams]
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
        <View className="flex-row items-center justify-between border-b border-background-700 px-4 py-3">
          <Pressable onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color={colors.white} />
          </Pressable>
          <Text className="text-white text-lg font-bold" numberOfLines={1}>
            {meal.name_meal || 'ארוחה'}
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <Text className="text-background-400 text-sm mb-4 text-right">
            התאם כמות לכל מאכל ואז אשר להוספה ליומן
          </Text>

          {items.map((mi) => (
            <MealReviewRow
              key={mi.id}
              mealItem={mi}
              state={getState(mi)}
              grams={getGrams(mi)}
              servingWeight={getServingWeight(mi)}
              onQuantityChange={(delta) => setQuantity(mi.id, delta)}
              onManualGramsChange={(v) => setManualGrams(mi.id, v)}
            />
          ))}

          <View className="mt-4 py-3 border-t border-background-700 flex-row-reverse items-center justify-between">
            <Text className="text-lime-400 font-bold">סה״כ קלוריות</Text>
            <Text className="text-white text-lg font-black">{totalCal} קק״ל</Text>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 p-4 bg-background-900 border-t border-background-700">
          <Pressable
            onPress={handleConfirm}
            disabled={isPending || items.length === 0}
            className={`rounded-2xl py-4 flex-row-reverse items-center justify-center ${
              isPending || items.length === 0
                ? 'bg-background-700 opacity-60'
                : 'bg-lime-500'
            }`}
          >
            {isPending ? (
              <ActivityIndicator color={colors.background[900]} size="small" />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.background[900]}
                />
                <Text className="text-background-900 font-black text-base mr-2">
                  הוסף ליומן
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

interface MealReviewRowProps {
  mealItem: MealItem & { food_item?: { name: string; calories_per_100: number; protein_per_100: number; carbs_per_100: number; fat_per_100: number; serving_weight?: number } };
  state: ItemRowState;
  grams: number;
  servingWeight: number;
  onQuantityChange: (delta: number) => void;
  onManualGramsChange: (grams: number | null) => void;
}

function MealReviewRow({
  mealItem,
  state,
  grams,
  servingWeight,
  onQuantityChange,
  onManualGramsChange,
}: MealReviewRowProps) {
  const [editGrams, setEditGrams] = useState(false);
  const [inputValue, setInputValue] = useState(String(grams));
  const info = mealItem.food_item!;
  const calories = Math.round((info.calories_per_100 * grams) / 100);

  useEffect(() => {
    if (state.manualGrams === null && editGrams) setEditGrams(false);
  }, [state.manualGrams, editGrams]);

  const applyManualGrams = () => {
    const n = parseInt(inputValue, 10);
    if (!Number.isNaN(n) && n >= 0) {
      onManualGramsChange(n);
      setEditGrams(false);
    } else {
      onManualGramsChange(null);
      setInputValue(String(state.quantity * servingWeight));
      setEditGrams(false);
    }
  };

  return (
    <View className="bg-background-800 border border-background-600 rounded-xl p-3.5 mb-3">
      <View className="flex-row-reverse items-center justify-between mb-2">
        <Text className="text-white font-bold text-right flex-1 mr-2" numberOfLines={1}>
          {info.name}
        </Text>
        <Text className="text-background-400 text-xs">{calories} קק״ל</Text>
      </View>
      <View className="flex-row-reverse items-center mb-2">
        <Ionicons name="information-circle-outline" size={14} color={colors.background[400]} />
        <Text className="text-background-400 text-xs mr-1">מנה: {servingWeight}g</Text>
      </View>

      <View className="flex-row-reverse items-center flex-wrap gap-2">
        {/* כמות (מנות) */}
        <View className="flex-row-reverse items-center bg-background-700 rounded-lg">
          <Pressable
            onPress={() => onQuantityChange(1)}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="add" size={20} color={colors.lime[500]} />
          </Pressable>
          <Text className="text-white font-bold min-w-[28px] text-center">
            {state.quantity}
          </Text>
          <Pressable
            onPress={() => onQuantityChange(-1)}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="remove" size={20} color={colors.lime[500]} />
          </Pressable>
        </View>

        <Text className="text-background-400 text-sm">
          מנות × {servingWeight}g = {grams}g
        </Text>

        {!editGrams ? (
          <Pressable
            onPress={() => {
              setEditGrams(true);
              setInputValue(String(grams));
            }}
            className="bg-background-700 rounded-lg px-3 py-2"
          >
            <Text className="text-lime-500 text-sm">ערוך גרם</Text>
          </Pressable>
        ) : (
          <View className="flex-row-reverse items-center gap-2">
            <Pressable
              onPress={applyManualGrams}
              className="bg-lime-500 rounded-lg px-3 py-2"
            >
              <Text className="text-background-900 text-sm font-bold">אישור</Text>
            </Pressable>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="number-pad"
              placeholder="גרם"
              placeholderTextColor={colors.background[500]}
              className="bg-background-700 rounded-lg px-3 py-2 text-white w-20 text-left"
            />
          </View>
        )}
      </View>
    </View>
  );
}
