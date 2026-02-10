import { colors } from '@/colors';
import HorizontalRuler from '@/src/Features/onboarding/HorizontalRuler';
import type { FoodItem } from '@/src/types/nutrition';
import ButtonPrimary from '@/src/ui/ButtonPrimary';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

interface Props {
  foodItem: FoodItem;
  onSubmit: (portion: number) => void;
  isPending: boolean;
  onBack: () => void;
}

const defaultPortion = (foodItem: FoodItem) =>
  foodItem.serving_weight != null && foodItem.serving_weight > 0 ? foodItem.serving_weight : 100;

const PortionSelector = ({ foodItem, onSubmit, isPending, onBack }: Props) => {
  const initialPortion = defaultPortion(foodItem);
  const { control, handleSubmit, watch, setValue } = useForm<{ portion_size: number }>({
    defaultValues: {
      portion_size: initialPortion,
    },
  });

  const portionSize = watch('portion_size');

  const calculatedMacros = useMemo(() => {
    const ratio = (portionSize || 0) / 100;
    return {
      protein: Math.round(foodItem.protein_per_100 * ratio * 10) / 10,
      carbs: Math.round(foodItem.carbs_per_100 * ratio * 10) / 10,
      fat: Math.round(foodItem.fat_per_100 * ratio * 10) / 10,
      calories: Math.round(foodItem.calories_per_100 * ratio * 10) / 10,
    };
  }, [portionSize, foodItem]);

  return (
    <View className="flex-1 px-5 py-4">
      <Text className="text-lime-400 text-2xl font-black mb-2 text-right">כמה אכלת?</Text>
      <View className="mb-6">
        <Text className="text-background-400 text-base text-right">{foodItem.name}</Text>
      </View>

      <View className="mb-6">
        <HorizontalRuler
          min={1}
          max={500}
          value={portionSize ?? initialPortion}
          onChange={(val) => setValue('portion_size', val)}
          unit="גרם"
        />
      </View>

      <View className="bg-background-800 border border-background-600 rounded-2xl p-4 mb-6">
        <Text className="text-white text-base font-bold mb-3 text-right">
          ערכים תזונתיים ל-{portionSize ?? initialPortion}g
        </Text>

        <View className="flex-row-reverse gap-4 mb-3">
          <View className="items-center flex-1">
            <Text className="text-lime-500 text-lg font-black">{calculatedMacros.protein}g</Text>
            <Text className="text-background-400 text-xs">חלבון</Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-orange-500 text-lg font-black">{calculatedMacros.carbs}g</Text>
            <Text className="text-background-400 text-xs">פחמימות</Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-red-500 text-lg font-black">{calculatedMacros.fat}g</Text>
            <Text className="text-background-400 text-xs">שומן</Text>
          </View>
        </View>

        <View className="items-center pt-3 border-t border-background-600">
          <Text className="text-white text-xl font-black">{calculatedMacros.calories}</Text>
          <Text className="text-background-400 text-xs">קלוריות</Text>
        </View>
      </View>

      {foodItem.serving_weight != null && foodItem.serving_weight > 0 && (
        <View className="flex-row-reverse items-center mb-6 gap-2 rounded-xl border border-lime-500/20 bg-lime-500/10 px-3 py-2.5">
          <Ionicons name="information-circle-outline" size={18} color={colors.lime[400]} />
          <Text className="text-lime-400/90 text-sm">
            מנה רגילה מכילה {foodItem.serving_weight} גרם
          </Text>
        </View>
      )}

      <View className="flex-row gap-3">
        <View className="flex-1">
          <ButtonPrimary
            title={isPending ? 'מוסיף...' : 'הוסף לי יומן'}
            onPress={handleSubmit((data) => onSubmit(data.portion_size))}
            classNameButton={isPending ? 'opacity-50' : ''}
          />
        </View>
        <View className="flex-1">
          <ButtonPrimary
            title="חזור"
            onPress={onBack}
            classNameButton="bg-background-700 border border-background-600"
            classNameText="text-background-400"
          />
        </View>
      </View>
    </View>
  );
};

export default PortionSelector;
