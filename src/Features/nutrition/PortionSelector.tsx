import { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import FormInput from '@/src/ui/FormInput';
import ButtonPrimary from '@/src/ui/ButtonPrimary';
import { colors } from '@/colors';
import type { FoodItem } from '@/src/types/nutrition';

interface Props {
  foodItem: FoodItem;
  onSubmit: (portion: number) => void;
  isPending: boolean;
  onBack: () => void;
}

const PortionSelector = ({ foodItem, onSubmit, isPending, onBack }: Props) => {
  const { control, handleSubmit, watch } = useForm<{ portion_size: number }>({
    defaultValues: {
      portion_size: 100,
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
      <Text className="text-lime-400 text-2xl font-black mb-2 text-right">
        כמה אכלת?
      </Text>
      <Text className="text-background-400 text-base mb-6 text-right">
        {foodItem.name}
      </Text>

      <FormInput
        control={control}
        name="portion_size"
        label="כמות (גרם)"
        placeholder="100"
        keyboardType="numeric"
        rules={{
          required: 'יש להזין כמות',
          min: { value: 1, message: 'כמות מינימלית: 1' },
        }}
        containerStyle={{ marginBottom: 24 }}
        inputStyle={{
          backgroundColor: colors.background[800],
          borderWidth: 1,
          borderColor: colors.lime[500] + '40',
          borderRadius: 12,
          padding: 12,
          color: colors.white,
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 'bold',
        }}
        labelStyle={{
          color: colors.background[400],
          fontSize: 14,
          marginBottom: 8,
          textAlign: 'right',
        }}
        isPendingCreate={isPending}
      />

      <View className="bg-background-800 border border-background-600 rounded-2xl p-4 mb-6">
        <Text className="text-white text-base font-bold mb-3 text-right">
          ערכים תזונתיים ל-{portionSize || 0}g
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

      <View className="flex-row gap-3">
        <View className="flex-1">
          <ButtonPrimary
            title="חזור"
            onPress={onBack}
            classNameButton="bg-background-700 border border-background-600"
            classNameText="text-background-400"
          />
        </View>
        <View className="flex-1">
          <ButtonPrimary
            title={isPending ? 'מוסיף...' : 'הוסף לי יומן'}
            onPress={handleSubmit((data) => onSubmit(data.portion_size))}
            classNameButton={isPending ? 'opacity-50' : ''}
          />
        </View>
      </View>
    </View>
  );
};

export default PortionSelector;
