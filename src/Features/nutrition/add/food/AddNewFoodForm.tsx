import { colors } from '@/colors';
import { useRecentFoods, useSearchFoodItems, useTrackFoodUsage } from '@/src/hooks/useNutrition';
import { useAuthStore } from '@/src/store/useAuthStore';
import type { CreateFoodFormData, FoodItem, MeasurementType } from '@/src/types/nutrition';
import ActionButton from '@/src/ui/ActionButton';
import ValueStepper from '@/src/ui/ValueStepper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type Phase = 'search' | 'db-amount' | 'custom-details';

interface Props {
  onSubmit: (data: CreateFoodFormData, addToJournal: boolean) => void;
  onSelectExisting?: (food: FoodItem, amount: number) => void;
  isPending: boolean;
  onBack?: () => void;
  onPhaseChange?: (phase: Phase) => void;
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
  onPhaseChange,
  mode = 'standalone',
  initialValues,
  defaultConsumedAmount,
}: Props) => {
  const insets = useSafeAreaInsets();
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
  const [carbsValue, setCarbsValue] = useState(initialValues?.carbs_per_100 ?? 0);
  const [consumedAmount, setConsumedAmount] = useState<number>(defaultConsumedAmount ?? 0);
  const [pendingAction, setPendingAction] = useState<'save' | 'journal' | null>(null);

  useEffect(() => {
    if (!isPending) setPendingAction(null);
  }, [isPending]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  const { data: searchResults = [], isLoading } = useSearchFoodItems(debouncedQuery, userId);
  const { data: recentFoods = [], isLoading: isRecentLoading } = useRecentFoods(userId || undefined);
  const { mutate: trackUsage } = useTrackFoodUsage(userId);

  const isUnits = measurementType === 'units';

  const handleSelectFromDB = useCallback((food: FoodItem) => {
    Haptics.selectionAsync();
    trackUsage(food);
    setSelectedFood(food);
    setDbAmount(food.measurement_type === 'units' ? 1 : 100);
    setPhase('db-amount');
  }, [trackUsage]);

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
          carbs_per_unit: carbsValue || undefined,
          portion_size: portion,
          portion_unit: portion != null ? 'unit' : undefined,
        };
      }
      return {
        food_name: query.trim(),
        measurement_type: 'grams',
        calories_per_100: cal || undefined,
        protein_per_100: proteinValue || undefined,
        carbs_per_100: carbsValue || undefined,
        portion_size: portion,
        portion_unit: portion != null ? 'g' : undefined,
      };
    },
    [isUnits, query, calories, proteinValue, carbsValue]
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

  // ── Phase: Search ─────────────────────────────────────────────────────────────
  const renderSearch = () => {
    const showResults = debouncedQuery.trim().length >= 2;
    const noResults = showResults && !isLoading && searchResults.length === 0;

    return (
      <View className="flex-1 px-4 w-full">
        {/* Header — same pattern as db-amount */}
        <View className="mb-6 items-center">
          <View className="bg-lime-400/10 px-3 py-1 rounded-full mb-3">
            <Text className="text-lime-400 text-[10px] font-bold uppercase tracking-[2px]">
              {mode === 'meal-builder' ? 'Meal Builder' : 'Food Search'}
            </Text>
          </View>
          <Text className="text-white text-4xl font-light tracking-tight text-center">
            {mode === 'meal-builder' ? 'הוסף מזון' : 'חפש מאכל'}
          </Text>
          <View className="h-[2px] w-8 bg-lime-400 mt-4 rounded-full" />
        </View>

        {/* Search input card */}
        <View className="bg-white/[0.03] rounded-3xl p-4 border border-white/[0.05] mb-4">
          <View
            className="flex-row items-center bg-background-800 rounded-2xl border px-4"
            style={{
              borderColor: query.trim()
                ? colors.lime[500] + '80'
                : 'rgba(255,255,255,0.08)',
            }}
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
          <Text className="typo-caption text-background-500 text-center mt-3">
            הקלד שם המאכל — נמצא לך את הנתונים
          </Text>
        </View>

        {/* Results */}
        {showResults && searchResults.length > 0 && (
          <View className="bg-white/[0.03] rounded-3xl border border-white/[0.05] mb-3 overflow-hidden">
            {searchResults.map((food, idx) => {
              const cal =
                food.measurement_type === 'units' ? food.calories_per_unit : food.calories_per_100;
              const calLabel = food.measurement_type === 'units' ? 'קק"ל/יח׳' : 'קק"ל/100g';
              const isLast = idx === searchResults.length - 1;
              return (
                <Pressable
                  key={food.id}
                  onPress={() => handleSelectFromDB(food)}
                  className="flex-row items-center px-5 py-4"
                  accessibilityRole="button"
                  accessibilityLabel={`בחר ${food.name}`}
                >
                  <View className="flex-1 items-start">
                    <Text className="typo-body-primary text-white">{food.name}</Text>
                    {cal != null && (
                      <Text className="typo-caption text-background-400 mt-0.5">
                        {Math.round(cal)} {calLabel}
                      </Text>
                    )}
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={20}
                    color={colors.lime[500] + '80'}
                  />
                  {!isLast && (
                    <View className="absolute bottom-0 left-5 right-5 h-[0.5px] bg-white/[0.06]" />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {/* No results */}
        {noResults && (
          <View className="bg-white/[0.03] rounded-3xl p-5 border border-white/[0.05] mb-3 items-center">
            <Text className="typo-body-primary text-background-500 mb-1">לא נמצאו תוצאות</Text>
            <Text className="typo-caption text-background-600 text-center">
              עבור &quot;{debouncedQuery}&quot;
            </Text>
          </View>
        )}

        {/* Add custom CTA */}
        {showResults && query.trim().length > 0 && (
          <Pressable
            onPress={handleStartCustom}
            className=" flex-row items-center justify-center gap-2 p bg-lime-500/10 border border-lime-500/30 rounded-3xl px-8 py-4 mb-3"
            accessibilityRole="button"
            accessibilityLabel={`הוסף ${query.trim()} כמאכל מותאם אישית`}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.lime[500]} />
            <Text className="typo-body-primary text-lime-400 mr-2">
              הוסף &quot;{query.trim()}&quot; כמאכל מותאם אישית
            </Text>
          </Pressable>
        )}

        {/* Recent foods + Quick suggestions (when query is empty) */}
        {!showResults && (
          <>
            {(isRecentLoading || recentFoods.length > 0) && (
              <>
                <View className="flex-row items-center mb-3 mt-2">
                  <View className="flex-1 h-[0.5px] bg-white/[0.06]" />
                  <Text className="typo-caption text-background-500 mx-3">שמישים לאחרונה</Text>
                  <View className="flex-1 h-[0.5px] bg-white/[0.06]" />
                </View>
                {isRecentLoading ? (
                  <View className="bg-white/[0.03] rounded-3xl border border-white/[0.05] mb-4 flex-row items-center justify-center py-5 gap-3 ">
                    <ActivityIndicator size="small" color={colors.lime[500]} />
                    <Text className="typo-caption text-background-500">טוען מההיסטוריה...</Text>
                  </View>
                ) : (
                  <View className="bg-white/[0.03] rounded-3xl border border-white/[0.05] mb-4 overflow-hidden ">
                    {recentFoods.slice(0, 5).map((food, idx) => {
                      const cal =
                        food.measurement_type === 'units'
                          ? food.calories_per_unit
                          : food.calories_per_100;
                      const calLabel =
                        food.measurement_type === 'units' ? 'קק"ל/יח׳' : 'קק"ל/100g';
                      const isLast = idx === Math.min(recentFoods.length, 5) - 1;
                      return (
                        <Pressable
                          key={food.id}
                          onPress={() => handleSelectFromDB(food)}
                          className="flex-row items-center px-5 py-4"
                          accessibilityRole="button"
                          accessibilityLabel={`בחר ${food.name}`}
                        >
                          <View className="flex-1 items-start">
                            <Text className="typo-body-primary text-white">{food.name}</Text>
                            {cal != null && (
                              <Text className="typo-caption text-background-400 mt-0.5">
                                {Math.round(cal)} {calLabel}
                              </Text>
                            )}
                          </View>
                          <MaterialCommunityIcons
                            name="history"
                            size={16}
                            color={colors.background[500]}
                            importantForAccessibility="no"
                          />
                          {!isLast && (
                            <View className="absolute bottom-0 left-5 right-5 h-[0.5px] bg-white/[0.06]" />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </>
            )}
            <View className="flex-row items-center mb-3">
              <View className="flex-1 h-[0.5px] bg-white/[0.06]" />
              <Text className="typo-caption text-background-500 mx-3">הצעות מהירות</Text>
              <View className="flex-1 h-[0.5px] bg-white/[0.06]" />
            </View>
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}
            >
              {QUICK_SUGGESTIONS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setQuery(s)}
                  className="bg-white/[0.03] border border-white/[0.08] rounded-full px-3 py-1.5"
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
      <View className="flex-1 px-4 w-full">
        {/* Header - Minimalist & Elegant */}
        <View className="mb-6 items-center">
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
        <View className="items-center justify-center mb-8">
          <View className="w-48 h-48 rounded-full border-[0.5px] border-white/10 items-center justify-center bg-white/[0.02]">
            <Text className="text-white font-black" style={{ fontSize: 20 }}>
              {totals.cal}
            </Text>
            <Text className="typo-caption text-background-400 mt-1">
              קלוריות
            </Text>
          </View>
        </View>

        {/* Amount Picker - Clean & Integrated */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4 px-2">
            <Text className="typo-label text-background-400">
              כמות
            </Text>
            <View className="flex-row items-baseline">
              <Text className="typo-h3 text-white">{dbAmount}</Text>
              <Text className="typo-label text-background-500 ml-1">{unitLabel}</Text>
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
            <Text className="typo-caption text-background-500 mb-2">
              חלבון
            </Text>
            <View className="flex-row items-baseline">
              <Text className="typo-body-primary text-white">{totals.prot}</Text>
              <Text className="typo-caption text-background-600 ml-1">g</Text>
            </View>
          </View>

          <View className="w-[1px] h-8 bg-white/10 self-end mb-1" />

          <View className="items-start">
            <Text className="typo-caption text-background-500 mb-2">
              פחמימות
            </Text>
            <View className="flex-row items-baseline">
              <Text className="typo-body-primary text-white">{totals.carb}</Text>
              <Text className="typo-caption text-background-600 ml-1">g</Text>
            </View>
          </View>

          <View className="w-[1px] h-8 bg-white/10 self-end mb-1" />

          <View className="items-start">
            <Text className="typo-caption text-background-500 mb-2">
              שומן
            </Text>
            <View className="flex-row items-baseline">
              <Text className="typo-body-primary text-white">{totals.fat}</Text>
              <Text className="typo-caption text-background-600 ml-1">g</Text>
            </View>
          </View>
        </View>

        <View className="mt-6 px-2">
          <Text className="typo-caption text-background-500 text-center">
            {'מצאתם טעות בערכים? '}
            <Text
              onPress={() => Linking.openURL('mailto:bodybuddysupport@gmail.com')}
              className="text-lime-400"
            >
              {'דווחו לנו'}
            </Text>
          </Text>
        </View>
      </View>
    );
  };
  // ── Phase: Custom details ──────────────────────────────────────────────────────
  const renderCustomDetails = () => {
    const unitLabel = isUnits ? 'יחידה' : '100 גרם';

    return (
      <View className="flex-1 px-4 w-full ">
        {/* Header - Minimalist & Elegant */}
        <View className="mb-6 items-center">
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
          <Text className="typo-caption text-background-500 text-center mt-3">
            {measurementType === 'grams'
              ? 'ערכי התזונה מחושבים לכל 100 גרם — מתאים לאוכל שנמדד במשקל (בשר, אורז, גבינה...)'
              : 'ערכי התזונה מחושבים לכל יחידה — מתאים לפירות, ביצים, לחמניות...'}
          </Text>
        </View>

        {/* Calories */}
        <View className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.05] mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="typo-label text-background-400">קלוריות ל{unitLabel}</Text>
            <View className="flex-row items-center" style={{ gap: 4 }}>
              <Text className="typo-body-primary text-white">{calories || '0'}</Text>
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
                setCalories(String(Math.max(0, (parseInt(calories) || 0) + 10)));
                Haptics.selectionAsync();
              }}
              className="w-11 h-11 items-center justify-center bg-lime-500 rounded-xl"
              accessibilityRole="button"
              accessibilityLabel="הוסף 10 קלוריות"
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
                setCalories(String(Math.max(0, (parseInt(calories) || 0) - 10)));
                Haptics.selectionAsync();
              }}
              className="w-11 h-11 items-center justify-center bg-background-700 rounded-xl border border-background-600"
              accessibilityRole="button"
              accessibilityLabel="הפחת 10 קלוריות"
            >
              <Ionicons name="remove" size={22} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Protein */}
        <View className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.05] mb-4 items-center">
          <Text className="typo-label text-background-400 mb-4 text-center">
            חלבון ל{unitLabel} <Text className="text-background-600">(אופציונלי)</Text>
          </Text>
          <ValueStepper
            value={proteinValue}
            onChange={setProteinValue}
            step={1}
            min={0}
            unit="g"
          />
        </View>

        {/* Carbs */}
        <View className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.05] mb-4 items-center">
          <Text className="typo-label text-background-400 mb-4 text-center">
            פחמימות ל{unitLabel} <Text className="text-background-600">(אופציונלי)</Text>
          </Text>
          <ValueStepper
            value={carbsValue}
            onChange={setCarbsValue}
            step={1}
            min={0}
            unit="g"
          />
        </View>

        {/* Consumed amount (optional) */}
        <View className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.05] items-center">
          <Text className="typo-label text-background-400 mb-4 text-center">
            {mode === 'meal-builder' ? 'כמות מנה בארוחה' : 'כמה אכלת? (אופציונלי)'}{' '}
            <Text className="text-background-600"></Text>
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
      return null;
    }

    if (phase === 'db-amount') {
      return (
        <ActionButton
          onPress={handleConfirmDB}
          disabled={isPending}
          loading={isPending}
          label={mode === 'meal-builder' ? 'הוסף לארוחה' : 'הוסף ליומן'}
          iconName="add-circle"
          variant="primary"
          size="lg"
          fullWidth
        />
      );
    }

    // custom-details
    if (mode === 'meal-builder') {
      return (
        <ActionButton
          onPress={() => handleCustomSave(false)}
          disabled={isPending || !step3Valid}
          loading={isPending}
          label="שמור והוסף לארוחה"
          iconName="add-circle"
          variant="primary"
          size="lg"
          fullWidth
        />
      );
    }

    return (
      <View className="flex-row gap-3">
        <View style={{ flex: 1 }}>
          <ActionButton
            onPress={() => { setPendingAction('save'); handleCustomSave(false); }}
            disabled={isPending || !step3Valid}
            loading={isPending && pendingAction === 'save'}
            label="שמור"
            iconName="save-outline"
            variant="secondary"
            size="md"
            fullWidth
          />
        </View>
        <View style={{ flex: 1 }}>
          <ActionButton
            onPress={() => { setPendingAction('journal'); handleCustomSave(true); }}
            disabled={isPending || !step3Valid}
            loading={isPending && pendingAction === 'journal'}
            label="שמור + יומן"
            iconName="add-circle"
            variant="primary"
            size="md"
            fullWidth
          />
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1">
        <View className="flex flex-row justify-between px-6 ">
          {phase !== 'search' && (
            <View className="">
              <Pressable
                onPress={handleBack}
                className="bg-background-800 border border-white/10 h-11 w-11 rounded-xl items-center justify-center "
                accessibilityRole="button"
                accessibilityLabel="חזרה"
                accessibilityHint="חזרה לשלב הקודם"
              >
                <MaterialCommunityIcons name="chevron-right" size={22} color={colors.white} />
              </Pressable>
            </View>
          )}
          {mode !== 'meal-builder' && (
            <View className="">
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
          )}
        </View>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 16,
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {phase === 'search' && renderSearch()}
          {phase === 'db-amount' && renderDbAmount()}
          {phase === 'custom-details' && renderCustomDetails()}
        </ScrollView>
        {phase !== 'search' && (
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: insets.bottom + 16,
              paddingTop: 12,
            }}
          >
            {renderBottomBar()}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddNewFood;
