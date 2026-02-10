import { colors } from '@/colors';
import { useMealsWithItems } from '@/src/hooks/useNutrition';
import type { MealWithItems } from '@/src/types/meal';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import MealReviewModal from './MealReviewModal';

interface Props {
  userId: string;
  date: string;
  onClose: () => void;
}

export default function Meals({ userId, date, onClose }: Props) {
  const router = useRouter();
  const { data: meals = [], isLoading } = useMealsWithItems(userId);
  const [reviewMeal, setReviewMeal] = useState<MealWithItems | null>(null);

  const handleCreateFirstMeal = useCallback(() => {
    onClose();
    router.push('MealBuilder/create' as never);
  }, [onClose, router]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator color={colors.lime[500]} size="large" />
      </View>
    );
  }

  if (meals.length === 0) {
    return (
      <View className="flex-1 px-2 py-6">
        <Text className="text-lime-400 text-2xl font-black mb-2 text-right">
          הארוחות שלי
        </Text>
        <Text className="text-background-400 text-sm mb-6 text-right">
          צור ארוחות מוכנות כדי להוסיף אותן במהירות ליום
        </Text>
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons
            name="restaurant-outline"
            size={64}
            color={colors.background[400]}
          />
          <Text className="text-white text-lg font-bold text-center mt-4">
            עדיין אין לך ארוחות
          </Text>
          <Text className="text-background-400 text-center mt-2 mb-6">
            צור את הארוחה הראשונה שלך – תבחר מאכלים וכמויות ותשמור כארוחה
          </Text>
          <Pressable
            onPress={handleCreateFirstMeal}
            className="bg-lime-500 rounded-2xl py-4 px-8 flex-row-reverse items-center justify-center"
          >
            <Ionicons name="add-circle-outline" size={24} color={colors.background[900]} />
            <Text className="text-background-900 font-black text-base mr-2">
              צור את הארוחה הראשונה שלך
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

//   return (
//     <View className="flex-1 px-2 py-6">
//       <Text className="text-lime-400 text-2xl font-black mb-2 text-right">
//         הארוחות שלי
//       </Text>
//       <Text className="text-background-400 text-sm mb-4 text-right">
//         בחר ארוחה כדי להוסיף ליום
//       </Text>
//       <FlatList
//         data={meals}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         ItemSeparatorComponent={() => <View className="h-3" />}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         renderItem={({ item }) => (
//           <MealCard
//             meal={item}
//             onPress={() => setReviewMeal(item)}
//           />
//         )}
//       />
//       <MealReviewModal
//         visible={reviewMeal !== null}
//         meal={reviewMeal}
//         userId={userId}
//         date={date}
//         onClose={() => setReviewMeal(null)}
//         onSuccess={onClose}
//       />
//       <View className="absolute bottom-5 left-5 right-5">
//         <Pressable
//           onPress={handleCreateFirstMeal}
//           className="bg-background-700 border border-background-600 rounded-2xl py-3 flex-row-reverse items-center justify-center"
//         >
//           <Ionicons name="add" size={22} color={colors.lime[500]} />
//           <Text className="text-lime-500 font-bold text-base mr-2">
//             ארוחה חדשה
//           </Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// function MealCard({
//   meal,
//   onPress,
// }: {
//   meal: MealWithItems;
//   onPress: () => void;
// }) {
//   const totalCal = (meal.meal_items ?? []).reduce(
//     (sum, mi) =>
//       sum +
//       (mi.food_item
//         ? Math.round(
//             (mi.food_item.calories_per_100 * Number(mi.amount_g)) / 100
//           )
//         : 0),
//     0
//   );

//   return (
//     <Pressable
//       onPress={onPress}
//       className="bg-background-800 border border-background-600 rounded-2xl overflow-hidden"
//     >
//       <View className="flex-row-reverse items-center p-3.5">
//         <View className="bg-background-700 rounded-xl w-12 h-12 items-center justify-center mr-1">
//           <Ionicons name="restaurant" size={22} color={colors.orange[400]} />
//         </View>
//         <View className="flex-1 mr-3">
//           <Text className="text-white text-base font-bold text-right" numberOfLines={1}>
//             {meal.name_meal || 'ללא שם'}
//           </Text>
//           <Text className="text-background-400 text-xs text-right mt-0.5">
//             {totalCal} קק״ל · {(meal.meal_items ?? []).length} פריטים
//           </Text>
//         </View>
//         <Ionicons name="chevron-back" size={18} color={colors.background[500]} />
//       </View>
//     </Pressable>
//   );
return (
  <View className="flex-1 bg-background-900 px-5 pt-6">
    {/* Header */}
    <View className="mb-6">
      <Text className="text-white text-3xl font-black text-right mb-1">הארוחות שלי</Text>
      <Text className="text-gray-400 text-sm text-right font-medium">
        בחר ארוחה מוכנה כדי להוסיף ליום שלך
      </Text>
    </View>

    <FlatList
      data={meals}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="h-4" />}
      contentContainerStyle={{ paddingBottom: 140 }}
      renderItem={({ item }) => (
        <MealCard
          meal={item}
          onPress={() => setReviewMeal(item)}
        />
      )}
      ListEmptyComponent={() => (
        <View className="flex-1 items-center justify-center mt-20 px-10">
          <View className="bg-background-800 p-8 rounded-full mb-6">
            <Ionicons name="book-outline" size={60} color="#4b5563" />
          </View>
          <Text className="text-white text-xl font-bold text-center">אין ארוחות שמורות</Text>
          <Text className="text-gray-400 text-center mt-2">
            צור ארוחה חדשה והיא תופיע כאן לשימוש חוזר
          </Text>
        </View>
      )}
    />

    <MealReviewModal
      visible={reviewMeal !== null}
      meal={reviewMeal}
      userId={userId}
      date={date}
      onClose={() => setReviewMeal(null)}
      onSuccess={onClose}
    />

    {/* כפתור יצירת ארוחה - צף בתחתית */}
    <View className="absolute bottom-8 left-6 right-6 shadow-2xl">
      <Pressable
        onPress={handleCreateFirstMeal}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        className="bg-background-800 border border-lime-500/30 rounded-2xl h-16 flex-row-reverse items-center justify-center"
      >
        <Ionicons name="add-circle" size={24} color="#84cc16" />
        <Text className="text-lime-500 font-black text-base mr-2">
          צור ארוחה חדשה לשמירה
        </Text>
      </Pressable>
    </View>
  </View>
);
}

function MealCard({ meal, onPress }: { meal: MealWithItems; onPress: () => void }) {
  // חישוב קלוריות ומשקל כולל
  const stats = (meal.meal_items ?? []).reduce(
    (acc, mi) => {
      if (mi.food_item) {
        const cal = (mi.food_item.calories_per_100 * Number(mi.amount_g)) / 100;
        acc.calories += cal;
        acc.weight += Number(mi.amount_g);
      }
      return acc;
    },
    { calories: 0, weight: 0 }
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
      className="bg-background-800 border border-white/5 rounded-3xl overflow-hidden shadow-sm"
    >
      <View className="flex-row-reverse items-center p-4">
        {/* אייקון ארוחה מעוצב */}
        <View className="bg-lime-500/10 rounded-2xl w-14 h-14 items-center justify-center ml-4">
          <Ionicons name="restaurant" size={26} color="#84cc16" />
        </View>

        {/* פרטי הארוחה */}
        <View className="flex-1">
          <Text className="text-white text-lg font-bold text-right" numberOfLines={1}>
            {meal.name_meal || 'ארוחה ללא שם'}
          </Text>
          
          <View className="flex-row-reverse items-center mt-1">
            <Text className="text-orange-400 text-xs font-bold">
              {Math.round(stats.calories)} קק״ל
            </Text>
            <View className="w-1 h-1 rounded-full bg-gray-600 mx-2" />
            <Text className="text-gray-400 text-[10px]">
              {(meal.meal_items ?? []).length} מרכיבים
            </Text>
            <View className="w-1 h-1 rounded-full bg-gray-600 mx-2" />
            <Text className="text-gray-500 text-[10px]">
              {Math.round(stats.weight)}ג׳ סה״כ
            </Text>
          </View>
        </View>

        {/* חץ כניסה עדין */}
        <View className="bg-background-700 rounded-full p-1 mr-1">
          <Ionicons name="chevron-back" size={16} color="#9ca3af" />
        </View>
      </View>

      {/* תצוגה ויזואלית קטנה של המרכיבים (אופציונלי - מוסיף המון) */}
      <View className="bg-white/5 px-4 py-2 border-t border-white/5">
        <Text className="text-gray-500 text-[9px] text-right" numberOfLines={1}>
          כולל: {(meal.meal_items ?? []).map((i: any) => i.food_item?.name).join(', ')}
        </Text>
      </View>
    </Pressable>
  );
}
