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

  return (
    <View className="flex-1 px-2 py-6">
      <Text className="text-lime-400 text-2xl font-black mb-2 text-right">
        הארוחות שלי
      </Text>
      <Text className="text-background-400 text-sm mb-4 text-right">
        בחר ארוחה כדי להוסיף ליום
      </Text>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-3" />}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            onPress={() => setReviewMeal(item)}
          />
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
      <View className="absolute bottom-5 left-5 right-5">
        <Pressable
          onPress={handleCreateFirstMeal}
          className="bg-background-700 border border-background-600 rounded-2xl py-3 flex-row-reverse items-center justify-center"
        >
          <Ionicons name="add" size={22} color={colors.lime[500]} />
          <Text className="text-lime-500 font-bold text-base mr-2">
            ארוחה חדשה
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function MealCard({
  meal,
  onPress,
}: {
  meal: MealWithItems;
  onPress: () => void;
}) {
  const totalCal = (meal.meal_items ?? []).reduce(
    (sum, mi) =>
      sum +
      (mi.food_item
        ? Math.round(
            (mi.food_item.calories_per_100 * Number(mi.amount_g)) / 100
          )
        : 0),
    0
  );

  return (
    <Pressable
      onPress={onPress}
      className="bg-background-800 border border-background-600 rounded-2xl overflow-hidden"
    >
      <View className="flex-row-reverse items-center p-3.5">
        <View className="bg-background-700 rounded-xl w-12 h-12 items-center justify-center mr-1">
          <Ionicons name="restaurant" size={22} color={colors.orange[400]} />
        </View>
        <View className="flex-1 mr-3">
          <Text className="text-white text-base font-bold text-right" numberOfLines={1}>
            {meal.name_meal || 'ללא שם'}
          </Text>
          <Text className="text-background-400 text-xs text-right mt-0.5">
            {totalCal} קק״ל · {(meal.meal_items ?? []).length} פריטים
          </Text>
        </View>
        <Ionicons name="chevron-back" size={18} color={colors.background[500]} />
      </View>
    </Pressable>
  );
}
