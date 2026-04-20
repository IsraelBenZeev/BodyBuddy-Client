import { colors } from '@/colors';
import { calculateNutrients } from '@/src/Features/nutrition/utils/nutritionCalc';
import { useDeleteMeal, useMealsWithItems } from '@/src/hooks/useNutrition';
import type { MealWithItems } from '@/src/types/meal';
import DeleteConfirmModal from '@/src/ui/DeleteConfirmModal';
import EmptyState from '@/src/ui/EmptyState';
import ScreenHeader from '@/src/ui/ScreenHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
    router.push('/MealBuilder/create');
  }, [onClose, router]);

  const handleCloseReview = useCallback(() => setReviewMeal(null), []);
  const handleCancelDelete = useCallback(() => setMealToDelete(null), []);
  const handleConfirmDelete = useCallback(() => {
    if (!mealToDelete) return;
    const id = mealToDelete.id;
    setMealToDelete(null);
    deleteMeal(id);
  }, [mealToDelete, deleteMeal]);

  const renderItem = useCallback(({ item }: { item: MealWithItems }) => (
    <MealCard
      meal={item}
      onPress={() => setReviewMeal(item)}
      onDelete={() => setMealToDelete(item)}
    />
  ), []);

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
      renderItem={renderItem}
      initialNumToRender={6}
      maxToRenderPerBatch={4}
      removeClippedSubviews={true}
      ListEmptyComponent={() => (
        <View className="flex-1 items-center justify-center mt-20 px-10">
          <View className="bg-background-800 p-8 rounded-full mb-6">
            <Ionicons name="book-outline" size={60} color="#4b5563" />
          </View>
          <Text className="typo-h3 text-white text-center">אין ארוחות שמורות</Text>
          <Text className="typo-body text-gray-400 text-center mt-2">
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
      onClose={handleCloseReview}
      onSuccess={onClose}
    />

    {/* כפתור יצירת ארוחה - צף בתחתית */}
    <View className="absolute bottom-8 left-6 right-6 shadow-2xl">
      <Pressable
        onPress={handleCreateFirstMeal}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        className="bg-background-800 border border-lime-500/30 rounded-2xl py-4 flex-col items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel="צור ארוחה חדשה לשמירה"
      >
        <Ionicons name="add-circle" size={28} color="#84cc16" />
        <Text className="typo-btn-cta text-lime-500 mt-2">
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
      onCancel={handleCancelDelete}
      onConfirm={handleConfirmDelete}
    />
  </View>
);
}

const MealCard = React.memo(function MealCard({
  meal,
  onPress,
  onDelete,
}: {
  meal: MealWithItems;
  onPress: () => void;
  onDelete: () => void;
}) {
  // חישוב קלוריות וחלבון כולל
  const stats = (meal.meal_items ?? []).reduce(
    (acc, mi) => {
      if (mi.food_item) {
        const n = calculateNutrients(
          {
            id: '',
            user_id: '',
            name: mi.food_item.name,
            measurement_type: mi.food_item.measurement_type,
            unit_weight_g: mi.food_item.unit_weight_g ?? null,
            calories_per_100: mi.food_item.calories_per_100,
            protein_per_100: mi.food_item.protein_per_100,
            carbs_per_100: mi.food_item.carbs_per_100,
            fat_per_100: mi.food_item.fat_per_100,
            calories_per_unit: mi.food_item.calories_per_unit ?? null,
            protein_per_unit: mi.food_item.protein_per_unit ?? null,
            carbs_per_unit: mi.food_item.carbs_per_unit ?? null,
            fat_per_unit: mi.food_item.fat_per_unit ?? null,
            is_active: true,
            created_at: '',
            updated_at: '',
          },
          Number(mi.amount_g)
        );
        acc.calories += n.calories;
        acc.protein += n.protein;
      }
      return acc;
    },
    { calories: 0, protein: 0 }
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
      className="bg-background-800 border border-white/5 rounded-3xl overflow-hidden shadow-sm"
      accessibilityRole="button"
      accessibilityLabel={`${meal.name_meal || 'ארוחה'} - בחר ארוחה`}
    >
      <View className="flex-row items-center p-4">
        {/* אייקון ארוחה מעוצב */}
        <View className="bg-lime-500/10 rounded-2xl w-14 h-14 items-center justify-center ml-4">
          <Ionicons name="restaurant" size={26} color="#84cc16" />
        </View>

        {/* פרטי הארוחה */}
        <View className="flex-1">
          <Text className="typo-h4 text-white text-right" numberOfLines={1}>
            {meal.name_meal || 'ארוחה ללא שם'}
          </Text>

          <View className="flex-row items-center mt-1">
            <Text className="typo-caption-bold text-orange-400">
              {Math.round(stats.calories)} קק״ל
            </Text>
            <View className="w-1 h-1 rounded-full bg-gray-600 mx-2" />
            <Text className="typo-caption-bold text-lime-400">
              {Math.round(stats.protein)}ג׳ חלבון
            </Text>
            <View className="w-1 h-1 rounded-full bg-gray-600 mx-2" />
            <Text className="typo-caption text-gray-400">
              {(meal.meal_items ?? []).length} מרכיבים
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

      {/* מרכיבים — תצוגת chips */}
      <View className="bg-white/5 px-4 py-3 border-t border-white/5 flex-row flex-wrap gap-2">
        {(meal.meal_items ?? []).slice(0, 4).map((mi: any, index: number) => (
          <View key={index} className="bg-background-700 rounded-full px-3 py-1 border border-white/5">
            <Text className="typo-caption text-gray-400" numberOfLines={1}>
              {mi.food_item?.name}
            </Text>
          </View>
        ))}
        {(meal.meal_items ?? []).length > 4 && (
          <View className="bg-background-700 rounded-full px-3 py-1 border border-white/5">
            <Text className="typo-caption text-gray-500">
              +{(meal.meal_items ?? []).length - 4}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
});
