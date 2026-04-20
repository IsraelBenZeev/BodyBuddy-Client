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
    setQuantity((q) => Math.max(0.5, q + delta));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(portionAmount, getPortionUnit(foodItem));
  }, [portionAmount, foodItem, onSubmit]);

  return (
    <View className="flex-1 px-6 py-6 bg-background-900 ">
      {/* כותרת ושם המאכל */}
      <View className="mb-8">
        <Text className="typo-h1 text-white text-right mb-1">
          {isUnits ? `כמה ${unitLabel}?` : 'כמה גרם?'}
        </Text>
        <Text className="typo-h4 text-lime-400 text-right opacity-90">
          {foodItem.name}
        </Text>
      </View>

      {/* כרטיס בחירת כמות */}
      <View className="bg-background-800 rounded-3xl p-5 border border-white/5 mb-6 shadow-xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="typo-label text-gray-400 uppercase tracking-wider">
            {isUnits ? `כמות ${unitLabel}` : 'כמות (×100 גרם)'}
          </Text>
          <View className="bg-lime-500/10 px-3 py-1 rounded-full flex-row items-center">
            <Ionicons name="scale-outline" size={14} color="#84cc16" />
            <Text className="typo-caption-bold text-lime-500 mr-1">
              {isUnits ? `${quantity} ${unitLabel}` : `${portionAmount} גרם`}
            </Text>
          </View>
        </View>

        {/* Stepper מרכזי */}
        <View className="flex-row items-center justify-between bg-background-900/50 rounded-2xl p-2 border border-white/5">
          <Pressable
            onPress={() => handleQuantityChange(0.5)}
            className="w-14 h-14 items-center justify-center bg-lime-500 rounded-xl active:scale-95"
            accessibilityRole="button"
            accessibilityLabel={`הגדל כמות`}
          >
            <Ionicons name="add" size={28} color="#000" />
          </Pressable>

          <View className="items-center">
            <Text className="typo-h1 text-white">{quantity}</Text>
            <Text className="typo-caption-bold text-gray-500 uppercase">
              {isUnits ? unitLabel : 'מנות'}
            </Text>
          </View>

          <Pressable
            onPress={() => handleQuantityChange(-0.5)}
            className="w-14 h-14 items-center justify-center bg-background-700 rounded-xl active:scale-95"
            accessibilityRole="button"
            accessibilityLabel="הפחת כמות"
          >
            <Ionicons name="remove" size={28} color="#fff" />
          </Pressable>
        </View>

        {/* איפוס — רק עבור units */}
        {isUnits && (
          <View className="mt-3 flex-row gap-2">
            <Pressable
              onPress={() => setQuantity(1)}
              className="flex-1 bg-background-700 rounded-xl py-2 items-center border border-white/5"
              accessibilityRole="button"
              accessibilityLabel="איפוס כמות"
            >
              <Text className="typo-caption-bold text-gray-400">איפוס</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* כרטיס ערכים תזוניים */}
      <View className="bg-background-800 rounded-3xl p-6 border border-white/5 mb-8">
        <Text className="typo-caption-bold text-gray-400 uppercase tracking-widest text-center mb-5">
          {isUnits
            ? `ערכים תזוניים ל-${quantity} ${unitLabel}`
            : `ערכים תזוניים ל-${portionAmount} גרם`}
        </Text>

        <View className="flex-row items-center justify-around">
          {/* קלוריות */}
          <View className="items-center flex-1">
            <Text className="typo-caption-bold text-gray-500 uppercase mb-2">קלוריות</Text>
            <Text style={{ fontSize: 42, lineHeight: 46 }} className="font-black text-white">
              {calculatedMacros.calories}
            </Text>
            <Text className="typo-caption text-lime-400 mt-1">קק״ל</Text>
          </View>

          <View className="w-[1px] h-16 bg-white/10" />

          {/* חלבון */}
          <View className="items-center flex-1">
            <Text className="typo-caption-bold text-gray-500 uppercase mb-2">חלבון</Text>
            <Text style={{ fontSize: 42, lineHeight: 46 }} className="font-black text-lime-500">
              {calculatedMacros.protein}
            </Text>
            <Text className="typo-caption text-gray-500 mt-1">גרם</Text>
          </View>
        </View>
      </View>

      {/* כפתורי פעולה */}
      <View className="flex-row gap-4 mt-auto pb-4">
        <View className="flex-1">
          <Pressable
            onPress={onBack}
            className="bg-background-700 h-16 rounded-2xl items-center justify-center border border-white/5"
            accessibilityRole="button"
            accessibilityLabel="חזור"
          >
            <Text className="typo-btn-secondary text-gray-400">חזור</Text>
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
            <Text className="typo-btn-cta text-black">
              {isPending ? 'מעדכן...' : submitLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AddNewFoodSelection;
