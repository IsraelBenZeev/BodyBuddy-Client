import { colors } from '@/colors';
import {
  FOOD_CATEGORIES,
  getCategoryById,
  type FoodCategoryId,
} from '@/src/Features/nutrition/add/food/foodCategories';
import type { CreateFoodFormData, MeasurementType } from '@/src/types/nutrition';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

interface Props {
  onSubmit: (data: CreateFoodFormData, addToJournal: boolean) => void;
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

const QUICK_SUGGESTIONS = ['חזה עוף', 'ביצה', 'קוואקר', 'גבינה לבנה', 'לחם'];
const TOTAL_STEPS = 5;

const AddNewFood = ({ onSubmit, isPending, onBack, mode = 'standalone', initialValues, defaultConsumedAmount }: Props) => {
  const [step, setStep] = useState(1);

  // Step 1
  const [foodName, setFoodName] = useState(initialValues?.food_name ?? '');

  // Step 2
  const [measurementType, setMeasurementType] = useState<MeasurementType>(
    initialValues?.measurement_type ?? 'grams'
  );
  // Step 3
  const [calories, setCalories] = useState(
    initialValues?.calories_per_100 != null ? String(initialValues.calories_per_100) : ''
  );
  const [proteinValue, setProteinValue] = useState(initialValues?.protein_per_100 ?? 0);



  // Step 4
  const [selectedCategoryId, setSelectedCategoryId] = useState<FoodCategoryId | null>(
    (initialValues?.category as FoodCategoryId) ?? null
  );

  const isUnits = measurementType === 'units';

  // Portion modal (שמור + יומן)
  const [showPortionModal, setShowPortionModal] = useState(false);
  const [portionAmount, setPortionAmount] = useState(isUnits ? 1 : 100);
  const [consumedAmount, setConsumedAmount] = useState(
    defaultConsumedAmount != null ? String(defaultConsumedAmount) : ''
  );

  const step1Valid = foodName.trim().length > 0;
  const step2Valid = true;
  const step3Valid = (parseFloat(calories) || 0) > 0;

  const handleNext = useCallback(() => {
    if (step === 1 && !step1Valid) return;
    if (step === 2 && !step2Valid) return;
    if (step === 3 && !step3Valid) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, [step, step1Valid, step2Valid, step3Valid]);

  const handleBack = useCallback(() => {
    if (step === 1) {
      onBack?.();
    } else {
      setStep((s) => s - 1);
    }
  }, [step, onBack]);

  const toggleCategory = useCallback((id: FoodCategoryId) => {
    setSelectedCategoryId((prev) => (prev === id ? null : id));
  }, []);

  const buildData = useCallback((portion?: number): CreateFoodFormData => {
    const cal = parseFloat(calories) || 0;
    if (isUnits) {
      return {
        food_name: foodName.trim(),
        measurement_type: 'units',
        category: selectedCategoryId ?? undefined,
        calories_per_unit: cal || undefined,
        protein_per_unit: proteinValue || undefined,
        portion_size: portion,
        portion_unit: portion != null ? 'unit' : undefined,
      };
    }
    return {
      food_name: foodName.trim(),
      measurement_type: 'grams',
      category: selectedCategoryId ?? undefined,
      calories_per_100: cal || undefined,
      protein_per_100: proteinValue || undefined,
      portion_size: portion,
      portion_unit: portion != null ? 'g' : undefined,
    };
  }, [isUnits, foodName, selectedCategoryId, calories, proteinValue]);

  const handleSubmit = useCallback(
    (addToJournal: boolean) => {
      onSubmit(buildData(), addToJournal);
    },
    [onSubmit, buildData]
  );

  const handleAddToJournal = useCallback(() => {
    const parsed = parseFloat(consumedAmount);
    if (!isNaN(parsed) && parsed > 0) {
      onSubmit(buildData(parsed), true);
    } else {
      setPortionAmount(isUnits ? 1 : 100);
      setShowPortionModal(true);
    }
  }, [consumedAmount, isUnits, onSubmit, buildData]);

  const confirmPortionAndSubmit = useCallback(() => {
    setShowPortionModal(false);
    onSubmit(buildData(portionAmount), true);
  }, [onSubmit, buildData, portionAmount]);

  // ── Progress Bar ──────────────────────────────────────────────────────────────
  const ProgressBar = () => (
    <View className="flex-row gap-1.5 mb-6 px-1">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View
          key={i}
          className={`h-1 flex-1 rounded-full ${i < step ? 'bg-lime-500' : 'bg-background-700'}`}
        />
      ))}
    </View>
  );

  // ── Input field ───────────────────────────────────────────────────────────────
  const NumericInput = ({
    value,
    onChange,
    placeholder,
    label,
    helper,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    label: string;
    helper?: string;
  }) => (
    <View className="mb-4">
      <Text className="text-background-400 text-sm mb-2 text-right">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        placeholder={placeholder ?? '0'}
        placeholderTextColor={colors.background[500]}
        style={{
          backgroundColor: colors.background[800],
          borderWidth: 1,
          borderColor: colors.background[600],
          borderRadius: 12,
          padding: 14,
          color: colors.white,
          textAlign: 'right',
          fontSize: 16,
        }}
      />
      {helper != null && (
        <Text className="text-background-500 text-xs mt-1.5 text-right">{helper}</Text>
      )}
    </View>
  );

  // ── Step 1: שם ───────────────────────────────────────────────────────────────
  const renderStep1 = () => (
    <View className="flex-1">
      <Text className="text-lime-400 text-2xl font-black mb-2 text-right">
        {mode === 'meal-builder' ? 'הוספת מזון חדש לארוחה' : 'בואו נוסיף מזון חדש'}
      </Text>
      <Text className="text-background-400 text-sm mb-8 text-right">
        איך קוראים למזון הזה? תן לו שם שתזהה אותו בקלות
      </Text>

      <TextInput
        value={foodName}
        onChangeText={setFoodName}
        placeholder="למשל: חזה עוף, אורז מלא, ביצה..."
        placeholderTextColor={colors.background[500]}
        autoFocus
        style={{
          backgroundColor: colors.background[800],
          borderWidth: 1,
          borderColor: foodName.trim() ? colors.lime[500] : colors.background[600],
          borderRadius: 12,
          padding: 14,
          color: colors.white,
          textAlign: 'right',
          fontSize: 16,
        }}
      />

      <View className="items-center mt-10 mb-6">
        <View className="bg-background-800 w-24 h-24 rounded-3xl items-center justify-center border border-background-600">
          <Ionicons name="nutrition-outline" size={44} color={colors.background[500]} />
        </View>
      </View>

      <Text className="text-background-500 text-xs text-center mb-3">הצעות מהירות</Text>
      <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {QUICK_SUGGESTIONS.map((s) => (
          <Pressable
            key={s}
            onPress={() => setFoodName(s)}
            className="bg-background-800 border border-background-600 rounded-full px-3 py-1.5"
            accessibilityRole="button"
            accessibilityLabel={s}
          >
            <Text className="text-background-300 text-sm">{s}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  // ── Step 2: סוג מדידה ─────────────────────────────────────────────────────────
  const renderStep2 = () => (
    <View className="flex-1">
      <Text className="text-lime-400 text-2xl font-black mb-2 text-right">
        איך בדרך כלל מודדים את זה?
      </Text>
      <Text className="text-background-400 text-sm mb-8 text-right">
        זה יקבע איך נשאל אותך בכל פעם שתוסיף את המזון הזה ליומן
      </Text>

      <View className="gap-3 mb-6">
        <Pressable
          onPress={() => setMeasurementType('grams')}
          className={`rounded-2xl p-5 border-2 flex-row-reverse items-center ${
            measurementType === 'grams'
              ? 'border-lime-500 bg-lime-500/10'
              : 'border-background-600 bg-background-800'
          }`}
          accessibilityRole="button"
          accessibilityLabel="מדידה בגרמים"
          accessibilityState={{ selected: measurementType === 'grams' }}
        >
          <View
            className={`w-12 h-12 rounded-xl items-center justify-center ${
              measurementType === 'grams' ? 'bg-lime-500/20' : 'bg-background-700'
            }`}
          >
            <MaterialCommunityIcons
              name="scale"
              size={24}
              color={measurementType === 'grams' ? colors.lime[500] : colors.background[400]}
            />
          </View>
          <View className="flex-1 mr-3">
            <Text
              className={`text-base font-bold text-right ${
                measurementType === 'grams' ? 'text-lime-400' : 'text-white'
              }`}
            >
              בגרמים / מ״ל
            </Text>
            <Text className="text-background-400 text-xs text-right mt-1">
              מתאים לאורז, בשר, ירקות, שתייה
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setMeasurementType('units')}
          className={`rounded-2xl p-5 border-2 flex-row-reverse items-center ${
            measurementType === 'units'
              ? 'border-lime-500 bg-lime-500/10'
              : 'border-background-600 bg-background-800'
          }`}
          accessibilityRole="button"
          accessibilityLabel="מדידה ביחידות"
          accessibilityState={{ selected: measurementType === 'units' }}
        >
          <View
            className={`w-12 h-12 rounded-xl items-center justify-center ${
              measurementType === 'units' ? 'bg-lime-500/20' : 'bg-background-700'
            }`}
          >
            <MaterialCommunityIcons
              name="counter"
              size={24}
              color={measurementType === 'units' ? colors.lime[500] : colors.background[400]}
            />
          </View>
          <View className="flex-1 mr-3">
            <Text
              className={`text-base font-bold text-right ${
                measurementType === 'units' ? 'text-lime-400' : 'text-white'
              }`}
            >
              ביחידות
            </Text>
            <Text className="text-background-400 text-xs text-right mt-1">
              מתאים לביצה, פרי, פרוסת לחם, כוס
            </Text>
          </View>
        </Pressable>
      </View>

    </View>
  );

  // ── Step 3: ערכים תזונתיים ────────────────────────────────────────────────────
  const renderStep3 = () => {
    const unitLabel = isUnits ? 'יחידה' : '100 גרם';
    const maxProtein = isUnits ? 50 : 100;

    return (
      <View className="flex-1">
        <Text className="text-lime-400 text-2xl font-black mb-2 text-right">
          {isUnits ? `כמה יש ב${unitLabel} אחד?` : `כמה יש ב-100 גרם?`}
        </Text>
        <Text className="text-background-400 text-sm mb-6 text-right">
          {isUnits
            ? 'הכנס את הערכים עבור יחידה אחת בלבד'
            : 'את הערכים האלה תמצא על גב האריזה, או בחיפוש מהיר'}
        </Text>

        {/* קלוריות — ידני בלבד */}
        <View className="bg-background-800 rounded-2xl p-4 mb-4 border border-background-600">
          <Text className="text-background-400 text-sm font-bold text-right mb-3">
            קלוריות ל{isUnits ? unitLabel : '-100 גרם'}
          </Text>
          <View className="flex-row-reverse items-center" style={{ gap: 8 }}>
            <TextInput
              value={calories}
              onChangeText={setCalories}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.background[500]}
              style={{
                flex: 1,
                backgroundColor: colors.background[700],
                borderRadius: 10,
                padding: 12,
                color: colors.white,
                textAlign: 'right',
                fontSize: 20,
                fontWeight: 'bold',
                borderWidth: 1,
                borderColor:
                  (parseFloat(calories) || 0) > 0
                    ? colors.lime[500] + '80'
                    : colors.background[600],
              }}
            />
            <Text className="text-background-400 text-sm">קק״ל</Text>
          </View>
        </View>

        {/* חלבון — Slider */}
        <View className="bg-background-800 rounded-2xl p-4 border border-background-600">
          <View className="flex-row-reverse items-center justify-between mb-4">
            <Text className="text-background-400 text-sm font-bold">
              חלבון ל{isUnits ? unitLabel : '-100 גרם'}
            </Text>
            <View className="flex-row-reverse items-center" style={{ gap: 4 }}>
              <Text className="text-white text-2xl font-black">{Math.round(proteinValue)}</Text>
              <Text className="text-background-400 text-sm">גרם</Text>
            </View>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={maxProtein}
            step={1}
            value={proteinValue}
            onValueChange={(val) => {
              setProteinValue(Math.round(val));
              Haptics.selectionAsync();
            }}
            minimumTrackTintColor={colors.lime[500]}
            maximumTrackTintColor={colors.background[600]}
            thumbTintColor={colors.lime[500]}
          />
          <View className="flex-row-reverse justify-between px-1 mt-1">
            <Text className="text-background-500 text-[10px]">0</Text>
            <Text className="text-background-500 text-[10px]">{Math.round(maxProtein / 2)}</Text>
            <Text className="text-background-500 text-[10px]">{maxProtein}g</Text>
          </View>
        </View>

        {/* כמה אכלת — אופציונלי */}
        <View className="bg-background-800 rounded-2xl p-4 mt-4 border border-background-600">
          <Text className="text-background-400 text-sm font-bold text-right mb-3">
            כמה אכלת?{' '}
            <Text className="text-background-600 font-normal">(אופציונלי)</Text>
          </Text>
          <View className="flex-row-reverse items-center" style={{ gap: 8 }}>
            <TextInput
              value={consumedAmount}
              onChangeText={setConsumedAmount}
              keyboardType="decimal-pad"
              placeholder={isUnits ? '1' : '100'}
              placeholderTextColor={colors.background[500]}
              style={{
                flex: 1,
                backgroundColor: colors.background[700],
                borderRadius: 10,
                padding: 12,
                color: colors.white,
                textAlign: 'right',
                fontSize: 18,
                fontWeight: 'bold',
                borderWidth: 1,
                borderColor:
                  (parseFloat(consumedAmount) || 0) > 0
                    ? colors.lime[500] + '80'
                    : colors.background[600],
              }}
            />
            <Text className="text-background-400 text-sm">{isUnits ? 'יחידות' : 'גרם'}</Text>
          </View>
          <Text className="text-background-600 text-xs text-right mt-1.5">
            מלא רק אם תרצה להוסיף מזון זה ליומן כעת
          </Text>
        </View>
      </View>
    );
  };

  // ── Step 4: קטגוריה ───────────────────────────────────────────────────────────
  const renderStep4 = () => (
    <View className="flex-1">
      <Text className="text-lime-400 text-2xl font-black mb-2 text-right">
        שים אותו בקטגוריה?
      </Text>
      <Text className="text-background-400 text-sm mb-5 text-right">
        לא חובה, אבל עוזר למצוא אותו מהר יותר ברשימה
      </Text>

      {/* Grid מורחב */}
      <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 }} className="mb-6">
        {FOOD_CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => toggleCategory(cat.id)}
              className={`flex-row-reverse items-center rounded-xl border px-3 py-2 ${
                isSelected
                  ? 'border-lime-500 bg-lime-500/15'
                  : 'border-background-600 bg-background-800'
              }`}
              accessibilityRole="button"
              accessibilityLabel={cat.label}
              accessibilityState={{ selected: isSelected }}
            >
              <MaterialCommunityIcons
                name={cat.icon}
                size={16}
                color={isSelected ? colors.lime[500] : colors.background[400]}
              />
              <Text
                className={`text-xs font-bold mr-1.5 ${
                  isSelected ? 'text-lime-400' : 'text-background-400'
                }`}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* כפתור דלג בולט */}
      <Pressable
        onPress={() => { setSelectedCategoryId(null); setStep(5); }}
        className="border border-background-600 rounded-2xl py-3.5 items-center"
        accessibilityRole="button"
        accessibilityLabel="דלג על קטגוריה"
      >
        <Text className="text-background-300 font-bold text-base">דלג על קטגוריה</Text>
      </Pressable>
    </View>
  );

  // ── Step 5: אישור ─────────────────────────────────────────────────────────────
  const renderStep5 = () => {
    const unitLabel = isUnits ? 'יחידה' : '100 גרם';
    const cal = parseFloat(calories) || 0;

    return (
      <View className="flex-1">
        <Text className="text-lime-400 text-2xl font-black mb-2 text-right">
          הכל נראה טוב!
        </Text>
        <Text className="text-background-400 text-sm mb-6 text-right">
          בדוק שהכל נכון לפני השמירה
        </Text>

        <View className="bg-background-800 rounded-2xl p-5 border border-background-600 gap-3">
          <View className="flex-row-reverse items-center justify-between">
            <Text className="text-background-400 text-sm">שם</Text>
            <Text className="text-white font-bold text-right flex-1 mr-4">{foodName}</Text>
          </View>
          <View className="h-[1px] bg-background-700" />
          <View className="flex-row-reverse items-center justify-between">
            <Text className="text-background-400 text-sm">מדידה</Text>
            <Text className="text-white font-bold">
              {isUnits ? `ביחידות (${unitLabel})` : 'בגרמים'}
            </Text>
          </View>
          <View className="h-[1px] bg-background-700" />
          <View className="flex-row-reverse items-center justify-between">
            <Text className="text-background-400 text-sm">קלוריות ל{unitLabel}</Text>
            <Text className="text-lime-400 font-bold">{cal} קק״ל</Text>
          </View>
          <View className="flex-row-reverse items-center justify-between">
            <Text className="text-background-400 text-sm">חלבון ל{unitLabel}</Text>
            <Text className="text-lime-400 font-bold">{proteinValue}g</Text>
          </View>

          {selectedCategoryId != null && (
            <>
              <View className="h-[1px] bg-background-700" />
              <View className="flex-row-reverse items-center justify-between">
                <Text className="text-background-400 text-sm">קטגוריה</Text>
                <Text className="text-white font-bold">
                  {getCategoryById(selectedCategoryId)?.label}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  const canProceed = useMemo(() => {
    if (step === 1) return step1Valid;
    if (step === 2) return step2Valid;
    if (step === 3) return step3Valid;
    return true;
  }, [step, step1Valid, step2Valid, step3Valid]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-5 pt-4"
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <ProgressBar />

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </ScrollView>

        {/* כפתורי ניווט */}
        <View className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-background-900/95 border-t border-background-700">
          {step < 5 ? (
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleBack}
                className="bg-background-800 border border-white/10 h-14 w-14 rounded-2xl items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="חזרה"
              >
                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.white} />
              </Pressable>
              <Pressable
                onPress={handleNext}
                disabled={!canProceed}
                className={`flex-1 flex-row-reverse items-center justify-center rounded-2xl h-14 ${
                  canProceed ? 'bg-lime-500' : 'bg-background-700'
                }`}
                accessibilityRole="button"
                accessibilityLabel="המשך"
              >
                <Text
                  className={`font-black text-base ${
                    canProceed ? 'text-background-900' : 'text-background-500'
                  }`}
                >
                  המשך
                </Text>
              </Pressable>
            </View>
          ) : mode === 'meal-builder' ? (
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleBack}
                className="bg-background-800 border border-white/10 h-14 w-14 rounded-2xl items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="חזרה"
              >
                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.white} />
              </Pressable>
              <Pressable
                onPress={() => handleSubmit(false)}
                disabled={isPending}
                className={`flex-1 flex-row-reverse items-center justify-center rounded-2xl h-14 ${
                  isPending ? 'opacity-50 bg-background-700' : 'bg-lime-500'
                }`}
                accessibilityRole="button"
                accessibilityLabel="שמור והוסף לארוחה"
              >
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={20}
                  color={colors.background[900]}
                />
                <Text className="mr-2 font-black text-base text-background-900">
                  {isPending ? 'שומר...' : 'שמור והוסף לארוחה'}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleBack}
                className="bg-background-800 border border-white/10 h-14 w-14 rounded-2xl items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="חזרה"
              >
                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.white} />
              </Pressable>
              <Pressable
                onPress={() => handleSubmit(false)}
                disabled={isPending}
                className={`flex-1 flex-row-reverse items-center justify-center rounded-2xl border border-white/10 h-14 ${
                  isPending ? 'bg-background-700 opacity-50' : 'bg-background-800'
                }`}
                accessibilityRole="button"
                accessibilityLabel="שמור"
              >
                <MaterialCommunityIcons name="content-save-outline" size={20} color={colors.white} />
                <Text className="text-white font-black text-sm mr-2">
                  {isPending ? 'שומר...' : 'שמור'}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleAddToJournal}
                disabled={isPending}
                className={`flex-1 flex-row-reverse items-center justify-center rounded-2xl h-14 ${
                  isPending ? 'opacity-50 bg-background-700' : 'bg-lime-500'
                }`}
                accessibilityRole="button"
                accessibilityLabel="שמור והוסף ליומן"
              >
                <MaterialCommunityIcons
                  name="notebook-plus-outline"
                  size={20}
                  color={colors.background[900]}
                />
                <Text className="mr-2 font-black text-sm text-background-900">
                  שמור + יומן
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* Modal: כמה אכלת? */}
      <Modal
        visible={showPortionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPortionModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/70 justify-end"
          onPress={() => setShowPortionModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="bg-background-900 rounded-t-3xl px-6 pt-6 pb-12">
              {/* Handle */}
              <View className="items-center mb-5">
                <View className="w-12 h-1.5 bg-white/10 rounded-full" />
              </View>

              <Text className="text-white text-xl font-black text-right mb-1">
                כמה אכלת?
              </Text>
              <Text className="text-background-400 text-sm text-right mb-6">
                {isUnits ? 'מספר יחידות' : 'כמות בגרמים'}
              </Text>

              {/* ערך גדול */}
              <View className="bg-background-800 rounded-2xl p-5 mb-6 border border-background-600 items-center">
                <Text className="text-white font-black" style={{ fontSize: 52, lineHeight: 60 }}>
                  {Math.round(portionAmount)}
                </Text>
                <Text className="text-background-400 text-base mt-1">
                  {isUnits ? 'יחידות' : 'גרם'}
                </Text>
              </View>

              {/* Slider */}
              <Slider
                style={{ width: '100%', height: 44 }}
                minimumValue={isUnits ? 0.5 : 10}
                maximumValue={isUnits ? 20 : 1000}
                step={isUnits ? 0.5 : 5}
                value={portionAmount}
                onValueChange={(v) => {
                  setPortionAmount(isUnits ? Math.round(v * 2) / 2 : Math.round(v / 5) * 5);
                  Haptics.selectionAsync();
                }}
                minimumTrackTintColor={colors.lime[500]}
                maximumTrackTintColor={colors.background[600]}
                thumbTintColor={colors.lime[500]}
              />
              <View className="flex-row-reverse justify-between px-1 mt-1 mb-6">
                <Text className="text-background-500 text-xs">
                  {isUnits ? '0.5' : '10'}
                </Text>
                <Text className="text-background-500 text-xs">
                  {isUnits ? '20 יחידות' : '1000g'}
                </Text>
              </View>

              {/* כפתור אישור */}
              <Pressable
                onPress={confirmPortionAndSubmit}
                disabled={isPending}
                className={`rounded-2xl h-14 items-center justify-center ${
                  isPending ? 'bg-background-700 opacity-50' : 'bg-lime-500'
                }`}
                accessibilityRole="button"
                accessibilityLabel="הוסף ליומן"
              >
                <Text className="text-background-900 font-black text-base">
                  {isPending ? 'שומר...' : 'הוסף ליומן'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default AddNewFood;
