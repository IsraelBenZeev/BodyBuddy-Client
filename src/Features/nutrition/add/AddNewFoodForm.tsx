import { colors } from '@/colors';
import {
  FOOD_CATEGORIES,
  getCategoryById,
  type FoodCategoryId,
} from '@/src/Features/nutrition/add/foodCategories';
import HorizontalRuler from '@/src/Features/onboarding/HorizontalRuler';
import type { SliderEntryFormData } from '@/src/types/nutrition';
import FormInput from '@/src/ui/FormInput';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';

interface Props {
  /** addToJournal: true = שמירה לרשימה + הוספה ליומן, false = שמירה לרשימה בלבד */
  onSubmit: (data: SliderEntryFormData, addToJournal: boolean) => void;
  isPending: boolean;
  onBack: () => void;
}

const AddNewFood = ({ onSubmit, isPending, onBack }: Props) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<FoodCategoryId | null>(null);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [servingWeight, setServingWeight] = useState(100);
  const [quantity, setQuantity] = useState(1);

  const toggleCategory = useCallback((id: FoodCategoryId) => {
    setSelectedCategoryId((prev) => (prev === id ? null : id));
  }, []);

  const { control, handleSubmit } = useForm<{ food_name: string }>({
    defaultValues: {
      food_name: '',
    },
  });

  const calculatedCalories = useMemo(() => {
    return Math.round((protein * 4 + carbs * 4 + fat * 9) * 10) / 10;
  }, [protein, carbs, fat]);

  const portionGrams = quantity * servingWeight;
  const portionCalories = useMemo(() => {
    const ratio = portionGrams / 100;
    return Math.round(calculatedCalories * ratio * 10) / 10;
  }, [calculatedCalories, portionGrams]);

  const buildSubmitData = useCallback(
    (formData: { food_name: string }): SliderEntryFormData => ({
      food_name: formData.food_name,
      category: selectedCategoryId ?? undefined,
      serving_weight: servingWeight,
      protein_per_100: protein,
      carbs_per_100: carbs,
      fat_per_100: fat,
      portion_size: portionGrams,
      portion_unit: 'g',
    }),
    [selectedCategoryId, servingWeight, protein, carbs, fat, portionGrams]
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
        <Text className="text-lime-400 text-2xl font-black mb-2 text-right">הוספת מזון חדש</Text>
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
          contentContainerStyle={{ flexDirection: 'row-reverse', gap: 10, paddingHorizontal: 2, paddingVertical: 4 }}
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
                <Ionicons
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
              <Ionicons
                name={getCategoryById(selectedCategoryId)?.icon ?? 'nutrition-outline'}
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
          <View className="flex-row-reverse items-center justify-between">
            <Text className="text-background-400 text-sm">קלוריות (חישוב אוטומטי)</Text>
            <Text className="text-white text-xl font-black">{calculatedCalories}</Text>
          </View>
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
              <Ionicons name="add" size={24} color={colors.lime[500]} />
            </Pressable>
            <Text className="text-white font-black text-2xl min-w-[48px] text-center mx-4">
              {quantity}
            </Text>
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-12 h-12 items-center justify-center bg-background-700 rounded-xl active:bg-background-600"
            >
              <Ionicons name="remove" size={24} color={colors.white} />
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

        <View className="h-24" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 gap-3 px-5 pb-10 pt-4 bg-background-900/95 border-t border-background-700">
        <View className="flex-col gap-3">
          <Pressable
            onPress={onBack}
            className="min-w-0 flex-1 flex-row items-center justify-center rounded-2xl border border-background-600 bg-background-700 py-4"
          >
            <Text className="text-background-400 font-bold text-base mr-2" numberOfLines={1}>חזור</Text>
            <View style={{ flexShrink: 0 }}>
              <Ionicons name="arrow-forward" size={20} color={colors.background[400]} />
            </View>
          </Pressable>
          <Pressable
            onPress={handleSubmit((formData) => handleFormSubmit(formData, false))}
            disabled={isPending}
            className={`min-w-0 flex-1 flex-row-reverse items-center justify-center rounded-2xl border border-white/10 py-4 ${isPending ? 'bg-background-700 opacity-50' : 'bg-background-800'}`}
          >
            <Text className="text-white font-black text-base mr-2 shrink min-w-0" numberOfLines={1}>שמור לרשימה בלבד</Text>
            <View style={{ flexShrink: 0 }}>
              <Ionicons name="list" size={20} color={colors.white} />
            </View>
          </Pressable>
          <Pressable
            onPress={handleSubmit((formData) => handleFormSubmit(formData, true))}
            disabled={isPending}
            className={`min-w-0 flex-1 flex-row-reverse items-center justify-center rounded-2xl py-4 ${isPending ? 'opacity-50 bg-background-700' : 'bg-lime-500'}`}
          >
            <Text className="mr-2 min-w-0 shrink font-black text-base text-background-900" numberOfLines={1}>שמור לרשימה וליומן</Text>
            <View style={{ flexShrink: 0 }}>
              <Ionicons name="checkmark-circle" size={20} color={colors.background[900]} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AddNewFood;
