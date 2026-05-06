import { colors } from '@/colors';
import { useSearchFoodItems } from '@/src/hooks/useNutrition';
import { useAuthStore } from '@/src/store/useAuthStore';
import type { CreateFoodFormData, FoodItem, MeasurementType } from '@/src/types/nutrition';
import ValueStepper from '@/src/ui/ValueStepper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

type Phase = 'search' | 'db-amount' | 'custom-details';

interface Props {
  onSubmit: (data: CreateFoodFormData, addToJournal: boolean) => void;
  onSelectExisting?: (food: FoodItem, amount: number) => void;
  isPending: boolean;
  onBack?: () => void;
  mode?: 'standalone' | 'meal-builder';
  defaultConsumedAmount?: number;
  initialValues?: {
    food_name?: string;
    calories_per_100?: number;
    protein_per_100?: number;
    carbs_per_100?: number;
    fat_per_100?: number;
    category?: string;
    measurement_type?: MeasurementType;
  };
}

const QUICK_SUGGESTIONS = [
  'חזה עוף',
  'ביצה',
  'אורז',
  'גבינה לבנה',
  'לחם',
  'טונה',
  'יוגורט',
  'שיבולת שועל',
  'קוטג׳',
  'אבוקדו',
  'בננה',
  'תפוח',
  'חומוס',
  'טחינה',
  'סלמון',
  'שניצל',
  'פסטה',
  'תפוח אדמה',
  'בטטה',
  'עגבנייה',
  'מלפפון',
  'חלב',
  'קורנפלקס',
  'שקדים',
  'אגוזים',
  'גבינה צהובה',
  'פיתה',
  'לאפה',
  'סלט',
  'עוף',
];

const AddNewFood = ({
  onSubmit,
  onSelectExisting,
  isPending,
  onBack,
  mode = 'standalone',
  initialValues,
  defaultConsumedAmount,
}: Props) => {
  const userId = useAuthStore((s) => s.user?.id) ?? '';

  const [phase, setPhase] = useState<Phase>('search');
  const [query, setQuery] = useState(initialValues?.food_name ?? '');
  const [debouncedQuery, setDebouncedQuery] = useState(initialValues?.food_name ?? '');

  // DB food
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [dbAmount, setDbAmount] = useState(100);

  // Custom food
  const [measurementType, setMeasurementType] = useState<MeasurementType>(
    initialValues?.measurement_type ?? 'grams'
  );
  const [calories, setCalories] = useState(
    initialValues?.calories_per_100 != null ? String(initialValues.calories_per_100) : ''
  );
  const [proteinValue, setProteinValue] = useState(initialValues?.protein_per_100 ?? 0);
  const [consumedAmount, setConsumedAmount] = useState<number>(defaultConsumedAmount ?? 0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchResults = [], isLoading } = useSearchFoodItems(debouncedQuery, userId);

  const isUnits = measurementType === 'units';

  const handleSelectFromDB = useCallback((food: FoodItem) => {
    Haptics.selectionAsync();
    setSelectedFood(food);
    setDbAmount(food.measurement_type === 'units' ? 1 : 100);
    setPhase('db-amount');
  }, []);

  const handleStartCustom = useCallback(() => {
    Haptics.selectionAsync();
    setPhase('custom-details');
  }, []);

  const handleBack = useCallback(() => {
    if (phase === 'search') {
      onBack?.();
    } else {
      setPhase('search');
    }
  }, [phase, onBack]);

  const handleConfirmDB = useCallback(() => {
    if (!selectedFood) return;
    onSelectExisting?.(selectedFood, dbAmount);
  }, [selectedFood, dbAmount, onSelectExisting]);

  const buildCustomData = useCallback(
    (portion?: number): CreateFoodFormData => {
      const cal = parseFloat(calories) || 0;
      if (isUnits) {
        return {
          food_name: query.trim(),
          measurement_type: 'units',
          calories_per_unit: cal || undefined,
          protein_per_unit: proteinValue || undefined,
          portion_size: portion,
          portion_unit: portion != null ? 'unit' : undefined,
        };
      }
      return {
        food_name: query.trim(),
        measurement_type: 'grams',
        calories_per_100: cal || undefined,
        protein_per_100: proteinValue || undefined,
        portion_size: portion,
        portion_unit: portion != null ? 'g' : undefined,
      };
    },
    [isUnits, query, calories, proteinValue]
  );

  const handleCustomSave = useCallback(
    (addToJournal: boolean) => {
      onSubmit(
        buildCustomData(addToJournal && consumedAmount > 0 ? consumedAmount : undefined),
        addToJournal
      );
    },
    [onSubmit, buildCustomData, consumedAmount]
  );

  const step3Valid = (parseFloat(calories) || 0) > 0;

  // ── Progress dots ────────────────────────────────────────────────────────────
  const ProgressDots = () => (
    <View className="flex-row gap-2 mb-6 justify-center">
      {[0, 1].map((i) => {
        const active = phase === 'search' ? i === 0 : i === 1;
        const past = phase !== 'search' && i === 0;
        return (
          <View
            key={i}
            className={`h-1.5 rounded-full ${
              active ? 'bg-lime-500 w-6' : past ? 'bg-lime-500/50 w-4' : 'bg-background-700 w-4'
            }`}
          />
        );
      })}
    </View>
  );

  // ── Macro summary for a DB food ───────────────────────────────────────────────
  const MacroChip = ({
    label,
    value,
    unit,
  }: {
    label: string;
    value: number | null;
    unit: string;
  }) => (
    <View className="items-center flex-1">
      <Text className="typo-h3 text-white">{value ?? '—'}</Text>
      <Text className="typo-caption text-background-400">{unit}</Text>
      <Text className="typo-caption text-background-500">{label}</Text>
    </View>
  );

  // ── Phase: Search ─────────────────────────────────────────────────────────────
  const renderSearch = () => {
    const showResults = debouncedQuery.trim().length >= 2;
    const noResults = showResults && !isLoading && searchResults.length === 0;

    return (
      <View className="flex-1 px-5 w-full">
        <Text className="typo-h2 text-lime-400 mb-2 ">
          {mode === 'meal-builder' ? 'הוספת מזון לארוחה' : 'חפש או הוסף מאכל'}
        </Text>
        <Text className="typo-label text-background-400 mb-4 ">
          הקלד שם המאכל — נמצא לך את הנתונים
        </Text>

        {/* Search input */}
        <View
          className="flex-row items-center bg-background-800 rounded-2xl border mb-3 px-4"
          style={{ borderColor: query.trim() ? colors.lime[500] : colors.background[600] }}
        >
          <Ionicons name="search" size={18} color={colors.background[400]} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="חפש מאכל..."
            placeholderTextColor={colors.background[500]}
            autoFocus
            returnKeyType="search"
            style={{
              flex: 1,
              color: colors.white,
              textAlign: 'right',
              fontSize: 16,
              paddingVertical: 14,
              paddingHorizontal: 10,
            }}
          />
          {isLoading && <ActivityIndicator size="small" color={colors.lime[500]} />}
          {query.length > 0 && !isLoading && (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="נקה חיפוש"
            >
              <Ionicons name="close-circle" size={18} color={colors.background[500]} />
            </Pressable>
          )}
        </View>

        {/* Results */}
        {showResults && searchResults.length > 0 && (
          <View className="bg-background-800 rounded-2xl border border-background-700 mb-3 overflow-hidden">
            {searchResults.map((food, idx) => {
              const cal =
                food.measurement_type === 'units' ? food.calories_per_unit : food.calories_per_100;
              const calLabel = food.measurement_type === 'units' ? 'קק"ל/יח׳' : 'קק"ל/100g';
              const isLast = idx === searchResults.length - 1;
              return (
                <Pressable
                  key={food.id}
                  onPress={() => handleSelectFromDB(food)}
                  className="flex-row items-center px-4 py-3.5"
                  accessibilityRole="button"
                  accessibilityLabel={`בחר ${food.name}`}
                >
                  <View className="flex-1">
                    <Text className="typo-body-primary text-white ">{food.name}</Text>
                    {cal != null && (
                      <Text className="typo-caption text-background-400  mt-0.5">
                        {cal} {calLabel}
                      </Text>
                    )}
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={20}
                    color={colors.background[500]}
                  />
                  {!isLast && (
                    <View className="absolute bottom-0 left-4 right-4 h-[0.5px] bg-background-700" />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {/* No results */}
        {noResults && (
          <Text className="typo-caption text-background-500 text-center mb-3">
            לא נמצאו תוצאות עבור &quot;{debouncedQuery}&quot;
          </Text>
        )}

        {/* Add custom CTA */}
        {showResults && query.trim().length > 0 && (
          <Pressable
            onPress={handleStartCustom}
            className="flex-row items-center justify-center bg-background-800 border border-lime-500/40 rounded-2xl px-4 py-3.5 mb-3"
            accessibilityRole="button"
            accessibilityLabel={`הוסף ${query.trim()} כמאכל חדש`}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.lime[500]} />
            <Text className="typo-body-primary text-lime-400 mr-2">
              הוסף &quot;{query.trim()}&quot; כמאכל חדש
            </Text>
          </Pressable>
        )}

        {/* Quick suggestions (when query is empty) */}
        {!showResults && (
          <>
            <Text className="typo-caption text-background-500 text-center mb-3 mt-4">
              הצעות מהירות
            </Text>
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}
            >
              {QUICK_SUGGESTIONS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setQuery(s)}
                  className="bg-background-800 border border-background-600 rounded-full px-3 py-1.5"
                  accessibilityRole="button"
                  accessibilityLabel={s}
                >
                  <Text className="typo-label text-background-300">{s}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </View>
    );
  };

  // ── Phase: DB amount ──────────────────────────────────────────────────────────
  const renderDbAmount = () => {
    if (!selectedFood) return null;

    const isUnitFood = selectedFood.measurement_type === 'units';
    const factor = isUnitFood ? dbAmount : dbAmount / 100;

    const totals = {
      cal: Math.round(
        ((isUnitFood ? selectedFood.calories_per_unit : selectedFood.calories_per_100) ?? 0) *
          factor
      ),
      prot: (
        ((isUnitFood ? selectedFood.protein_per_unit : selectedFood.protein_per_100) ?? 0) * factor
      ).toFixed(1),
      carb: (
        ((isUnitFood ? selectedFood.carbs_per_unit : selectedFood.carbs_per_100) ?? 0) * factor
      ).toFixed(1),
      fat: (
        ((isUnitFood ? selectedFood.fat_per_unit : selectedFood.fat_per_100) ?? 0) * factor
      ).toFixed(1),
    };

    const unitLabel = isUnitFood ? 'יח׳' : 'גרם';

    return (
      <View className="flex-1 px-8 w-full bg-background-950 rounded-md py-6 shadow-black shadow-md">
        <View className="w-full items-start mb-2">
          <Pressable
            onPress={handleBack}
            className="bg-background-800 border border-white/10 h-11 w-11 rounded-xl items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="חזרה"
            accessibilityHint="חזרה לשלב הקודם"
          >
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.white} />
          </Pressable>
        </View>

        {/* Header - Minimalist & Elegant */}
        <View className="mt-6 mb-12 items-center">
          <View className="bg-lime-400/10 px-3 py-1 rounded-full mb-3">
            <Text className="text-lime-400 text-[10px] font-bold uppercase tracking-[2px]">
              Food Detail
            </Text>
          </View>
          <Text className="text-white text-4xl font-light tracking-tight text-center">
            {selectedFood.name}
          </Text>
          <View className="h-[2px] w-8 bg-lime-400 mt-4 rounded-full" />
        </View>

        {/* Main Focus: The Calorie Ring/Display */}
        <View className="items-center justify-center mb-12">
          <View className="w-48 h-48 rounded-full border-[0.5px] border-white/10 items-center justify-center bg-white/[0.02]">
            <Text className="text-white font-black" style={{ fontSize: 25 }}>
              {totals.cal}
            </Text>
            <Text className="text-background-400 text-xs font-medium uppercase tracking-[1px] mt-1">
              Calories
            </Text>
          </View>
        </View>

        {/* Amount Picker - Clean & Integrated */}
        <View className="mb-12">
          <View className="flex-row justify-between items-end mb-4 px-2">
            <Text className="text-background-400 text-sm font-bold uppercase tracking-wider">
              Quantity
            </Text>
            <View className="flex-row items-baseline">
              <Text className="text-white text-2xl font-semibold">{dbAmount}</Text>
              <Text className="text-background-500 text-sm ml-1">{unitLabel}</Text>
            </View>
          </View>

          <View className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.05]">
            <ValueStepper
              value={dbAmount}
              onChange={setDbAmount}
              step={isUnitFood ? 0.5 : 10}
              min={isUnitFood ? 0.5 : 10}
              unit="" // השארתי ריק כי הוספנו כותרת מעל
            />
          </View>
        </View>

        {/* Macros Grid - High-End Dashboard Style */}
        <View className="flex-row justify-between px-2">
          <View className="items-start">
            <Text className="text-background-500 text-[10px] font-bold uppercase mb-2 tracking-widest">
              Protein
            </Text>
            <View className="flex-row items-baseline">
              <Text className="text-white text-xl font-medium">{totals.prot}</Text>
              <Text className="text-background-600 text-[10px] ml-1">g</Text>
            </View>
          </View>

          <View className="w-[1px] h-8 bg-white/10 self-end mb-1" />

          <View className="items-start">
            <Text className="text-background-500 text-[10px] font-bold uppercase mb-2 tracking-widest">
              Carbs
            </Text>
            <View className="flex-row items-baseline">
              <Text className="text-white text-xl font-medium">{totals.carb}</Text>
              <Text className="text-background-600 text-[10px] ml-1">g</Text>
            </View>
          </View>

          <View className="w-[1px] h-8 bg-white/10 self-end mb-1" />

          <View className="items-start">
            <Text className="text-background-500 text-[10px] font-bold uppercase mb-2 tracking-widest">
              Fat
            </Text>
            <View className="flex-row items-baseline">
              <Text className="text-white text-xl font-medium">{totals.fat}</Text>
              <Text className="text-background-600 text-[10px] ml-1">g</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  // ── Phase: Custom details ──────────────────────────────────────────────────────
  const renderCustomDetails = () => {
    const unitLabel = isUnits ? 'יחידה' : '100 גרם';

    return (
      <View className="flex-1 px-8 w-full bg-background-950 rounded-md py-6 shadow-black shadow-md">
        <View className="w-full items-start mb-2">
          <Pressable
            onPress={handleBack}
            className="bg-background-800 border border-white/10 h-11 w-11 rounded-xl items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="חזרה"
            accessibilityHint="חזרה לשלב הקודם"
          >
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.white} />
          </Pressable>
        </View>

        {/* Header - Minimalist & Elegant */}
        <View className="mt-6 mb-8 items-center">
          <View className="bg-lime-400/10 px-3 py-1 rounded-full mb-3">
            <Text className="text-lime-400 text-[10px] font-bold uppercase tracking-[2px]">
              Food Detail
            </Text>
          </View>
          <Text className="text-white text-4xl font-light tracking-tight text-center">
            {query.trim() || 'מאכל חדש'}
          </Text>
          <View className="h-[2px] w-8 bg-lime-400 mt-4 rounded-full" />
        </View>

        {/* Measurement toggle - integrated card */}
        <View className="bg-white/[0.03] rounded-3xl p-4 border border-white/[0.05] mb-4">
          <View className="flex-row bg-background-800 rounded-2xl border border-background-600 p-1">
            {(['grams', 'units'] as MeasurementType[]).map((type) => {
              const isActive = measurementType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => {
                    setMeasurementType(type);
                    Haptics.selectionAsync();
                  }}
                  className={`flex-1 py-2.5 rounded-xl items-center ${isActive ? 'bg-lime-500' : ''}`}
                  accessibilityRole="button"
                  accessibilityLabel={type === 'grams' ? 'מדידה בגרמים' : 'מדידה ביחידות'}
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    className={`typo-body-primary ${isActive ? 'text-background-900' : 'text-background-400'}`}
                  >
                    {type === 'grams' ? 'גרמים' : 'יחידות'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Calories */}
        <View className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.05] mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="typo-label text-background-400">קלוריות ל{unitLabel}</Text>
            <View className="flex-row items-center" style={{ gap: 4 }}>
              <Text className="typo-h3 text-white">{calories || '0'}</Text>
              <Text className="typo-label text-background-400">קק״ל</Text>
            </View>
          </View>

          {/* Quick chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 12 }}
            contentContainerStyle={{ gap: 8 }}
          >
            {[50, 100, 150, 200, 250, 300].map((val) => {
              const isActive = parseInt(calories) === val;
              return (
                <Pressable
                  key={val}
                  onPress={() => {
                    setCalories(String(val));
                    Haptics.selectionAsync();
                  }}
                  className={`rounded-xl px-3 py-2 border ${isActive ? 'bg-lime-500/20 border-lime-500' : 'bg-background-700 border-background-600'}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${val} קלוריות`}
                >
                  <Text
                    className={`typo-caption-bold ${isActive ? 'text-lime-400' : 'text-background-300'}`}
                  >
                    {val}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Stepper */}
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Pressable
              onPress={() => {
                setCalories(String(Math.max(0, (parseInt(calories) || 0) + 50)));
                Haptics.selectionAsync();
              }}
              className="w-11 h-11 items-center justify-center bg-lime-500 rounded-xl"
              accessibilityRole="button"
              accessibilityLabel="הוסף 50 קלוריות"
            >
              <Ionicons name="add" size={22} color="#000" />
            </Pressable>
            <TextInput
              value={calories}
              onChangeText={setCalories}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.background[500]}
              className="flex-1 bg-background-700 rounded-xl px-3 py-3 text-center text-white text-xl font-bold"
              style={{
                borderWidth: 1,
                borderColor:
                  (parseFloat(calories) || 0) > 0
                    ? colors.lime[500] + '80'
                    : colors.background[600],
              }}
            />
            <Pressable
              onPress={() => {
                setCalories(String(Math.max(0, (parseInt(calories) || 0) - 50)));
                Haptics.selectionAsync();
              }}
              className="w-11 h-11 items-center justify-center bg-background-700 rounded-xl border border-background-600"
              accessibilityRole="button"
              accessibilityLabel="הפחת 50 קלוריות"
            >
              <Ionicons name="remove" size={22} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Protein */}
        <View className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.05] mb-4 items-center">
          <Text className="typo-label text-background-400 mb-4 text-center">
            חלבון ל{unitLabel} <Text className="text-background-600 ">(אופציונלי)</Text>
          </Text>
          <ValueStepper
            value={proteinValue}
            onChange={setProteinValue}
            step={0.5}
            min={0}
            unit="g"
          />
        </View>

        {/* Consumed amount (optional) */}
        <View className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.05] items-center">
          <Text className="typo-label text-background-400 mb-4 text-center">
            כמה אכלת? <Text className="text-background-600">(אופציונלי)</Text>
          </Text>
          <ValueStepper
            value={consumedAmount}
            onChange={setConsumedAmount}
            step={isUnits ? 0.5 : 5}
            min={0}
            unit={isUnits ? 'יח׳' : 'גרם'}
          />
        </View>
      </View>
    );
  };

  // ── Bottom bar ────────────────────────────────────────────────────────────────
  const renderBottomBar = () => {
    if (phase === 'search') {
      return (
        // <Pressable
        //   onPress={() => onBack?.()}
        //   className="bg-background-800 border border-white/10 h-14 rounded-2xl items-center justify-center"
        //   accessibilityRole="button"
        //   accessibilityLabel="חזרה"
        // >
        //   <MaterialCommunityIcons name="chevron-right" size={24} color={colors.white} />
        // </Pressable>
        <View></View>
      );
    }

    if (phase === 'db-amount') {
      return (
        <Pressable
          onPress={handleConfirmDB}
          disabled={isPending}
          className={`flex-1 flex-row items-center justify-center rounded-2xl h-14 ${isPending ? 'opacity-50 bg-background-700' : 'bg-lime-500'}`}
          accessibilityRole="button"
          accessibilityLabel="הוסף ליומן"
        >
          <MaterialCommunityIcons
            name="notebook-plus-outline"
            size={20}
            color={colors.background[900]}
          />
          <Text className="typo-btn-cta mr-2 text-background-900">
            {isPending ? 'שומר...' : mode === 'meal-builder' ? 'הוסף לארוחה' : 'הוסף ליומן'}
          </Text>
        </Pressable>
      );
    }

    // custom-details
    if (mode === 'meal-builder') {
      return (
        <Pressable
          onPress={() => handleCustomSave(false)}
          disabled={isPending || !step3Valid}
          className={`flex-1 flex-row items-center justify-center rounded-2xl h-14 ${
            isPending || !step3Valid ? 'opacity-50 bg-background-700' : 'bg-lime-500'
          }`}
          accessibilityRole="button"
          accessibilityLabel="שמור והוסף לארוחה"
        >
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={20}
            color={colors.background[900]}
          />
          <Text className="typo-btn-cta mr-2 text-background-900">
            {isPending ? 'שומר...' : 'שמור והוסף לארוחה'}
          </Text>
        </Pressable>
      );
    }

    return (
      <View className="flex-row gap-3">
        <Pressable
          onPress={() => handleCustomSave(false)}
          disabled={isPending || !step3Valid}
          className={`flex-1 flex-row items-center justify-center rounded-2xl border border-white/10 h-14 ${
            isPending || !step3Valid ? 'bg-background-700 opacity-50' : 'bg-background-800'
          }`}
          accessibilityRole="button"
          accessibilityLabel="שמור"
        >
          <MaterialCommunityIcons name="content-save-outline" size={20} color={colors.white} />
          <Text className="typo-label text-white mr-2">{isPending ? 'שומר...' : 'שמור'}</Text>
        </Pressable>
        <Pressable
          onPress={() => handleCustomSave(true)}
          disabled={isPending || !step3Valid}
          className={`flex-1 flex-row items-center justify-center rounded-2xl h-14 ${
            isPending || !step3Valid ? 'opacity-50 bg-background-700' : 'bg-lime-500'
          }`}
          accessibilityRole="button"
          accessibilityLabel="שמור והוסף ליומן"
        >
          <MaterialCommunityIcons
            name="notebook-plus-outline"
            size={20}
            color={colors.background[900]}
          />
          <Text className="typo-label mr-2 text-background-900">שמור + יומן</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: 120,
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* <ProgressDots /> */}
          {phase === 'search' && renderSearch()}
          {phase === 'db-amount' && renderDbAmount()}
          {phase === 'custom-details' && renderCustomDetails()}
        </ScrollView>
        <View className="px-5 pb-4">{renderBottomBar()}</View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddNewFood;
