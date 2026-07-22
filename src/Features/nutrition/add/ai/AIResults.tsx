import { useCreateFoodItem, useCreateMealWithItems, useCreateNutritionEntriesBulk, useCreateNutritionEntry } from '@/src/hooks/useNutrition';
import type {
  AIAnalysisResult,
  AIFoodResult,
  AIMealResult,
  CreateNutritionEntryPayload,
  MeasurementType,
} from '@/src/types/nutrition';
import ActionButton from '@/src/ui/ActionButton';
import BackButton from '@/src/ui/BackButton';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  /** משקל יחידה בגרמים — רלוונטי רק כשמדידה היא units */
  unit_weight_g: number;
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
  // units: amount (יחידות) × unit_weight_g (גרם/יח') ÷ 100
  // grams: amount (גרם) ÷ 100
  const ratio = f.measurement_type === 'units'
    ? (f.amount * f.unit_weight_g) / 100
    : f.amount / 100;
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
  borderClass = 'border-background-600',
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  borderClass?: string;
  step?: number;
}) => (
  <View className="flex-1 items-center gap-1">
    <Text className="typo-caption text-background-400">{label}</Text>
    <View className="flex-row items-center w-full gap-1">
      <Pressable
        onPress={() => onChange(Math.max(0, r1(value - step)))}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
        className="w-8 h-8 items-center justify-center bg-background-700 border border-background-600 rounded-lg active:scale-95"
        accessibilityRole="button"
        accessibilityLabel={`הקטן ${label}`}
      >
        <Ionicons name="remove" size={14} color="#9ca3af" />
      </Pressable>
      <TextInput
        className={`flex-1 bg-background-700 border ${borderClass} rounded-xl text-white text-center`}
        style={{ fontSize: 14, paddingVertical: 8, paddingHorizontal: 2 }}
        keyboardType="numeric"
        value={String(value)}
        onChangeText={(t) => onChange(safeFloat(t))}
        accessibilityLabel={`${label} ל-100 גרם`}
      />
      <Pressable
        onPress={() => onChange(r1(value + step))}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
        className="w-8 h-8 items-center justify-center bg-background-700 border border-background-600 rounded-lg active:scale-95"
        accessibilityRole="button"
        accessibilityLabel={`הגדל ${label}`}
      >
        <Ionicons name="add" size={14} color="#9ca3af" />
      </Pressable>
    </View>
  </View>
);

// ── Main component ─────────────────────────────────────────────────────────────
const AIResults = ({ aiResult, userId, date, onClose, onBack }: Props) => {
  const insets = useSafeAreaInsets();
  const isMeal = aiResult.type === 'meal';

  const [food, setFood] = useState<EditableFoodState>(() => {
    if (aiResult.type !== 'food') {
      return { food_name: '', amount: 100, measurement_type: 'grams', unit_weight_g: 100, calories_per_100: 0, protein_per_100: 0, carbs_per_100: 0, fat_per_100: 0 };
    }
    const isUnits = aiResult.measurement_type === 'units';
    return {
      food_name: aiResult.food_name,
      amount: aiResult.serving_amount ?? (isUnits ? 1 : 100),
      measurement_type: aiResult.measurement_type ?? 'grams',
      unit_weight_g: aiResult.unit_weight_g ?? 100,
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
  const { mutateAsync: createFoodItemAsync, isPending: isCreatingFoodItems } = useCreateFoodItem(userId);
  const { mutate: createMealTemplate, isPending: isCreatingMealTemplate } = useCreateMealWithItems(userId);

  const [saveAsTemplate, setSaveAsTemplate] = useState(false);

  const isPending = createEntry.isPending || createBulk.isPending || isCreatingFoodItems || isCreatingMealTemplate;

  const foodMacros = useMemo(() => calcFood(food), [food]);

  const isFoodValid = useMemo(
    () => food.food_name.trim().length > 0 && food.calories_per_100 > 0 && food.amount > 0,
    [food]
  );

  const isMealValid = useMemo(
    () =>
      meal.items.length > 0 &&
      meal.items.every(
        (item) => item.food_name.trim().length > 0 && item.calories_per_100 > 0 && item.estimated_grams > 0
      ),
    [meal.items]
  );

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
    if (!isFoodValid) { setShowErrors(true); return; }
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
      source: 'ai',
    };
    createEntry.mutate(payload, {
      onSuccess: async () => {
        if (saveAsTemplate) {
          try {
            await createFoodItemAsync({
              name: food.food_name,
              measurement_type: food.measurement_type,
              calories_per_100: food.calories_per_100,
              protein_per_100: food.protein_per_100,
              carbs_per_100: food.carbs_per_100,
              fat_per_100: food.fat_per_100,
              unit_weight_g: food.measurement_type === 'units' ? food.unit_weight_g : null,
              is_ai_generated: true,
            });
          } catch {}
        }
        onClose();
      },
    });
  }, [food, userId, date, createEntry, onClose, isFoodValid, saveAsTemplate, createFoodItemAsync]);

  const handleSaveMeal = useCallback(() => {
    if (!isMealValid) { setShowErrors(true); return; }
    if (meal.items.length === 0) return;
    const groupId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
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
        source: 'ai',
      };
    });
    createBulk.mutate(payloads, {
      onSuccess: async () => {
        if (saveAsTemplate) {
          try {
            const createdFoods = await Promise.all(
              meal.items.map((item) =>
                createFoodItemAsync({
                  name: item.food_name,
                  measurement_type: 'grams',
                  calories_per_100: item.calories_per_100,
                  protein_per_100: item.protein_per_100,
                  carbs_per_100: item.carbs_per_100,
                  fat_per_100: item.fat_per_100,
                  is_ai_generated: true,
                })
              )
            );
            createMealTemplate(
              {
                name_meal: meal.meal_name || 'ארוחת AI',
                items: createdFoods.map((fi, idx) => ({
                  food_item_id: fi.id,
                  food_id: null,
                  amount_g: meal.items[idx].estimated_grams,
                })),
                is_ai_generated: true,
              },
              { onSuccess: () => onClose(), onError: () => onClose() }
            );
          } catch {
            onClose();
          }
        } else {
          onClose();
        }
      },
    });
  }, [meal, userId, date, createBulk, onClose, isMealValid, saveAsTemplate, createFoodItemAsync, createMealTemplate]);

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

  const [collapsedItems, setCollapsedItems] = useState<Set<string>>(new Set());
  const [showErrors, setShowErrors] = useState(false);

  const toggleCollapse = useCallback((localId: string) => {
    setCollapsedItems((prev) => {
      const next = new Set(prev);
      next.has(localId) ? next.delete(localId) : next.add(localId);
      return next;
    });
  }, []);

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
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: insets.top + 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Header ── */}
      <View className="flex-row items-center mb-6 justify-center">
        <View className="absolute left-0">
          <BackButton onPress={onBack ?? onClose} size={44} iconSize={22} />
        </View>
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
          <View className={`bg-white/[0.03] rounded-3xl p-5 border mb-4 items-start ${showErrors && !food.food_name.trim() ? 'border-red-500/50' : 'border-white/[0.05]'}`}>
            <Text className="typo-caption text-background-400 mb-2">שם המאכל</Text>
            <TextInput
              className={`bg-background-700 border ${showErrors && !food.food_name.trim() ? 'border-red-500' : 'border-background-600'} rounded-xl px-4 text-white`}
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

            {food.measurement_type === 'units' && (
              <View className="mt-4 pt-4 border-t border-white/[0.05]">
                <Text className="typo-caption text-background-400 text-center mb-2">משקל ליחידה</Text>
                <View className="flex-row items-center justify-center gap-2">
                  <Pressable
                    onPress={() => setFood((p) => ({ ...p, unit_weight_g: Math.max(1, r1(p.unit_weight_g - 10)) }))}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
                    className="w-8 h-8 items-center justify-center bg-background-700 border border-background-600 rounded-lg active:scale-95"
                    accessibilityRole="button"
                    accessibilityLabel="הקטן משקל יחידה"
                  >
                    <Ionicons name="remove" size={14} color="#9ca3af" />
                  </Pressable>
                  <TextInput
                    className="bg-background-700 border border-background-600 rounded-xl text-white text-center"
                    style={{ fontSize: 14, paddingVertical: 6, paddingHorizontal: 10, minWidth: 70 }}
                    keyboardType="numeric"
                    value={String(food.unit_weight_g)}
                    onChangeText={(t) => setFood((p) => ({ ...p, unit_weight_g: safeFloat(t) || 1 }))}
                    accessibilityLabel="משקל יחידה בגרמים"
                  />
                  <Pressable
                    onPress={() => setFood((p) => ({ ...p, unit_weight_g: r1(p.unit_weight_g + 10) }))}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
                    className="w-8 h-8 items-center justify-center bg-background-700 border border-background-600 rounded-lg active:scale-95"
                    accessibilityRole="button"
                    accessibilityLabel="הגדל משקל יחידה"
                  >
                    <Ionicons name="add" size={14} color="#9ca3af" />
                  </Pressable>
                  <Text className="typo-caption text-background-400">גרם</Text>
                </View>
              </View>
            )}
          </View>

          {/* Macros per 100g + computed totals */}
          <View className="bg-white/[0.03] rounded-3xl p-5 border border-white/[0.05] mb-4">
            <Text className="typo-caption text-background-400 mb-3 text-left">ערכים ל-100 גרם</Text>
            <View className="flex-row gap-2 mb-2">
              <MacroField label="קלוריות" value={food.calories_per_100} onChange={(v) => setFood((p) => ({ ...p, calories_per_100: v }))} borderClass={showErrors && food.calories_per_100 === 0 ? 'border-red-500' : 'border-lime-500/40'} step={10} />
              <MacroField label="חלבון" value={food.protein_per_100} onChange={(v) => setFood((p) => ({ ...p, protein_per_100: v }))} borderClass="border-blue-500/40" step={1} />
            </View>
            <View className="flex-row gap-2 mb-4">
              <MacroField label="פחמימות" value={food.carbs_per_100} onChange={(v) => setFood((p) => ({ ...p, carbs_per_100: v }))} borderClass="border-amber-500/40" step={5} />
              <MacroField label="שומן" value={food.fat_per_100} onChange={(v) => setFood((p) => ({ ...p, fat_per_100: v }))} borderClass="border-red-500/40" step={5} />
            </View>

            <View className="h-[1px] bg-white/[0.05] mb-4" />
            <Text className="typo-caption text-background-400 mb-3 text-center">
              {food.measurement_type === 'units'
                ? `סה״כ (${food.amount} יח׳ × ${food.unit_weight_g}ג׳ = ${Math.round(food.amount * food.unit_weight_g)}ג׳)`
                : `סה״כ (${food.amount}ג׳)`}
            </Text>
            <View className="bg-lime-500/10 border border-lime-500/20 rounded-2xl p-3 mb-3 items-center">
              <Text className="typo-caption text-lime-400 mb-0.5">קלוריות</Text>
              <View className="flex-row items-baseline gap-1.5">
                <Text className="text-4xl font-black text-white">{foodMacros.calories}</Text>
                <Text className="typo-body-primary text-lime-400 font-bold">קק״ל</Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1 bg-blue-500/[0.06] border border-blue-500/20 rounded-2xl p-3 items-center">
                <Text className="typo-caption text-blue-400 mb-0.5">חלבון</Text>
                <Text className="typo-h4 text-white">{foodMacros.protein}</Text>
                <Text className="typo-caption text-background-500">גרם</Text>
              </View>
              <View className="flex-1 bg-amber-500/[0.06] border border-amber-500/20 rounded-2xl p-3 items-center">
                <Text className="typo-caption text-amber-400 mb-0.5">פחמימות</Text>
                <Text className="typo-h4 text-white">{foodMacros.carbs}</Text>
                <Text className="typo-caption text-background-500">גרם</Text>
              </View>
              <View className="flex-1 bg-red-500/[0.06] border border-red-500/20 rounded-2xl p-3 items-center">
                <Text className="typo-caption text-red-400 mb-0.5">שומן</Text>
                <Text className="typo-h4 text-white">{foodMacros.fat}</Text>
                <Text className="typo-caption text-background-500">גרם</Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => setSaveAsTemplate((p) => !p)}
            className="flex-row items-center gap-3 bg-white/[0.03] rounded-2xl px-4 py-3 border border-white/[0.05] mb-3 active:opacity-80"
            accessibilityRole="checkbox"
            accessibilityLabel="שמור גם כתבנית לשימוש חוזר"
            accessibilityState={{ checked: saveAsTemplate }}
          >
            <View className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${saveAsTemplate ? 'bg-lime-500 border-lime-500' : 'border-background-500'}`}>
              {saveAsTemplate && <Ionicons name="checkmark" size={14} color="#000" />}
            </View>
            <View className="flex-1 items-start">
              <Text className="typo-label text-white">שמור לשימוש חוזר</Text>
              <Text className="typo-caption text-background-400">יופיע ב׳הארוחות שלי׳ לשימוש חוזר</Text>
            </View>
            {/* <View className="flex-row items-center gap-1 bg-lime-500/15 border border-lime-500/30 rounded-full px-2 py-0.5">
              <View className="w-1 h-1 rounded-full bg-lime-400" />
              <Text className="typo-caption text-lime-400">AI</Text>
            </View> */}
          </Pressable>

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
          {meal.items.map((item, index) => {
            const isCollapsed = collapsedItems.has(item.localId);
            const totals = calcItem(item);
            return (
              <View
                key={item.localId}
                className="bg-white/[0.03] rounded-3xl p-5 border border-white/[0.05] mb-3"
              >
                {/* Card header */}
                <Pressable
                  onPress={() => toggleCollapse(item.localId)}
                  className="flex-row items-center gap-2"
                  style={{ marginBottom: isCollapsed ? 0 : 16 }}
                  accessibilityRole="button"
                  accessibilityLabel={isCollapsed ? `פתח מרכיב ${index + 1}` : `קפל מרכיב ${index + 1}`}
                  accessibilityState={{ expanded: !isCollapsed }}
                >
                  <Text className="typo-caption-bold text-background-400 shrink-0">מרכיב {index + 1}</Text>
                  <View className="flex-1 h-[1px] bg-white/[0.08]" />
                  <Ionicons
                    name={isCollapsed ? 'chevron-down' : 'chevron-up'}
                    size={16}
                    color="#6b7280"
                  />
                </Pressable>

                {!isCollapsed && (
                  <>
                    {/* Food name */}
                    <TextInput
                      className={`bg-background-700 border ${showErrors && !item.food_name.trim() ? 'border-red-500' : 'border-background-600'} rounded-xl px-3 text-white mb-3`}
                      style={{ fontSize: 15, paddingVertical: 10, textAlign: 'right' }}
                      value={item.food_name}
                      onChangeText={(t) => updateItem(item.localId, { food_name: t })}
                      placeholder="שם המאכל"
                      placeholderTextColor="#6b7280"
                      accessibilityLabel="שם המאכל"
                    />

                    {/* Amount */}
                    <View className="flex-row items-center gap-2 mb-3">
                      <Text className="typo-label text-background-400 w-12">כמות</Text>
                      <Pressable
                        onPress={() => updateItem(item.localId, { estimated_grams: Math.max(10, r1(item.estimated_grams - 10)) })}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
                        className="w-8 h-8 items-center justify-center bg-background-700 border border-background-600 rounded-lg active:scale-95"
                        accessibilityRole="button"
                        accessibilityLabel="הקטן כמות"
                      >
                        <Ionicons name="remove" size={14} color="#9ca3af" />
                      </Pressable>
                      <TextInput
                        className="flex-1 bg-background-700 border border-background-600 rounded-xl px-3 text-white text-center"
                        style={{ fontSize: 15, paddingVertical: 8 }}
                        keyboardType="numeric"
                        value={String(item.estimated_grams)}
                        onChangeText={(t) => updateItem(item.localId, { estimated_grams: safeFloat(t) })}
                        accessibilityLabel="כמות בגרמים"
                      />
                      <Pressable
                        onPress={() => updateItem(item.localId, { estimated_grams: r1(item.estimated_grams + 10) })}
                        hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
                        className="w-8 h-8 items-center justify-center bg-background-700 border border-background-600 rounded-lg active:scale-95"
                        accessibilityRole="button"
                        accessibilityLabel="הגדל כמות"
                      >
                        <Ionicons name="add" size={14} color="#9ca3af" />
                      </Pressable>
                      <Text className="typo-label text-background-400 w-8">גרם</Text>
                    </View>

                    {/* Macro inputs */}
                    <Text className="typo-caption text-background-500 mb-2 text-left">ל-100 גרם</Text>
                    <View className="flex-row gap-2 mb-2">
                      <MacroField label="קלוריות" value={item.calories_per_100} onChange={(v) => updateItem(item.localId, { calories_per_100: v })} borderClass={showErrors && item.calories_per_100 === 0 ? 'border-red-500' : 'border-lime-500/40'} step={10} />
                      <MacroField label="חלבון" value={item.protein_per_100} onChange={(v) => updateItem(item.localId, { protein_per_100: v })} borderClass="border-blue-500/40" step={1} />
                    </View>
                    <View className="flex-row gap-2 mb-4">
                      <MacroField label="פחמימות" value={item.carbs_per_100} onChange={(v) => updateItem(item.localId, { carbs_per_100: v })} borderClass="border-amber-500/40" step={5} />
                      <MacroField label="שומן" value={item.fat_per_100} onChange={(v) => updateItem(item.localId, { fat_per_100: v })} borderClass="border-red-500/40" step={5} />
                    </View>

                    {/* Item totals */}
                    <View className="h-[1px] bg-white/[0.05] mb-3" />
                    <View className="flex-row gap-1.5 mb-3">
                      <View className="flex-1 bg-lime-500/[0.06] border border-lime-500/15 rounded-xl p-2 items-center">
                        <Text className="typo-label text-white font-bold">{totals.calories}</Text>
                        <Text className="typo-caption text-lime-400">קק״ל</Text>
                      </View>
                      <View className="flex-1 bg-blue-500/[0.06] border border-blue-500/15 rounded-xl p-2 items-center">
                        <Text className="typo-label text-white font-bold">{totals.protein}</Text>
                        <Text className="typo-caption text-blue-400">חלבון</Text>
                      </View>
                      <View className="flex-1 bg-amber-500/[0.06] border border-amber-500/15 rounded-xl p-2 items-center">
                        <Text className="typo-label text-white font-bold">{totals.carbs}</Text>
                        <Text className="typo-caption text-amber-400">פח׳</Text>
                      </View>
                      <View className="flex-1 bg-red-500/[0.06] border border-red-500/15 rounded-xl p-2 items-center">
                        <Text className="typo-label text-white font-bold">{totals.fat}</Text>
                        <Text className="typo-caption text-red-400">שומן</Text>
                      </View>
                    </View>

                    {/* Delete */}
                    <Pressable
                      onPress={() => deleteItem(item.localId)}
                      className="flex-row items-center justify-center gap-1.5 py-2 rounded-xl active:scale-95"
                      accessibilityRole="button"
                      accessibilityLabel="מחק מרכיב"
                    >
                      <Ionicons name="trash-outline" size={14} color="#f87171" />
                      <Text className="typo-caption text-red-400">מחק מרכיב</Text>
                    </Pressable>
                  </>
                )}
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
              <Text className="typo-caption-bold text-lime-400 mb-4 text-center tracking-widest">סה״כ ארוחה</Text>
              <View className="bg-lime-500/10 border border-lime-500/25 rounded-2xl p-4 mb-3 items-center">
                <Text className="typo-caption text-lime-400 mb-0.5">קלוריות</Text>
                <View className="flex-row items-baseline gap-1.5">
                  <Text className="text-4xl font-black text-white">{mealTotals.calories}</Text>
                  <Text className="typo-body-primary text-lime-400 font-bold">קק״ל</Text>
                </View>
              </View>
              <View className="flex-row gap-2">
                <View className="flex-1 bg-blue-500/[0.06] border border-blue-500/20 rounded-2xl p-3 items-center">
                  <Text className="typo-caption text-blue-400 mb-0.5">חלבון</Text>
                  <Text className="typo-h4 text-white">{mealTotals.protein}</Text>
                  <Text className="typo-caption text-background-500">גרם</Text>
                </View>
                <View className="flex-1 bg-amber-500/[0.06] border border-amber-500/20 rounded-2xl p-3 items-center">
                  <Text className="typo-caption text-amber-400 mb-0.5">פחמימות</Text>
                  <Text className="typo-h4 text-white">{mealTotals.carbs}</Text>
                  <Text className="typo-caption text-background-500">גרם</Text>
                </View>
                <View className="flex-1 bg-red-500/[0.06] border border-red-500/20 rounded-2xl p-3 items-center">
                  <Text className="typo-caption text-red-400 mb-0.5">שומן</Text>
                  <Text className="typo-h4 text-white">{mealTotals.fat}</Text>
                  <Text className="typo-caption text-background-500">גרם</Text>
                </View>
              </View>
            </View>
          )}

          <Pressable
            onPress={() => setSaveAsTemplate((p) => !p)}
            className="flex-row items-center gap-3 bg-white/[0.03] rounded-2xl px-4 py-3 border border-white/[0.05] mb-3 active:opacity-80"
            accessibilityRole="checkbox"
            accessibilityLabel="שמור גם כתבנית לשימוש חוזר"
            accessibilityState={{ checked: saveAsTemplate }}
          >
            <View className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${saveAsTemplate ? 'bg-lime-500 border-lime-500' : 'border-background-500'}`}>
              {saveAsTemplate && <Ionicons name="checkmark" size={14} color="#000" />}
            </View>
            <View className="flex-1 items-start">
              <Text className="typo-label text-white">שמור לשימוש חוזר</Text>
              <Text className="typo-caption text-background-400">יופיע ב׳הארוחות שלי׳ לשימוש חוזר</Text>
            </View>
            {/* <View className="flex-row items-center gap-1 bg-lime-500/15 border border-lime-500/30 rounded-full px-2 py-0.5">
              <View className="w-1 h-1 rounded-full bg-lime-400" />
              <Text className="typo-caption text-lime-400">AI</Text>
            </View> */}
          </Pressable>

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
