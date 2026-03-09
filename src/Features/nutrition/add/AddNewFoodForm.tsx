import { colors } from '@/colors';
import {
  FOOD_CATEGORIES,
  getCategoryById,
  type FoodCategoryId,
} from '@/src/Features/nutrition/add/foodCategories';
import HorizontalRuler from '@/src/Features/onboarding/HorizontalRuler';
import type { SliderEntryFormData } from '@/src/types/nutrition';
import FormInput from '@/src/ui/FormInput';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

interface Props {
  /** addToJournal: true = שמירה לרשימה + הוספה ליומן, false = שמירה לרשימה בלבד */
  onSubmit: (data: SliderEntryFormData, addToJournal: boolean) => void;
  isPending: boolean;
  onBack?: () => void;
  /** meal-builder: מציג כפתור אחד "שמור והוסף לארוחה" במקום שני כפתורים */
  mode?: 'standalone' | 'meal-builder';
  /** ערכים ראשוניים (מ-AI או מקור חיצוני) */
  initialValues?: {
    food_name?: string;
    protein_per_100?: number;
    carbs_per_100?: number;
    fat_per_100?: number;
    serving_weight?: number;
    category?: string;
  };
}

const AddNewFood = ({ onSubmit, isPending, onBack, mode = 'standalone', initialValues }: Props) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<FoodCategoryId | null>(
    (initialValues?.category as FoodCategoryId) ?? null
  );
  const [protein, setProtein] = useState(initialValues?.protein_per_100 ?? 0);
  const [carbs, setCarbs] = useState(initialValues?.carbs_per_100 ?? 0);
  const [fat, setFat] = useState(initialValues?.fat_per_100 ?? 0);
  const [servingWeight, setServingWeight] = useState(initialValues?.serving_weight ?? 100);
  const [quantity, setQuantity] = useState(1);
  const [isManualCalories, setIsManualCalories] = useState(false);
  const [manualCalories, setManualCalories] = useState('');

  const toggleCategory = useCallback((id: FoodCategoryId) => {
    setSelectedCategoryId((prev) => (prev === id ? null : id));
  }, []);

  const { control, handleSubmit } = useForm<{ food_name: string }>({
    defaultValues: {
      food_name: initialValues?.food_name ?? '',
    },
  });

  const calculatedCalories = useMemo(() => {
    return Math.round((protein * 4 + carbs * 4 + fat * 9) * 10) / 10;
  }, [protein, carbs, fat]);

  const activeCalories = isManualCalories ? (parseFloat(manualCalories) || 0) : calculatedCalories;

  const portionGrams = quantity * servingWeight;
  const portionCalories = useMemo(() => {
    const ratio = portionGrams / 100;
    return Math.round(activeCalories * ratio * 10) / 10;
  }, [activeCalories, portionGrams]);

  const buildSubmitData = useCallback(
    (formData: { food_name: string }): SliderEntryFormData => ({
      food_name: formData.food_name,
      category: selectedCategoryId ?? undefined,
      serving_weight: servingWeight,
      protein_per_100: protein,
      carbs_per_100: carbs,
      fat_per_100: fat,
      calories_per_100: isManualCalories ? (parseFloat(manualCalories) || 0) : undefined,
      portion_size: portionGrams,
      portion_unit: 'g',
    }),
    [selectedCategoryId, servingWeight, protein, carbs, fat, isManualCalories, manualCalories, portionGrams]
  );

  const handleFormSubmit = useCallback(
    (formData: { food_name: string }, addToJournal: boolean) => {
      onSubmit(buildSubmitData(formData), addToJournal);
    },
    [onSubmit, buildSubmitData]
  );

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 px-5 py-4">
        <Text className="text-lime-400 text-2xl font-black mb-2 text-right">
          {mode === 'meal-builder' ? 'הוספת מזון חדש לארוחה' : 'הוספת מזון חדש'}
        </Text>
        <Text className="text-background-400 text-sm mb-6 text-right">המזון יישמר לשימוש חוזר</Text>

        <FormInput
          control={control}
          name="food_name"
          label="שם המזון"
          placeholder="לדוגמה: חזה עוף, אורז, ביצה..."
          rules={{ required: 'יש להזין שם מזון' }}
          containerStyle={{ marginBottom: 24 }}
          inputStyle={{
            backgroundColor: colors.background[800],
            borderWidth: 1,
            borderColor: colors.background[600],
            borderRadius: 12,
            padding: 12,
            color: colors.white,
            textAlign: 'right',
          }}
          labelStyle={{
            color: colors.background[400],
            fontSize: 14,
            marginBottom: 8,
            textAlign: 'right',
          }}
          isPendingCreate={isPending}
        />

        <Text className="text-background-400 text-sm mb-3 text-right">קטגוריה (אופציונלי)</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row-reverse',
            gap: 10,
            paddingHorizontal: 2,
            paddingVertical: 4,
          }}
          className="mb-4 -mx-1"
        >
          {FOOD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => toggleCategory(cat.id)}
                className={`flex-row-reverse items-center rounded-xl border-2 px-3.5 py-2.5 ${
                  isSelected
                    ? 'border-lime-500 bg-lime-500/15'
                    : 'border-background-600 bg-background-800'
                }`}
              >
                <MaterialCommunityIcons
                  name={cat.icon}
                  size={18}
                  color={isSelected ? colors.lime[500] : colors.background[400]}
                />
                <Text
                  className={`text-sm font-bold mr-2 ${
                    isSelected ? 'text-lime-400' : 'text-background-400'
                  }`}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {selectedCategoryId && (
          <View className="flex-row-reverse items-center mb-2">
            <Text className="text-background-400 text-xs mr-2">נבחר:</Text>
            <View className="flex-row-reverse items-center bg-background-800 rounded-lg px-2 py-1">
              <MaterialCommunityIcons
                name={getCategoryById(selectedCategoryId)?.icon ?? 'food-variant'}
                size={14}
                color={colors.lime[500]}
              />
              <Text className="text-lime-400 text-xs font-bold mr-1.5">
                {getCategoryById(selectedCategoryId)?.label}
              </Text>
            </View>
          </View>
        )}

        <Text className="text-white text-lg font-bold mb-4 text-right">
          ערכים תזונתיים (ל-100g)
        </Text>

        <View className="bg-background-800 rounded-2xl p-4 mb-3 border border-lime-500/30">
          <View className="flex-row-reverse items-center justify-between mb-2">
            <Text className="text-lime-500 text-sm font-bold">חלבון</Text>
            <Text className="text-lime-500 text-lg font-black">{protein}g</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={protein}
            onValueChange={setProtein}
            minimumTrackTintColor={colors.lime[500]}
            maximumTrackTintColor={colors.background[600]}
            thumbTintColor={colors.lime[500]}
          />
        </View>

        <View className="bg-background-800 rounded-2xl p-4 mb-3 border border-orange-500/30">
          <View className="flex-row-reverse items-center justify-between mb-2">
            <Text className="text-orange-500 text-sm font-bold">פחמימות</Text>
            <Text className="text-orange-500 text-lg font-black">{carbs}g</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={carbs}
            onValueChange={setCarbs}
            minimumTrackTintColor={colors.orange[500]}
            maximumTrackTintColor={colors.background[600]}
            thumbTintColor={colors.orange[500]}
          />
        </View>

        <View className="bg-background-800 rounded-2xl p-4 mb-3 border border-red-500/30">
          <View className="flex-row-reverse items-center justify-between mb-2">
            <Text className="text-red-500 text-sm font-bold">שומן</Text>
            <Text className="text-red-500 text-lg font-black">{fat}g</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={fat}
            onValueChange={setFat}
            minimumTrackTintColor={colors.red[500]}
            maximumTrackTintColor={colors.background[600]}
            thumbTintColor={colors.red[500]}
          />
        </View>

        <View className="bg-background-700 rounded-2xl p-4 mb-6 border border-background-600">
          <View className="flex-row-reverse items-center justify-between mb-3">
            <Text className="text-background-400 text-sm font-bold">קלוריות (ל-100g)</Text>
            <View className="flex-row gap-1">
              <Pressable
                onPress={() => { setIsManualCalories(false); setManualCalories(''); }}
                className={`px-3 py-1 rounded-lg border ${!isManualCalories ? 'bg-lime-500/15 border-lime-500' : 'bg-background-800 border-background-600'}`}
              >
                <Text className={`text-xs font-bold ${!isManualCalories ? 'text-lime-400' : 'text-background-400'}`}>
                  אוטומטי
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setIsManualCalories(true)}
                className={`px-3 py-1 rounded-lg border ${isManualCalories ? 'bg-lime-500/15 border-lime-500' : 'bg-background-800 border-background-600'}`}
              >
                <Text className={`text-xs font-bold ${isManualCalories ? 'text-lime-400' : 'text-background-400'}`}>
                  ידני
                </Text>
              </Pressable>
            </View>
          </View>
          {isManualCalories ? (
            <View className="flex-row-reverse items-center gap-2">
              <TextInput
                value={manualCalories}
                onChangeText={setManualCalories}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.background[500]}
                className="flex-1 text-white text-xl font-black text-right bg-background-800 rounded-xl px-3 py-2 border border-lime-500/40"
              />
              <Text className="text-background-400 text-sm">קק״ל</Text>
            </View>
          ) : (
            <View className="flex-row-reverse items-center justify-between">
              <Text className="text-background-400 text-xs">מחושב מהמאקרואים</Text>
              <Text className="text-white text-xl font-black">{calculatedCalories}</Text>
            </View>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-background-400 text-sm mb-3 text-right">
            כמה שוקלת מנה/יחידה אחת? (גרם)
          </Text>
          <HorizontalRuler
            min={1}
            max={500}
            value={servingWeight}
            onChange={setServingWeight}
            unit="גרם"
          />
        </View>

        <View className="mb-4">
          <Text className="text-background-400 text-sm mb-3 text-right">כמה אכלת? (מנות)</Text>
          <View className="flex-row-reverse items-center justify-center bg-background-800 border border-background-600 rounded-2xl py-3 px-4">
            <Pressable
              onPress={() => setQuantity((q) => q + 1)}
              className="w-12 h-12 items-center justify-center bg-lime-500/20 rounded-xl active:bg-lime-500/30"
            >
              <MaterialCommunityIcons name="plus" size={24} color={colors.lime[500]} />
            </Pressable>
            <Text className="text-white font-black text-2xl min-w-[48px] text-center mx-4">
              {quantity}
            </Text>
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-12 h-12 items-center justify-center bg-background-700 rounded-xl active:bg-background-600"
            >
              <MaterialCommunityIcons name="minus" size={24} color={colors.white} />
            </Pressable>
          </View>
          <Text className="text-background-500 text-xs text-center mt-2">
            {quantity} × {servingWeight}g = {portionGrams}g
          </Text>
        </View>

        <View className="bg-lime-500/10 border border-lime-500/30 rounded-2xl p-4 mb-6">
          <Text className="text-lime-400 text-center font-bold">
            אופציה: תוסיף גם ליומן — {portionCalories} קק״ל
          </Text>
        </View>

        <View className="h-28" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-background-900/95 border-t border-background-700">
        {mode === 'meal-builder' ? (
          <Pressable
            onPress={handleSubmit((formData) => handleFormSubmit(formData, false))}
            disabled={isPending}
            className={`flex-row-reverse items-center justify-center rounded-2xl py-4 ${isPending ? 'opacity-50 bg-background-700' : 'bg-lime-500'}`}
          >
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={20}
              color={colors.background[900]}
            />
            <Text className="mr-2 font-black text-base text-background-900" numberOfLines={1}>
              שמור והוסף לארוחה
            </Text>
          </Pressable>
        ) : (
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleSubmit((formData) => handleFormSubmit(formData, false))}
              disabled={isPending}
              className={`flex-1 flex-row-reverse items-center justify-center rounded-2xl border border-white/10 py-4 ${isPending ? 'bg-background-700 opacity-50' : 'bg-background-800'}`}
            >
              <MaterialCommunityIcons name="content-save-outline" size={20} color={colors.white} />
              <Text className="text-white font-black text-sm mr-2" numberOfLines={1}>
                שמור
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit((formData) => handleFormSubmit(formData, true))}
              disabled={isPending}
              className={`flex-1 flex-row-reverse items-center justify-center rounded-2xl py-4 ${isPending ? 'opacity-50 bg-background-700' : 'bg-lime-500'}`}
            >
              <MaterialCommunityIcons
                name="notebook-plus-outline"
                size={20}
                color={colors.background[900]}
              />
              <Text className="mr-2 font-black text-sm text-background-900" numberOfLines={1}>
                שמור + יומן
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default AddNewFood;
