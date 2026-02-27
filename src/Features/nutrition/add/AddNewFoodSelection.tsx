import type { FoodItem } from '@/src/types/nutrition';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  foodItem: FoodItem;
  onSubmit: (portionGrams: number) => void;
  isPending: boolean;
  onBack: () => void;
  /** טקסט כפתור האישור (ברירת מחדל: הוסף ליומן אכילה) */
  submitLabel?: string;
}

const defaultServingWeight = (foodItem: FoodItem) =>
  foodItem.serving_weight != null && foodItem.serving_weight > 0 ? foodItem.serving_weight : 100;

const AddNewFoodSelection = ({ foodItem, onSubmit, isPending, onBack, submitLabel = 'הוסף ליומן אכילה' }: Props) => {
  const servingWeight = defaultServingWeight(foodItem);
  const [quantity, setQuantity] = useState(1);

  const portionGrams = useMemo(() => quantity * servingWeight, [quantity, servingWeight]);

  const calculatedMacros = useMemo(() => {
    const ratio = portionGrams / 100;
    return {
      protein: Math.round(foodItem.protein_per_100 * ratio * 10) / 10,
      carbs: Math.round(foodItem.carbs_per_100 * ratio * 10) / 10,
      fat: Math.round(foodItem.fat_per_100 * ratio * 10) / 10,
      calories: Math.round(foodItem.calories_per_100 * ratio * 10) / 10,
    };
  }, [portionGrams, foodItem]);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((q) => Math.max(1, q + delta));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(portionGrams);
  }, [portionGrams, onSubmit]);

  return (
    <View className="flex-1 px-6 py-6 bg-background-900 bd">
      {/* כותרת ושם המאכל */}
      <View className="mb-8">
        <Text className="text-white text-3xl font-black text-right mb-1">כמה אכלת?</Text>
        <Text className="text-lime-400 text-lg text-right font-medium opacity-90">
          {foodItem.name}
        </Text>
      </View>

      {/* כרטיס בחירת כמות */}
      <View className="bg-background-800 rounded-3xl p-5 border border-white/5 mb-6 shadow-xl">
        <View className="flex-row-reverse justify-between items-center mb-4">
          <Text className="text-gray-400 text-sm font-bold uppercase tracking-wider">
            כמות מנות
          </Text>
          {foodItem.serving_weight != null && foodItem.serving_weight > 0 && (
            <View className="bg-lime-500/10 px-3 py-1 rounded-full flex-row-reverse items-center">
              <Ionicons name="scale-outline" size={14} color="#84cc16" />
              <Text className="text-lime-500 text-[11px] font-bold mr-1">
                מנה = {foodItem.serving_weight}ג׳
              </Text>
            </View>
          )}
        </View>

        {/* Stepper מרכזי */}
        <View className="flex-row-reverse items-center justify-between bg-background-900/50 rounded-2xl p-2 border border-white/5">
          <Pressable
            onPress={() => handleQuantityChange(1)}
            className="w-14 h-14 items-center justify-center bg-lime-500 rounded-xl active:scale-95 transition-transform"
          >
            <Ionicons name="add" size={28} color="#000" />
          </Pressable>

          <View className="items-center">
            <Text className="text-white font-black text-4xl">{quantity}</Text>
            <Text className="text-gray-500 text-[10px] font-bold uppercase">מנות נבחרו</Text>
          </View>

          <Pressable
            onPress={() => handleQuantityChange(-1)}
            className="w-14 h-14 items-center justify-center bg-background-700 rounded-xl active:scale-95"
          >
            <Ionicons name="remove" size={28} color="#fff" />
          </Pressable>
        </View>

        {/* חישוב גרמים תחתון */}
        <View className="mt-4 items-center">
          <View className="flex-row-reverse items-center bg-background-700/50 px-4 py-2 rounded-full">
            <Text className="text-gray-300 text-sm font-medium">סה״כ:</Text>
            <Text className="text-white font-black text-sm mx-1.5">{portionGrams} גרם</Text>
            <Text className="text-gray-500 text-[10px] mr-1">
              ({quantity} × {servingWeight}ג׳)
            </Text>
          </View>
        </View>
      </View>

      {/* כרטיס ערכים תזוניים - "התוצאה" */}
      <View className="bg-background-800 rounded-3xl p-6 border border-white/5 mb-8">
        <Text className="text-gray-400 text-[11px] font-bold uppercase tracking-widest text-center mb-5">
          ערכים תזוניים ל-{portionGrams} גרם
        </Text>

        <View className="flex-row-reverse justify-around items-end mb-6">
          <View className="items-center">
            <Text className="text-lime-500 text-2xl font-black">{calculatedMacros.protein}g</Text>
            <Text className="text-gray-500 text-[10px] mt-1">חלבון</Text>
          </View>
          <View className="w-[1px] h-8 bg-white/5" />
          <View className="items-center">
            <Text className="text-orange-500 text-2xl font-black">{calculatedMacros.carbs}g</Text>
            <Text className="text-gray-500 text-[10px] mt-1">פחמימות</Text>
          </View>
          <View className="w-[1px] h-8 bg-white/5" />
          <View className="items-center">
            <Text className="text-red-500 text-2xl font-black">{calculatedMacros.fat}g</Text>
            <Text className="text-gray-500 text-[10px] mt-1">שומן</Text>
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
