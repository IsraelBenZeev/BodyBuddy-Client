import { colors } from '@/colors';
import HorizontalRuler from '@/src/Features/onboarding/HorizontalRuler';
import {
  FOOD_CATEGORIES,
  getCategoryById,
  type FoodCategoryId,
} from '@/src/Features/nutrition/foodCategories';
import type { SliderEntryFormData } from '@/src/types/nutrition';
import FormInput from '@/src/ui/FormInput';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';

interface Props {
  onSubmit: (data: SliderEntryFormData) => void;
  isPending: boolean;
  onBack: () => void;
}

const ManualEntryWithSliders = ({ onSubmit, isPending, onBack }: Props) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<FoodCategoryId | null>(null);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [servingWeight, setServingWeight] = useState(100);
  const [portionSize, setPortionSize] = useState(100);

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

  const portionCalories = useMemo(() => {
    const ratio = (portionSize || 0) / 100;
    return Math.round(calculatedCalories * ratio * 10) / 10;
  }, [calculatedCalories, portionSize]);

  const handleFormSubmit = (formData: { food_name: string }) => {
    onSubmit({
      food_name: formData.food_name,
      category: selectedCategoryId ?? undefined,
      serving_weight: servingWeight,
      protein_per_100: protein,
      carbs_per_100: carbs,
      fat_per_100: fat,
      portion_size: portionSize,
      portion_unit: 'g',
    });
  };

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
          <Text className="text-background-400 text-sm mb-3 text-right">כמה אכלת?</Text>
          <HorizontalRuler
            min={10}
            max={500}
            value={portionSize}
            onChange={setPortionSize}
            unit="גרם"
          />
        </View>

        <View className="bg-lime-500/10 border border-lime-500/30 rounded-2xl p-4 mb-6">
          <Text className="text-lime-400 text-center font-bold">
            תוסיף ליומן: {portionCalories} קק״ל
          </Text>
        </View>

        <View className="h-24" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 flex-row-reverse gap-3 px-5 pb-10 pt-4 bg-background-900/95 border-t border-background-700">
        <View className="flex-1">
          <Pressable
            onPress={onBack}
            className="bg-background-700 border border-background-600 rounded-2xl py-4 flex-row items-center justify-center"
          >
            <Text className="text-background-400 font-bold text-base mr-2">חזור</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.background[400]} />
          </Pressable>
        </View>
        <View className="flex-1">
          <Pressable
            onPress={handleSubmit(handleFormSubmit)}
            disabled={isPending}
            className={`bg-lime-500 rounded-2xl py-4 flex-row items-center justify-center ${isPending ? 'opacity-50' : ''}`}
          >
            <Ionicons name="checkmark-circle" size={20} color={colors.background[900]} />
            <Text className="text-background-900 font-black text-base mr-2">
              {isPending ? 'שומר...' : 'שמור והוסף'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ManualEntryWithSliders;
