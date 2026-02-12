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

function getServingWeight(mi: MealItem & { food_item?: { serving_weight?: number } }): number {
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

  /** מאתחל כמות התחלתית מכמות הגרמים שנשמרו בארוחה: כמות = amount_g / serving_weight (מנה בסיסית מהמוצר) */
  useEffect(() => {
    if (!visible || !meal?.meal_items?.length) return;
    const initial: Record<string, ItemRowState> = {};
    for (const mi of meal.meal_items) {
      if (!mi.food_item) continue;
      const sw =
        mi.food_item.serving_weight != null && mi.food_item.serving_weight > 0
          ? mi.food_item.serving_weight
          : DEFAULT_SERVING;
      const quantity = Math.max(1, Math.round(mi.amount_g / sw));
      initial[mi.id] = { quantity, manualGrams: null };
    }
    setRowState(initial);
  }, [visible, meal]);

  const { mutate: addToJournal, isPending } = useCreateNutritionEntriesBulk(userId, date);

  const items = useMemo(() => meal?.meal_items?.filter((mi) => mi.food_item) ?? [], [meal]);

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
      const serving = getServingWeight(mi);
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
        serving_weight: serving,
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
              isPending || items.length === 0 ? 'bg-background-700 opacity-60' : 'bg-lime-500'
            }`}
          >
            {isPending ? (
              <ActivityIndicator color={colors.background[900]} size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color={colors.background[900]} />
                <Text className="text-background-900 font-black text-base mr-2">הוסף ליומן</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

interface MealReviewRowProps {
  mealItem: MealItem & {
    food_item?: {
      name: string;
      calories_per_100: number;
      protein_per_100: number;
      carbs_per_100: number;
      fat_per_100: number;
      serving_weight?: number;
    };
  };
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
    <View className="bg-background-800 border border-white/5 rounded-3xl p-4 mb-4 shadow-sm">
      {/* שורה עליונה: שם * כמות סה״כ X גרם (מנה*כמות) וקלוריות */}
      <View className="flex-row-reverse items-center justify-between mb-3">
        <View className="flex-1 ml-3">
          <Text className="text-white font-bold text-lg text-right" numberOfLines={2}>
            {info.name}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-lime-500 font-bold text-lg">{calories}</Text>
          <Text className="text-gray-500 text-[10px] font-medium">קק״ל</Text>
        </View>
      </View>

      {/* אזור השליטה בכמות */}
      <View className="flex-row-reverse items-center justify-between bg-background-900/40 p-3 rounded-2xl border border-white/5">
        {/* ה-Stepper (פלוס/מינוס) */}
        <View className="flex-row-reverse items-center bg-background-700 rounded-xl p-1 shadow-inner">
          <Pressable
            onPress={() => onQuantityChange(1)}
            className="w-10 h-10 items-center justify-center bg-lime-500/10 rounded-lg active:bg-lime-500/20"
          >
            <Ionicons name="add" size={22} color="#84cc16" />
          </Pressable>

          <View className="px-4 items-center">
            <Text className="text-white font-black text-lg">{state.quantity}</Text>
            <Text className="text-gray-500 text-[9px] uppercase font-bold">מנות</Text>
          </View>

          <Pressable
            onPress={() => onQuantityChange(-1)}
            className="w-10 h-10 items-center justify-center bg-white/5 rounded-lg active:bg-white/10"
          >
            <Ionicons name="remove" size={22} color="#f87171" />
          </Pressable>
        </View>

        {/* חישוב סופי */}
        <View className="flex-1 items-center mr-4">
          <Text className="text-gray-400 text-xs text-center mb-1">סה״כ משקל נבחר</Text>
          <View className="flex-row-reverse items-center">
            <Text className="text-white font-bold text-base">{grams}</Text>
            <Text className="text-white/60 text-sm mr-1">גרם</Text>
          </View>
          <Text className="text-gray-500 text-[10px] mt-1 italic">
            ({state.quantity} מנות × {servingWeight}ג׳)
          </Text>
        </View>
      </View>

      {/* עריכה ידנית */}
      <View className="mt-4 pt-3 border-t border-white/5">
        {!editGrams ? (
          <Pressable
            onPress={() => {
              setEditGrams(true);
              setInputValue(String(grams));
            }}
            className="flex-row-reverse items-center justify-center py-2"
          >
            <Ionicons name="create-outline" size={14} color="#84cc16" />
            <Text className="text-lime-500 text-xs font-bold mr-1.5 underline">
              עריכת גרמים ידנית
            </Text>
          </Pressable>
        ) : (
          <View className="flex-row-reverse items-center justify-center gap-3">
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="number-pad"
              placeholder="גרם"
              placeholderTextColor="#525252"
              className="bg-background-900 rounded-xl px-4 py-2.5 text-white w-24 text-center font-bold border border-lime-500/30"
            />
            <Pressable
              onPress={applyManualGrams}
              className="bg-lime-500 rounded-xl px-6 py-2.5 shadow-sm active:bg-lime-600"
            >
              <Text className="text-background-900 text-sm font-black">עדכן</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
