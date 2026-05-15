import {
  calculateNutrients,
  getAmountLabel,
  getPortionUnit,
} from '@/src/Features/nutrition/utils/nutritionCalc';
import type { FoodItem } from '@/src/types/nutrition';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  foodItem: FoodItem;
  onSubmit: (amount: number, portionUnit: 'g' | 'unit') => void;
  isPending: boolean;
  onBack: () => void;
  submitLabel?: string;
}

const AddNewFoodSelection = ({
  foodItem,
  onSubmit,
  isPending,
  onBack,
  submitLabel = 'הוסף ליומן אכילה',
}: Props) => {
  const isUnits = foodItem.measurement_type === 'units';
  const unitLabel = getAmountLabel(foodItem);

  const [quantity, setQuantity] = useState(isUnits ? 1 : 100);

  const portionAmount = useMemo(() => quantity, [quantity]);

  const calculatedMacros = useMemo(
    () => calculateNutrients(foodItem, portionAmount),
    [foodItem, portionAmount]
  );

  const handleQuantityChange = useCallback(
    (delta: number) => {
      const min = isUnits ? 0.5 : 10;
      const step = isUnits ? 0.5 : 10;
      setQuantity((q) => Math.max(min, Math.round((q + delta * step) * 10) / 10));
    },
    [isUnits]
  );

  const handleSubmit = useCallback(() => {
    onSubmit(portionAmount, getPortionUnit(foodItem));
  }, [portionAmount, foodItem, onSubmit]);

  return (
    <View className="flex-1 px-6 pt-12 pb-6 bg-background-900">
      {/* Header Section with Back Button */}
      <View className="flex-row items-center  mb-10 gap-3">
        {/* כפתור חזרה בפינה הימנית */}
        <Pressable
          onPress={onBack}
          className="w-12 h-12 bg-background-800 rounded-2xl items-center justify-center border border-white/10 active:scale-90"
        >
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </Pressable>

        {/* כותרת מרכזית */}
        <View className="flex-1 ">
          {/* קיזוז כדי שהכותרת תהיה במרכז המסך */}
          <Text className="text-2xl font-black text-white">
            {isUnits ? `כמה ${unitLabel}?` : 'כמה גרם?'}
          </Text>
          <View className="bg-lime-500/10 px-3 py-0.5 rounded-lg mt-1 border border-lime-500/10">
            <Text className="text-lime-400 font-bold text-[12px]">{foodItem.name}</Text>
          </View>
        </View>
      </View>

      {/* Quantity Controller Card */}
      <View className="bg-background-800 rounded-[35px] p-8 border border-white/5 mb-6 shadow-2xl">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => handleQuantityChange(-1)}
            className="w-14 h-14 items-center justify-center bg-background-700 rounded-2xl border border-white/5 active:scale-90"
          >
            <Ionicons name="remove" size={28} color="#f87171" />
          </Pressable>

          <View className="items-center">
            <Text className="text-5xl font-black text-white leading-tight">{quantity}</Text>
            <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-[3px] mt-1">
              {isUnits ? unitLabel : 'גרם'}
            </Text>
          </View>

          <Pressable
            onPress={() => handleQuantityChange(1)}
            className="w-14 h-14 items-center justify-center bg-lime-500 rounded-2xl shadow-lg shadow-lime-500/20 active:scale-90"
          >
            <Ionicons name="add" size={28} color="#064e3b" />
          </Pressable>
        </View>

        <Pressable
          onPress={() => setQuantity(isUnits ? 1 : 100)}
          className="mt-6 self-center px-4 py-2 rounded-full bg-white/5 border border-white/5"
        >
          <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            איפוס ל-100
          </Text>
        </Pressable>
      </View>

      {/* Nutrition Summary */}
      <View className="bg-background-800 rounded-[32px] py-8 border border-white/5 mb-8 flex-row items-center justify-around">
        <View className="items-center">
          <Text className="text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-widest">
            קלוריות
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-4xl font-black text-white">{calculatedMacros.calories}</Text>
            <Text className="text-[10px] text-lime-400 ml-1.5 font-bold">kcal</Text>
          </View>
        </View>

        <View className="w-[1px] h-12 bg-white/10" />

        <View className="items-center">
          <Text className="text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-widest">
            חלבון
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-4xl font-black text-blue-400">{calculatedMacros.protein}</Text>
            <Text className="text-[10px] text-blue-400/60 ml-1.5 font-bold">g</Text>
          </View>
        </View>
      </View>

      {/* Submit Button Only */}
      <View className="mt-auto pb-4">
        <Pressable
          onPress={handleSubmit}
          disabled={isPending}
          className="bg-lime-500 h-16 rounded-3xl items-center justify-center shadow-xl shadow-lime-500/30 active:scale-95"
        >
          <Text className="text-[#064e3b] font-black text-lg">
            {isPending ? 'מעדכן...' : submitLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AddNewFoodSelection;
