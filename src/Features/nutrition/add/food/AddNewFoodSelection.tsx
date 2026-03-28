import { calculateNutrients, getAmountLabel, getPortionUnit } from '@/src/Features/nutrition/utils/nutritionCalc';
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

const AddNewFoodSelection = ({ foodItem, onSubmit, isPending, onBack, submitLabel = 'הוסף ליומן אכילה' }: Props) => {
  const isUnits = foodItem.measurement_type === 'units';
  const unitLabel = getAmountLabel(foodItem);

  // עבור grams: ברירת מחדל 100g. עבור units: ברירת מחדל 1
  const [quantity, setQuantity] = useState(isUnits ? 1 : 1);

  // אם grams, כל "מנה" = 100g. משתמש בוחר quantity
  const portionAmount = useMemo(() => {
    if (isUnits) return quantity;
    return quantity * 100;
  }, [isUnits, quantity]);

  const calculatedMacros = useMemo(
    () => calculateNutrients(foodItem, portionAmount),
    [foodItem, portionAmount]
  );

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((q) => Math.max(1, q + delta));
  }, []);

  const handleHalfUnit = useCallback(() => {
    setQuantity((q) => Math.max(0.5, q - 0.5));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(portionAmount, getPortionUnit(foodItem));
  }, [portionAmount, foodItem, onSubmit]);

  return (
    <View className="flex-1 px-6 py-6 bg-background-900 ">
      {/* כותרת ושם המאכל */}
      <View className="mb-8">
        <Text className="text-white text-3xl font-black text-right mb-1">
          {isUnits ? `כמה ${unitLabel}?` : 'כמה גרם?'}
        </Text>
        <Text className="text-lime-400 text-lg text-right font-medium opacity-90">
          {foodItem.name}
        </Text>
      </View>

      {/* כרטיס בחירת כמות */}
      <View className="bg-background-800 rounded-3xl p-5 border border-white/5 mb-6 shadow-xl">
        <View className="flex-row-reverse justify-between items-center mb-4">
          <Text className="text-gray-400 text-sm font-bold uppercase tracking-wider">
            {isUnits ? `כמות ${unitLabel}` : 'כמות (×100 גרם)'}
          </Text>
          <View className="bg-lime-500/10 px-3 py-1 rounded-full flex-row-reverse items-center">
            <Ionicons name="scale-outline" size={14} color="#84cc16" />
            <Text className="text-lime-500 text-xs font-bold mr-1">
              {isUnits ? `${quantity} ${unitLabel}` : `${portionAmount} גרם`}
            </Text>
          </View>
        </View>

        {/* Stepper מרכזי */}
        <View className="flex-row-reverse items-center justify-between bg-background-900/50 rounded-2xl p-2 border border-white/5">
          <Pressable
            onPress={() => handleQuantityChange(1)}
            className="w-14 h-14 items-center justify-center bg-lime-500 rounded-xl active:scale-95"
            accessibilityRole="button"
            accessibilityLabel={`הגדל כמות`}
          >
            <Ionicons name="add" size={28} color="#000" />
          </Pressable>

          <View className="items-center">
            <Text className="text-white font-black text-4xl">{quantity}</Text>
            <Text className="text-gray-500 text-xs font-bold uppercase">
              {isUnits ? unitLabel : 'מנות'}
            </Text>
          </View>

          <Pressable
            onPress={() => handleQuantityChange(-1)}
            className="w-14 h-14 items-center justify-center bg-background-700 rounded-xl active:scale-95"
            accessibilityRole="button"
            accessibilityLabel="הפחת כמות"
          >
            <Ionicons name="remove" size={28} color="#fff" />
          </Pressable>
        </View>

        {/* חצי יחידה — רק עבור units */}
        {isUnits && (
          <View className="mt-3 flex-row-reverse gap-2">
            <Pressable
              onPress={handleHalfUnit}
              className="flex-1 bg-background-700 rounded-xl py-2 items-center border border-white/5"
              accessibilityRole="button"
              accessibilityLabel={`חצי ${unitLabel}`}
            >
              <Text className="text-gray-400 text-xs font-bold">½ {unitLabel}</Text>
            </Pressable>
            <Pressable
              onPress={() => setQuantity(1)}
              className="flex-1 bg-background-700 rounded-xl py-2 items-center border border-white/5"
              accessibilityRole="button"
              accessibilityLabel="איפוס כמות"
            >
              <Text className="text-gray-400 text-xs font-bold">איפוס</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* כרטיס ערכים תזוניים */}
      <View className="bg-background-800 rounded-3xl p-6 border border-white/5 mb-8">
        <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest text-center mb-5">
          {isUnits
            ? `ערכים תזוניים ל-${quantity} ${unitLabel}`
            : `ערכים תזוניים ל-${portionAmount} גרם`}
        </Text>

        <View className="flex-row-reverse justify-around items-end mb-6">
          <View className="items-center">
            <Text className="text-lime-500 text-2xl font-black">{calculatedMacros.protein}g</Text>
            <Text className="text-gray-500 text-xs mt-1">חלבון</Text>
          </View>
          <View className="w-[1px] h-8 bg-white/5" />
          <View className="items-center">
            <Text className="text-orange-500 text-2xl font-black">{calculatedMacros.carbs}g</Text>
            <Text className="text-gray-500 text-xs mt-1">פחמימות</Text>
          </View>
          <View className="w-[1px] h-8 bg-white/5" />
          <View className="items-center">
            <Text className="text-red-500 text-2xl font-black">{calculatedMacros.fat}g</Text>
            <Text className="text-gray-500 text-xs mt-1">שומן</Text>
          </View>
        </View>

        <View className="pt-5 border-t border-white/5 items-center">
          <View className="flex-row-reverse items-baseline">
            <Text className="text-white text-4xl font-black">{calculatedMacros.calories}</Text>
            <Text className="text-lime-400 text-sm font-bold mr-2">קק״ל</Text>
          </View>
        </View>
      </View>

      {/* כפתורי פעולה */}
      <View className="flex-row-reverse gap-4 mt-auto pb-4">
        <View className="flex-1">
          <Pressable
            onPress={onBack}
            className="bg-background-700 h-16 rounded-2xl items-center justify-center border border-white/5"
            accessibilityRole="button"
            accessibilityLabel="חזור"
          >
            <Text className="text-gray-400 font-bold">חזור</Text>
          </Pressable>
        </View>
        <View className="flex-[2]">
          <Pressable
            onPress={handleSubmit}
            disabled={isPending}
            style={({ pressed }) => [{ opacity: pressed || isPending ? 0.8 : 1 }]}
            className="bg-lime-500 h-16 rounded-2xl items-center justify-center shadow-lg shadow-lime-500/20"
            accessibilityRole="button"
            accessibilityLabel={submitLabel}
          >
            <Text className="text-black text-lg font-black">
              {isPending ? 'מעדכן...' : submitLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AddNewFoodSelection;
