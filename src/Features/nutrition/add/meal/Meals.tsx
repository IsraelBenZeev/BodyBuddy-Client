import { colors } from '@/colors';
import { calculateNutrients } from '@/src/Features/nutrition/utils/nutritionCalc';
import { useDeleteMeal, useMealsWithItems } from '@/src/hooks/useNutrition';
import type { MealWithItems } from '@/src/types/meal';
import DeleteConfirmModal from '@/src/ui/DeleteConfirmModal';
import ScreenHeader from '@/src/ui/ScreenHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
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

  const renderItem = useCallback(
    ({ item }: { item: MealWithItems }) => (
      <MealCard
        meal={item}
        onPress={() => setReviewMeal(item)}
        onDelete={() => setMealToDelete(item)}
      />
    ),
    []
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator color={colors.lime[500]} size="large" />
      </View>
    );
  }

  if (meals.length === 0) {
    return (
      <View className="flex-1 bg-background-900 px-5 pt-6">
        <ScreenHeader title="הארוחות שלי" subtitle="בחר ארוחה מוכנה כדי להוסיף ליום שלך" />
        <View className="flex-1 items-center px-6 gap-8">
          <View className="items-center gap-4 mb-10">
            <View className="items-center justify-center" style={{ width: 160, height: 160 }}>
              <View className="absolute w-40 h-40 bg-lime-500/5 rounded-full" />
              <View className="absolute w-28 h-28 bg-lime-500/8 rounded-full" />
              <View className="bg-background-800 border border-white/8 p-8 rounded-full">
                <Ionicons name="restaurant-outline" size={44} color="#84cc16" />
              </View>
            </View>
            <Text className="typo-h2 text-white text-center">עדיין לא נוספו ארוחות</Text>
            <Text className="typo-label text-gray-400 text-center">
              צור ארוחה מוכנה עם מאכלים וכמויות כדי להוסיף אותה בקלות ביום שלך
            </Text>
          </View>
          <Pressable
            onPress={handleCreateFirstMeal}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.96 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="bg-gradient-to-r from-lime-500/15 to-lime-500/5 border border-lime-500/40 rounded-full py-3 px-6 flex-row items-center justify-center gap-3 w-full"
            accessibilityRole="button"
            accessibilityLabel="צור ארוחה חדשה לשמירה"
          >
            <View className="bg-lime-500/25 w-12 h-12 rounded-full items-center justify-center border border-lime-500/50">
              <Ionicons name="add" size={26} color="#84cc16" />
            </View>
            <Text className="typo-btn-cta text-lime-400">צור ארוחה חדשה</Text>
          </Pressable>
        </View>
      </View>
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
          style={({ pressed }) => [
            {
              transform: [{ scale: pressed ? 0.96 : 1 }],
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          className="bg-gradient-to-r from-lime-500/15 to-lime-500/5 border border-lime-500/40 rounded-full py-3 px-6 flex-row items-center justify-center gap-3"
          accessibilityRole="button"
          accessibilityLabel="צור ארוחה חדשה לשמירה"
        >
          <View className="bg-lime-500/25 w-12 h-12 rounded-full items-center justify-center border border-lime-500/50">
            <Ionicons name="add" size={26} color="#84cc16" />
          </View>
          <Text className="typo-btn-cta text-lime-400">צור ארוחה חדשה</Text>
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
        acc.carbs += n.carbs;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0 }
  );

  return (
    // <Pressable
    //   onPress={onPress}
    //   style={({ pressed }) => [
    //     { transform: [{ scale: pressed ? 0.97 : 1 }], opacity: pressed ? 0.9 : 1 },
    //   ]}
    //   className="bg-background-800 border border-white/5 rounded-[28px] overflow-hidden mb-4 shadow-xl"
    // >
    //   <View className="p-4 flex-row items-center gap-3">
    //     {/* סמל ארוחה בתוך צורה מעוגלת רכה */}
    //     <View className="bg-lime-500/10 w-16 h-16 rounded-2xl items-center justify-center ml-4 border border-lime-500/10">
    //       <Ionicons name="restaurant-outline" size={28} color="#bef264" />
    //     </View>

    //     <View className="flex-1">
    //       <Text className="typo-h4 text-white font-bold tracking-tight" numberOfLines={1}>
    //         {meal.name_meal || 'ארוחה חדשה'}
    //       </Text>

    //       <View className="flex-row items-center mt-1 bg-white/5 self-start py-0.5 rounded-lg">
    //         <Text className="typo-caption-bold text-orange-400">
    //           {Math.round(stats.calories)} קק״ל
    //         </Text>
    //         <View className="w-[1px] h-3 bg-white/10 mx-2" />
    //         <Text className="typo-caption-bold text-lime-400">
    //           {Math.round(stats.protein)}g חלבון
    //         </Text>
    //         <View className="w-[1px] h-3 bg-white/10 mx-2" />
    //         <Text className="typo-caption-bold text-blue-400">
    //           {Math.round(stats.carbs)}g פחמ׳
    //         </Text>
    //       </View>
    //     </View>

    //     <View className="flex-row items-center gap-2">
    //       <Pressable
    //         onPress={(e) => {
    //           e.stopPropagation();
    //           onDelete();
    //         }}
    //         className="bg-red-500/10 p-2.5 rounded-xl border border-red-500/5"
    //       >
    //         <Ionicons name="trash-outline" size={18} color="#f87171" />
    //       </Pressable>
    //       <View className="bg-white/5 p-1.5 rounded-full">
    //         <Ionicons name="chevron-back" size={14} color="#6b7280" />
    //       </View>
    //     </View>
    //   </View>

    //   {/* אזור מרכיבים מעוצב כ-Grid עדין */}
    //   <View className="bg-black/20 px-4 py-3 flex-row flex-wrap gap-1.5 border-t border-white/5">
    //     {(meal.meal_items ?? []).slice(0, 3).map((mi: any, index: number) => (
    //       <View key={index} className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">
    //         <Text className="text-[11px] text-gray-400 font-medium">{mi.food_item?.name}</Text>
    //       </View>
    //     ))}
    //     {(meal.meal_items ?? []).length > 3 && (
    //       <View className="bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/10">
    //         <Text className="text-[11px] text-orange-400 font-bold">
    //           +{(meal.meal_items ?? []).length - 3} נוספים
    //         </Text>
    //       </View>
    //     )}
    //   </View>
    // </Pressable>
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.97 : 1 }], opacity: pressed ? 0.9 : 1 },
      ]}
      className="bg-background-800 border border-white/5 rounded-[32px] overflow-hidden mb-4 shadow-lg"
    >
      <View className="p-5">
        {/* שורה עליונה: אייקון, שם וכפתורי פעולה */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1 gap-3">
            <View className="bg-lime-500/10 w-12 h-12 rounded-2xl items-center justify-center ml-3 border border-lime-500/10">
              <Ionicons name="restaurant" size={22} color="#bef264" />
            </View>
            <View className="flex-1">
              <Text className="typo-h4 text-white font-bold" numberOfLines={1}>
                {meal.name_meal || 'ארוחה חדשה'}
              </Text>
              <Text className="text-xs text-gray-500 font-medium">
                {(meal.meal_items ?? []).length} מרכיבים רשומים
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="bg-red-500/10 p-2.5 rounded-xl border border-red-500/5"
            >
              <Ionicons name="trash-outline" size={18} color="#f87171" />
            </Pressable>
            <View className="bg-white/5 p-1.5 rounded-full">
              <Ionicons name="chevron-back" size={14} color="#4b5563" />
            </View>
          </View>
        </View>

        {/* קפסולת הערכים - צבעונית אך נקייה */}
        <View className="bg-black/30 rounded-[20px] px-4 py-3 flex-row items-center justify-between border border-white/5">
          <View className="items-center">
            <Text className="text-[10px] text-lime-500 font-bold uppercase mb-0.5">קלוריות</Text>
            <Text className="text-sm  text-lime-400">{Math.round(stats.calories)}</Text>
          </View>

          <View className="w-[1px] h-6 bg-white/10" />

          <View className="items-center">
            <Text className="text-[10px] text-blue-400 font-bold uppercase mb-0.5">חלבון</Text>
            <Text className="text-sm  text-blue-400">{Math.round(stats.protein)}g</Text>
          </View>

          <View className="w-[1px] h-6 bg-white/10" />

          <View className="items-center">
            <Text className="text-[10px] text-orange-400 font-bold uppercase mb-0.5">פחמימה</Text>
            <Text className="text-sm  text-orange-400">{Math.round(stats.carbs)}g</Text>
          </View>
        </View>
      </View>

      {/* רשימת מרכיבים תחתונה - טקסטואלית בלבד למניעת עומס */}
      {(meal.meal_items ?? []).length > 0 && (
        <View className="px-6 pb-4 flex-row flex-wrap items-center">
          <Ionicons name="list" size={12} color="#4b5563" className="ml-2" />
          <Text className="text-[10px] text-gray-500 italic" numberOfLines={1}>
            {(meal.meal_items ?? [])
              .slice(0, 5)
              .map((mi: any) => mi.food_item?.name)
              .join(' • ')}
            {(meal.meal_items ?? []).length > 5 ? ' ועוד...' : ''}
          </Text>
        </View>
      )}
    </Pressable>
  );
});
