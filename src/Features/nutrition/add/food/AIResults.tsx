import { useCreateNutritionEntriesBulk, useCreateNutritionEntry } from '@/src/hooks/useNutrition';
import type {
  AIAnalysisResult,
  AIFoodResult,
  AIMealResult,
  CreateNutritionEntryPayload,
  MeasurementType,
} from '@/src/types/nutrition';
import ActionButton from '@/src/ui/ActionButton';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

// ── Mock data (temporary, for testing) ────────────────────────────────────────
export const MOCK_AI_MEAL: AIMealResult = {
  type: 'meal',
  meal_name: 'ארוחת צהריים',
  items: [
    { food_name: 'חזה עוף', estimated_grams: 150, calories_per_100: 165, protein_per_100: 31, carbs_per_100: 0, fat_per_100: 3.6 },
    { food_name: 'אורז לבן', estimated_grams: 200, calories_per_100: 130, protein_per_100: 2.7, carbs_per_100: 28, fat_per_100: 0.3 },
    { food_name: 'ירקות מוקפצים', estimated_grams: 100, calories_per_100: 35, protein_per_100: 2, carbs_per_100: 7, fat_per_100: 0.2 },
  ],
};

export const MOCK_AI_FOOD: AIFoodResult = {
  type: 'food',
  food_name: 'שוקולד מריר 70%',
  calories_per_100: 598,
  protein_per_100: 7.8,
  carbs_per_100: 45,
  fat_per_100: 42,
};

// ── Internal types ─────────────────────────────────────────────────────────────
interface EditableFoodState {
  food_name: string;
  amount: number;
  measurement_type: MeasurementType;
  calories_per_100: number;
  protein_per_100: number;
  carbs_per_100: number;
  fat_per_100: number;
}

interface EditableMealItem {
  localId: string;
  food_name: string;
  estimated_grams: number;
  calories_per_100: number;
  protein_per_100: number;
  carbs_per_100: number;
  fat_per_100: number;
}

interface EditableMealState {
  meal_name: string;
  items: EditableMealItem[];
}

interface Props {
  aiResult: AIAnalysisResult;
  userId: string;
  date: string;
  onClose: () => void;
  onBack?: () => void;
}

// ── Pure helpers ───────────────────────────────────────────────────────────────
const r1 = (n: number) => Math.round(n * 10) / 10;

const safeFloat = (text: string): number => {
  const n = parseFloat(text);
  return Number.isFinite(n) ? n : 0;
};

const calcFood = (f: EditableFoodState) => {
  const ratio = f.amount / 100;
  return {
    calories: Math.round(f.calories_per_100 * ratio),
    protein: r1(f.protein_per_100 * ratio),
    carbs: r1(f.carbs_per_100 * ratio),
    fat: r1(f.fat_per_100 * ratio),
  };
};

const calcItem = (item: EditableMealItem) => {
  const ratio = item.estimated_grams / 100;
  return {
    calories: Math.round(item.calories_per_100 * ratio),
    protein: r1(item.protein_per_100 * ratio),
    carbs: r1(item.carbs_per_100 * ratio),
    fat: r1(item.fat_per_100 * ratio),
  };
};

// ── MacroField sub-component ───────────────────────────────────────────────────
const MacroField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) => (
  <View className="flex-1 items-center gap-1">
    <Text className="typo-caption text-background-400">{label}</Text>
    <TextInput
      className="w-full bg-background-700 border border-background-600 rounded-xl text-white text-center"
      style={{ fontSize: 14, paddingVertical: 8, paddingHorizontal: 4 }}
      keyboardType="numeric"
      value={String(value)}
      onChangeText={(t) => onChange(safeFloat(t))}
      accessibilityLabel={`${label} ל-100 גרם`}
    />
  </View>
);

// ── Main component ─────────────────────────────────────────────────────────────
const AIResults = ({ aiResult, userId, date, onClose, onBack }: Props) => {
  const isMeal = aiResult.type === 'meal';

  const [food, setFood] = useState<EditableFoodState>(() => {
    if (aiResult.type !== 'food') {
      return { food_name: '', amount: 100, measurement_type: 'grams', calories_per_100: 0, protein_per_100: 0, carbs_per_100: 0, fat_per_100: 0 };
    }
    return {
      food_name: aiResult.food_name,
      amount: aiResult.serving_amount ?? 100,
      measurement_type: aiResult.measurement_type ?? 'grams',
      calories_per_100: aiResult.calories_per_100,
      protein_per_100: aiResult.protein_per_100,
      carbs_per_100: aiResult.carbs_per_100 ?? 0,
      fat_per_100: aiResult.fat_per_100 ?? 0,
    };
  });

  const [meal, setMeal] = useState<EditableMealState>(() => {
    if (aiResult.type !== 'meal') return { meal_name: '', items: [] };
    return {
      meal_name: aiResult.meal_name,
      items: aiResult.items.map((item, i) => ({
        localId: `init-${i}`,
        food_name: item.food_name,
        estimated_grams: item.estimated_grams,
        calories_per_100: item.calories_per_100,
        protein_per_100: item.protein_per_100,
        carbs_per_100: item.carbs_per_100 ?? 0,
        fat_per_100: item.fat_per_100 ?? 0,
      })),
    };
  });

  const createEntry = useCreateNutritionEntry(userId, date);
  const createBulk = useCreateNutritionEntriesBulk(userId, date);
  const isPending = createEntry.isPending || createBulk.isPending;

  const foodMacros = useMemo(() => calcFood(food), [food]);

  const mealTotals = useMemo(
    () =>
      meal.items.reduce(
        (acc, item) => {
          const m = calcItem(item);
          return { calories: acc.calories + m.calories, protein: r1(acc.protein + m.protein), carbs: r1(acc.carbs + m.carbs), fat: r1(acc.fat + m.fat) };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [meal.items]
  );

  const handleSaveFood = useCallback(() => {
    const m = calcFood(food);
    const payload: CreateNutritionEntryPayload = {
      user_id: userId,
      date,
      food_name: food.food_name || 'מאכל',
      calories: m.calories,
      protein: m.protein,
      carbs: m.carbs,
      fat: m.fat,
      portion_size: food.amount,
      portion_unit: food.measurement_type === 'units' ? 'unit' : 'g',
    };
    createEntry.mutate(payload, { onSuccess: () => onClose() });
  }, [food, userId, date, createEntry, onClose]);

  const handleSaveMeal = useCallback(() => {
    if (meal.items.length === 0) return;
    const groupId = Math.random().toString(36).substring(2, 15);
    const payloads: CreateNutritionEntryPayload[] = meal.items.map((item) => {
      const m = calcItem(item);
      return {
        user_id: userId,
        date,
        food_name: item.food_name || 'מאכל',
        calories: m.calories,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat,
        portion_size: item.estimated_grams,
        portion_unit: 'g',
        group_id: groupId,
        group_name: meal.meal_name || 'ארוחה',
      };
    });
    createBulk.mutate(payloads, { onSuccess: () => onClose() });
  }, [meal, userId, date, createBulk, onClose]);

  const updateItem = useCallback(
    (localId: string, patch: Partial<EditableMealItem>) =>
      setMeal((prev) => ({
        ...prev,
        items: prev.items.map((it) => (it.localId === localId ? { ...it, ...patch } : it)),
      })),
    []
  );

  const deleteItem = useCallback(
    (localId: string) =>
      setMeal((prev) => ({ ...prev, items: prev.items.filter((it) => it.localId !== localId) })),
    []
  );

  const addItem = useCallback(
    () =>
      setMeal((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          { localId: `new-${Date.now()}`, food_name: '', estimated_grams: 100, calories_per_100: 0, protein_per_100: 0, carbs_per_100: 0, fat_per_100: 0 },
        ],
      })),
    []
  );

  const handleAmountDelta = useCallback((delta: number) => {
    setFood((prev) => {
      const isUnits = prev.measurement_type === 'units';
      const step = isUnits ? 0.5 : 10;
      const min = isUnits ? 0.5 : 10;
      return { ...prev, amount: Math.max(min, Math.round((prev.amount + delta * step) * 10) / 10) };
    });
  }, []);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Header ── */}
      <View className="flex-row items-center mb-6 justify-center">
        <Pressable
          onPress={onBack ?? onClose}
          className="absolute left-0 w-11 h-11 bg-background-700 rounded-xl items-center justify-center border border-background-600 active:scale-95"
          accessibilityRole="button"
          accessibilityLabel="חזרה"
        >
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </Pressable>
        <View className="items-center">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="typo-caption text-lime-500">✦</Text>
            <View className="flex-row items-center gap-1.5 bg-lime-500/15 border border-lime-500/30 rounded-full px-3 py-1">
              <View className="w-1.5 h-1.5 rounded-full bg-lime-400" />
              <Text className="typo-caption-bold text-lime-400">AI POWERED</Text>
            </View>
            <Text className="typo-caption text-lime-500">✦</Text>
          </View>
          <Text className="typo-h3 text-background-400">
            {isMeal ? 'ניתוח ארוחה' : 'ניתוח מאכל'}
          </Text>
        </View>
      </View>

      {/* ══════════ FOOD MODE ══════════ */}
      {!isMeal && (
        <>
          {/* Name */}
          <View className="bg-white/[0.03] rounded-3xl p-5 border border-white/[0.05] mb-4 items-start">
            <Text className="typo-caption text-background-400 mb-2">שם המאכל</Text>
            <TextInput
              className="bg-background-700 border border-background-600 rounded-xl px-4 text-white"
              style={{ fontSize: 16, paddingVertical: 12, textAlign: 'right' }}
              value={food.food_name}
              onChangeText={(t) => setFood((p) => ({ ...p, food_name: t }))}
              placeholder="שם המאכל"
              placeholderTextColor="#6b7280"
              accessibilityLabel="שם המאכל"
            />
          </View>

          {/* Amount */}
          <View className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.05] mb-4">
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => handleAmountDelta(-1)}
                className="w-11 h-11 items-center justify-center bg-background-700 rounded-xl border border-background-600 active:scale-95"
                accessibilityRole="button"
                accessibilityLabel="הקטן כמות"
              >
                <Ionicons name="remove" size={22} color="#fff" />
              </Pressable>
              <View className="items-center">
                <Text className="text-4xl font-bold text-white">{food.amount}</Text>
                <Text className="typo-label text-background-400 mt-1">
                  {food.measurement_type === 'units' ? 'יחידות' : 'גרם'}
                </Text>
              </View>
              <Pressable
                onPress={() => handleAmountDelta(1)}
                className="w-11 h-11 items-center justify-center bg-lime-500 rounded-xl active:scale-95"
                accessibilityRole="button"
                accessibilityLabel="הגדל כמות"
              >
                <Ionicons name="add" size={22} color="#000" />
              </Pressable>
            </View>
            <Pressable
              onPress={() => setFood((p) => ({ ...p, amount: p.measurement_type === 'units' ? 1 : 100 }))}
              className="mt-4 self-center px-4 py-2 rounded-xl bg-background-700 border border-background-600 active:scale-95"
              accessibilityRole="button"
              accessibilityLabel="איפוס כמות"
            >
              <Text className="typo-caption-bold text-background-300">
                {food.measurement_type === 'units' ? 'איפוס ל-1 יח׳' : 'איפוס ל-100 גרם'}
              </Text>
            </Pressable>
          </View>

          {/* Macros per 100g + computed totals */}
          <View className="bg-white/[0.03] rounded-3xl p-5 border border-white/[0.05] mb-4">
            <Text className="typo-caption text-background-400 mb-3">ערכים ל-100 גרם</Text>
            <View className="flex-row gap-2 mb-2">
              <MacroField label="קלוריות" value={food.calories_per_100} onChange={(v) => setFood((p) => ({ ...p, calories_per_100: v }))} />
              <MacroField label="חלבון" value={food.protein_per_100} onChange={(v) => setFood((p) => ({ ...p, protein_per_100: v }))} />
            </View>
            <View className="flex-row gap-2 mb-4">
              <MacroField label="פחמימות" value={food.carbs_per_100} onChange={(v) => setFood((p) => ({ ...p, carbs_per_100: v }))} />
              <MacroField label="שומן" value={food.fat_per_100} onChange={(v) => setFood((p) => ({ ...p, fat_per_100: v }))} />
            </View>

            <View className="h-[1px] bg-white/[0.05] mb-4" />
            <Text className="typo-caption text-background-400 mb-3 text-center">
              סה״כ ({food.amount}{food.measurement_type === 'units' ? ' יח׳' : 'ג'})
            </Text>
            <View className="flex-row items-center justify-around">
              <View className="items-center">
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-2xl font-bold text-white">{foodMacros.calories}</Text>
                  <Text className="typo-label text-lime-400 font-bold">קק״ל</Text>
                </View>
              </View>
              <View className="w-[1px] h-6 bg-white/[0.05]" />
              <View className="items-center">
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-2xl font-bold text-white">{foodMacros.protein}</Text>
                  <Text className="typo-label text-background-400">g חל׳</Text>
                </View>
              </View>
              <View className="w-[1px] h-6 bg-white/[0.05]" />
              <View className="items-center">
                <View className="flex-row items-baseline gap-1">
                  <Text className="typo-h3 text-white">{foodMacros.carbs}</Text>
                  <Text className="typo-label text-background-400">g פח׳</Text>
                </View>
              </View>
              <View className="w-[1px] h-6 bg-white/[0.05]" />
              <View className="items-center">
                <View className="flex-row items-baseline gap-1">
                  <Text className="typo-h3 text-white">{foodMacros.fat}</Text>
                  <Text className="typo-label text-background-400">g שו׳</Text>
                </View>
              </View>
            </View>
          </View>

          <ActionButton
            onPress={handleSaveFood}
            label={isPending ? 'שומר...' : 'שמור ליומן'}
            iconName={isPending ? 'hourglass-outline' : 'checkmark'}
            loading={isPending}
            disabled={isPending}
            variant="primary"
            fullWidth
          />
        </>
      )}

      {/* ══════════ MEAL MODE ══════════ */}
      {isMeal && (
        <>
          {/* Meal name */}
          <View className="bg-white/[0.03] rounded-3xl p-5 border border-white/[0.05] mb-4">
            <Text className="typo-caption text-background-400 mb-2">שם הארוחה</Text>
            <TextInput
              className="bg-background-700 border border-background-600 rounded-xl px-4 text-white"
              style={{ fontSize: 16, paddingVertical: 12, textAlign: 'right' }}
              value={meal.meal_name}
              onChangeText={(t) => setMeal((p) => ({ ...p, meal_name: t }))}
              placeholder="שם הארוחה"
              placeholderTextColor="#6b7280"
              accessibilityLabel="שם הארוחה"
            />
          </View>

          {/* Item cards */}
          {meal.items.map((item) => {
            const totals = calcItem(item);
            return (
              <View
                key={item.localId}
                className="bg-white/[0.03] rounded-3xl p-5 border border-white/[0.05] mb-3"
              >
                {/* Food name + delete */}
                <View className="flex-row items-center gap-2 mb-3">
                  <TextInput
                    className="flex-1 bg-background-700 border border-background-600 rounded-xl px-3 text-white"
                    style={{ fontSize: 15, paddingVertical: 10, textAlign: 'right' }}
                    value={item.food_name}
                    onChangeText={(t) => updateItem(item.localId, { food_name: t })}
                    placeholder="שם המאכל"
                    placeholderTextColor="#6b7280"
                    accessibilityLabel="שם המאכל"
                  />
                  <Pressable
                    onPress={() => deleteItem(item.localId)}
                    className="w-10 h-10 items-center justify-center bg-red-500/10 border border-red-500/20 rounded-xl"
                    accessibilityRole="button"
                    accessibilityLabel="מחק מרכיב"
                  >
                    <Ionicons name="close" size={18} color="#f87171" />
                  </Pressable>
                </View>

                {/* Amount */}
                <View className="flex-row items-center gap-2 mb-3">
                  <Text className="typo-label text-background-400 w-12">כמות</Text>
                  <TextInput
                    className="flex-1 bg-background-700 border border-background-600 rounded-xl px-3 text-white text-center"
                    style={{ fontSize: 15, paddingVertical: 8 }}
                    keyboardType="numeric"
                    value={String(item.estimated_grams)}
                    onChangeText={(t) => updateItem(item.localId, { estimated_grams: safeFloat(t) })}
                    accessibilityLabel="כמות בגרמים"
                  />
                  <Text className="typo-label text-background-400 w-8">גרם</Text>
                </View>

                {/* Macro inputs */}
                <Text className="typo-caption text-background-500 mb-2">ל-100 גרם</Text>
                <View className="flex-row gap-2 mb-2">
                  <MacroField label="קלוריות" value={item.calories_per_100} onChange={(v) => updateItem(item.localId, { calories_per_100: v })} />
                  <MacroField label="חלבון" value={item.protein_per_100} onChange={(v) => updateItem(item.localId, { protein_per_100: v })} />
                </View>
                <View className="flex-row gap-2 mb-4">
                  <MacroField label="פחמימות" value={item.carbs_per_100} onChange={(v) => updateItem(item.localId, { carbs_per_100: v })} />
                  <MacroField label="שומן" value={item.fat_per_100} onChange={(v) => updateItem(item.localId, { fat_per_100: v })} />
                </View>

                {/* Item totals */}
                <View className="h-[1px] bg-white/[0.05] mb-3" />
                <View className="flex-row items-center justify-around">
                  <View className="items-center">
                    <View className="flex-row items-baseline gap-1">
                      <Text className="typo-h4 text-white">{totals.calories}</Text>
                      <Text className="typo-caption text-lime-400">קק״ל</Text>
                    </View>
                  </View>
                  <View className="w-[1px] h-5 bg-white/[0.05]" />
                  <View className="items-center">
                    <View className="flex-row items-baseline gap-0.5">
                      <Text className="typo-h4 text-white">{totals.protein}</Text>
                      <Text className="typo-caption text-background-400">g חל׳</Text>
                    </View>
                  </View>
                  <View className="w-[1px] h-5 bg-white/[0.05]" />
                  <View className="items-center">
                    <View className="flex-row items-baseline gap-0.5">
                      <Text className="typo-label text-white">{totals.carbs}</Text>
                      <Text className="typo-caption text-background-400">g פח׳</Text>
                    </View>
                  </View>
                  <View className="w-[1px] h-5 bg-white/[0.05]" />
                  <View className="items-center">
                    <View className="flex-row items-baseline gap-0.5">
                      <Text className="typo-label text-white">{totals.fat}</Text>
                      <Text className="typo-caption text-background-400">g שו׳</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Add item */}
          <View className="mb-4">
            <ActionButton
              onPress={addItem}
              label="הוסף מרכיב"
              iconName="add"
              variant="secondary"
              fullWidth
              accessibilityLabel="הוסף מרכיב לארוחה"
            />
          </View>

          {/* Meal totals */}
          {meal.items.length > 0 && (
            <View className="bg-lime-500/[0.05] rounded-3xl p-5 border border-lime-500/20 mb-4">
              <Text className="typo-label text-lime-400 mb-3 text-center">סה״כ ארוחה</Text>
              <View className="flex-row items-center justify-around mb-3">
                <View className="items-center">
                  <View className="flex-row items-baseline gap-1">
                    <Text className="text-4xl font-black text-white">{mealTotals.calories}</Text>
                    <Text className="typo-label text-lime-400 font-bold">קק״ל</Text>
                  </View>
                </View>
                <View className="w-[1px] h-8 bg-white/[0.05]" />
                <View className="items-center">
                  <View className="flex-row items-baseline gap-1">
                    <Text className="text-2xl font-bold text-white">{mealTotals.protein}</Text>
                    <Text className="typo-label text-background-400">g חל׳</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row items-center justify-around">
                <View className="items-center">
                  <View className="flex-row items-baseline gap-1">
                    <Text className="typo-h2 text-white">{mealTotals.carbs}</Text>
                    <Text className="typo-label text-background-400">g פח׳</Text>
                  </View>
                </View>
                <View className="w-[1px] h-6 bg-white/[0.05]" />
                <View className="items-center">
                  <View className="flex-row items-baseline gap-1">
                    <Text className="typo-h2 text-white">{mealTotals.fat}</Text>
                    <Text className="typo-label text-background-400">g שו׳</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <ActionButton
            onPress={handleSaveMeal}
            label={isPending ? 'שומר...' : 'שמור ארוחה ליומן'}
            iconName={isPending ? 'hourglass-outline' : 'checkmark'}
            loading={isPending}
            disabled={isPending || meal.items.length === 0}
            variant="primary"
            fullWidth
            accessibilityLabel="שמור ארוחה ליומן"
          />
        </>
      )}
    </ScrollView>
  );
};

export default AIResults;
