import { colors } from '@/colors';
import { useDeleteMeal, useMealsWithItems } from '@/src/hooks/useNutrition';
import type { MealWithItems } from '@/src/types/meal';
import DeleteConfirmModal from '@/src/ui/DeleteConfirmModal';
import EmptyState from '@/src/ui/EmptyState';
import ScreenHeader from '@/src/ui/ScreenHeader';
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
  const [mealToDelete, setMealToDelete] = useState<MealWithItems | null>(null);
  const { mutate: deleteMeal, isPending: isDeletingMeal } = useDeleteMeal(userId);

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
      <EmptyState
        icon={<Ionicons name="restaurant-outline" size={64} color={colors.background[400]} />}
        title="עדיין אין לך ארוחות"
        description="צור את הארוחה הראשונה שלך – תבחר מאכלים וכמויות ותשמור כארוחה"
        action={{
          label: "צור את הארוחה הראשונה שלך",
          onPress: handleCreateFirstMeal,
          icon: <Ionicons name="add-circle-outline" size={24} color={colors.background[900]} />,
        }}
      />
    );
  }

return (
  <View className="flex-1 bg-background-900 px-5 pt-6">
    <ScreenHeader title="הארוחות שלי" subtitle="בחר ארוחה מוכנה כדי להוסיף ליום שלך" />

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
          onDelete={() => setMealToDelete(item)}
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
        accessibilityRole="button"
        accessibilityLabel="צור ארוחה חדשה לשמירה"
      >
        <Ionicons name="add-circle" size={24} color="#84cc16" />
        <Text className="text-lime-500 font-black text-base mr-2">
          צור ארוחה חדשה לשמירה
        </Text>
      </Pressable>
    </View>

    <DeleteConfirmModal
      visible={mealToDelete !== null}
      title="מחיקת ארוחה"
      message={`האם למחוק את "${mealToDelete?.name_meal}" מהרשימה?`}
      infoNote="מחיקת ארוחה מהרשימה שלך לא תשפיע על הרשומות שכבר קיימות ביומן התזונה"
      isDeleting={isDeletingMeal}
      onCancel={() => setMealToDelete(null)}
      onConfirm={() => {
        if (!mealToDelete) return;
        const id = mealToDelete.id;
        setMealToDelete(null);
        deleteMeal(id);
      }}
    />
  </View>
);
}

function MealCard({
  meal,
  onPress,
  onDelete,
}: {
  meal: MealWithItems;
  onPress: () => void;
  onDelete: () => void;
}) {
  // חישוב קלוריות ומשקל כולל
  const stats = (meal.meal_items ?? []).reduce(
    (acc, mi) => {
      if (mi.food_item) {
        const cal = ((mi.food_item.calories_per_100 ?? 0) * Number(mi.amount_g)) / 100;
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
      accessibilityRole="button"
      accessibilityLabel={`${meal.name_meal || 'ארוחה'} - בחר ארוחה`}
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

        {/* כפתורי פעולה */}
        <View className="flex-row items-center mr-1">
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            hitSlop={8}
            className="bg-red-500/10 rounded-xl p-2 ml-2"
            accessibilityRole="button"
            accessibilityLabel={`מחק ${meal.name_meal || 'ארוחה'}`}
          >
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
          </Pressable>
          <View className="bg-background-700 rounded-full p-1">
            <Ionicons name="chevron-back" size={16} color="#9ca3af" />
          </View>
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
