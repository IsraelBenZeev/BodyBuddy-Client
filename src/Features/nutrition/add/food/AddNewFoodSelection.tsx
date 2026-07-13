import {
  calculateNutrients,
  getAmountLabel,
  getPortionUnit,
} from '@/src/Features/nutrition/utils/nutritionCalc';
import type { FoodItem } from '@/src/types/nutrition';
import ActionButton from '@/src/ui/ActionButton';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { bottom } = useSafeAreaInsets();
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
    <View className="flex-1 px-4 w-full mt-10">
      {/* Header Section with Back Button */}
      <View className="flex-row items-center mb-6 justify-center">
             {/* כפתור חזרה בצד ימין */}
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="חזרה לרשימה"
          className="absolute left-4 w-11 h-11 bg-background-700 rounded-xl items-center justify-center border border-background-600 active:scale-95"
        >
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </Pressable>
        {/* spacer שמאל — שומר על איזון כדי שהכותרת תהיה באמצע */}
        {/* <View className="w-11" /> */}

        {/* כותרת מרכזית */}
        <View className="items-center">
          <View className="bg-lime-400/10 px-3 py-1 rounded-full mb-2">
            <Text className="text-lime-400 text-lg font-bold uppercase tracking-[2px]">
              בחר כמות
            </Text>
          </View>
          <Text className="text-white text-3xl font-light tracking-tight text-center">
            {foodItem.name}
          </Text>
          <View className="h-[2px] w-8 bg-lime-400 mt-3 rounded-full" />
        </View>

   
      </View>

      {/* Quantity Controller Card */}
      <View className="bg-white/[0.03] rounded-3xl p-6 border border-white/[0.05] mb-4">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => handleQuantityChange(-1)}
            className="w-14 h-14 items-center justify-center bg-background-700 rounded-xl border border-background-600 active:scale-95"
            accessibilityRole="button"
            accessibilityLabel="הקטן כמות"
          >
            <Ionicons name="remove" size={24} color="#fff" />
          </Pressable>

          <View className="items-center flex-1">
            <Text className="text-4xl font-bold text-white tracking-tight">{quantity}</Text>
            <Text className="typo-label text-background-400 mt-1">
              {isUnits ? unitLabel : 'גרם'}
            </Text>
          </View>

          <Pressable
            onPress={() => handleQuantityChange(1)}
            className="w-14 h-14 items-center justify-center bg-lime-500 rounded-xl active:scale-95"
            accessibilityRole="button"
            accessibilityLabel="הגדל כמות"
          >
            <Ionicons name="add" size={24} color="#000" />
          </Pressable>
        </View>

        <Pressable
          onPress={() => setQuantity(isUnits ? 1 : 100)}
          className="mt-4 self-center px-4 py-2 rounded-xl bg-background-700 border border-background-600 active:scale-95"
          accessibilityRole="button"
          accessibilityLabel="איפוס כמות"
          disabled={quantity === (isUnits ? 1 : 100)}
        >
          <Text className="typo-caption-bold text-background-300">
            {isUnits ? 'איפוס ל-1 יח׳' : 'איפוס ל-100 גרם'}
          </Text>
        </Pressable>
      </View>

      {/* Nutrition Summary */}
      <View className="bg-white/[0.03] rounded-3xl p-5 border border-white/[0.05] mb-4">
        <View className="bg-lime-500/10 border border-lime-500/20 rounded-2xl p-3 mb-3 items-center">
          <Text className="typo-caption text-lime-400 mb-0.5">קלוריות</Text>
          <View className="flex-row items-baseline gap-1.5">
            <Text className="text-4xl font-black text-white">{calculatedMacros.calories}</Text>
            <Text className="typo-body-primary text-lime-400 font-bold">קק״ל</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1 bg-blue-500/[0.06] border border-blue-500/20 rounded-2xl p-3 items-center">
            <Text className="typo-caption text-blue-400 mb-0.5">חלבון</Text>
            <Text className="typo-h4 text-white">{calculatedMacros.protein}</Text>
            <Text className="typo-caption text-background-500">גרם</Text>
          </View>
          <View className="flex-1 bg-amber-500/[0.06] border border-amber-500/20 rounded-2xl p-3 items-center">
            <Text className="typo-caption text-amber-400 mb-0.5">פחמימות</Text>
            <Text className="typo-h4 text-white">{calculatedMacros.carbs}</Text>
            <Text className="typo-caption text-background-500">גרם</Text>
          </View>
          <View className="flex-1 bg-red-500/[0.06] border border-red-500/20 rounded-2xl p-3 items-center">
            <Text className="typo-caption text-red-400 mb-0.5">שומן</Text>
            <Text className="typo-h4 text-white">{calculatedMacros.fat}</Text>
            <Text className="typo-caption text-background-500">גרם</Text>
          </View>
        </View>
      </View>

      {/* Submit Button Only */}
      <View className="mt-auto" style={{ paddingBottom: bottom + 16 }}>
        <ActionButton
          onPress={handleSubmit}
          label={isPending ? 'מעדכן...' : submitLabel}
          iconName={isPending ? 'hourglass-outline' : 'add'}
          disabled={isPending}
          fullWidth
        />
      </View>
    </View>
  );
};

export default AddNewFoodSelection;
