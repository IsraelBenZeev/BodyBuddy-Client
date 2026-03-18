import { getCategoryIconName } from '@/src/Features/nutrition/add/food/foodCategories';
import { calculateNutrients } from '@/src/Features/nutrition/utils/nutritionCalc';
import { useCreateNutritionEntry, useDeleteFoodItem, useFoodItems } from '@/src/hooks/useNutrition';
import type { FoodItem } from '@/src/types/nutrition';
import DeleteConfirmModal from '@/src/ui/DeleteConfirmModal';
import EmptyState from '@/src/ui/EmptyState';
import ScreenHeader from '@/src/ui/ScreenHeader';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import AddNewFoodSelection from './AddNewFoodSelection';

interface Props {
  userId: string;
  date: string;
  onClose: () => void;
}

type ViewMode = 'list' | 'portion';

const Foods = ({ userId, date, onClose }: Props) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [foodToDelete, setFoodToDelete] = useState<FoodItem | null>(null);
  const router = useRouter();

  const { data: foodItems = [], isLoading } = useFoodItems(userId);
  const { mutate: createEntry, isPending: isCreatingEntry } = useCreateNutritionEntry(userId, date);
  const { mutate: deleteFood, isPending: isDeletingFood } = useDeleteFoodItem(userId);

  const handleFoodSelect = useCallback((food: FoodItem) => {
    setSelectedFood(food);
    setViewMode('portion');
  }, []);

  const handleBack = useCallback(() => {
    setViewMode('list');
    setSelectedFood(null);
  }, []);

  const handleAddNewFood = useCallback(() => {
    onClose();
    router.push('/add-food/standalone');
  }, [onClose, router]);

  const handleCancelDelete = useCallback(() => setFoodToDelete(null), []);
  const handleConfirmDelete = useCallback(() => {
    if (!foodToDelete) return;
    const id = foodToDelete.id;
    setFoodToDelete(null);
    deleteFood(id);
  }, [foodToDelete, deleteFood]);

  const renderItem = useCallback(({ item }: { item: FoodItem }) => (
    <FoodCard item={item} userId={userId} onSelect={handleFoodSelect} onDelete={setFoodToDelete} />
  ), [userId, handleFoodSelect]);

  const handlePortionSubmit = useCallback(
    (amount: number, portionUnit: 'g' | 'unit') => {
      if (!selectedFood) return;

      const nutrients = calculateNutrients(selectedFood, amount);

      createEntry(
        {
          user_id: userId,
          date,
          food_name: selectedFood.name,
          ...nutrients,
          portion_size: amount,
          portion_unit: portionUnit,
          food_item_id: selectedFood.id,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    },
    [selectedFood, userId, date, createEntry, onClose]
  );

  if (viewMode === 'portion' && selectedFood) {
    return (
      <AddNewFoodSelection
        foodItem={selectedFood}
        onSubmit={handlePortionSubmit}
        isPending={isCreatingEntry}
        onBack={handleBack}
      />
    );
  }

  return (
    <View className="flex-1 bg-background-900 px-5 pt-6">
      <ScreenHeader
        title="רשימת המאכלים שלי"
        subtitle={foodItems.length > 0 ? `בחר מאכל מתוך ${foodItems.length} פריטים` : 'עדיין לא הוספת מזונות'}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#84cc16" size="large" />
        </View>
      ) : foodItems.length === 0 ? (
        <EmptyState
          icon={<Ionicons name="search-outline" size={60} color="#4b5563" />}
          title="רשימת המאכלים שלך ריקה"
          description="נראה שעדיין לא הוספת מוצרים. הוסף את המזונות שאתה אוכל בדרך כלל כדי שיופיעו כאן."
          action={{
            label: "הוסף מזון ראשון",
            onPress: handleAddNewFood,
            icon: <Ionicons name="add-circle" size={24} color="#000" />,
          }}
        />
      ) : (
        <FlatList
          data={foodItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={renderItem}
          initialNumToRender={8}
          maxToRenderPerBatch={5}
          removeClippedSubviews={true}
        />
      )}

      {/* כפתור הוספה צף בתחתית — מוצג רק כשיש מאכלים */}
      {foodItems.length > 0 && (
        <View className="absolute bottom-8 left-6 right-6 shadow-2xl">
          <Pressable
            onPress={handleAddNewFood}
            className="bg-lime-500 rounded-2xl h-16 flex-row-reverse items-center justify-center"
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="הוסף מזון חדש למזווה"
          >
            <Ionicons name="add-circle" size={24} color="#000" />
            <Text className="text-black font-black text-base mr-2">הוסף מזון חדש למזווה</Text>
          </Pressable>
          <Text className="text-gray-500 text-[10px] text-center mt-3">
            * המזונות שתגדיר כאן יהיו זמינים להוספה מהירה ליומן
          </Text>
        </View>
      )}

      <DeleteConfirmModal
        visible={foodToDelete !== null}
        title="מחיקת מאכל"
        message={`האם למחוק את "${foodToDelete?.name}" מהרשימה?`}
        infoNote="מחיקת מאכל מהרשימה שלך לא תשפיע על הרשומות שכבר קיימות ביומן התזונה"
        isDeleting={isDeletingFood}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
};

export default Foods;

const FoodCard = React.memo(function FoodCard({
  item,
  userId,
  onSelect,
  onDelete,
}: {
  item: FoodItem;
  userId: string;
  onSelect: (food: FoodItem) => void;
  onDelete: (food: FoodItem) => void;
}) {
  const handlePress = useCallback(() => onSelect(item), [onSelect, item]);
  const handleDelete = useCallback((e: any) => {
    e.stopPropagation();
    onDelete(item);
  }, [onDelete, item]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
      className="bg-background-800 border border-white/5 rounded-3xl overflow-hidden shadow-sm"
      accessibilityRole="button"
      accessibilityLabel={`${item.name} - בחר מאכל`}
    >
      <View className="flex-row-reverse items-center p-4">
        <View className="bg-orange-500/10 rounded-2xl w-14 h-14 items-center justify-center ml-4 border border-orange-500/10">
          <MaterialCommunityIcons
            name={getCategoryIconName(item.category)}
            size={26}
            color="#fb923c"
          />
        </View>

        <View className="flex-1">
          <Text className="text-white text-lg font-bold text-right" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="flex-row-reverse items-center mt-1">
            <Text className="text-lime-400 text-xs font-bold">
              {item.measurement_type === 'units' ? item.calories_per_unit : item.calories_per_100}{' '}קק״ל
            </Text>
            <Text className="text-gray-500 text-[10px] mr-1">
              {item.measurement_type === 'units' ? `/ ליחידה` : '/ ל-100 גרם'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mr-1">
          {item.user_id === userId && (
            <Pressable
              onPress={handleDelete}
              hitSlop={8}
              className="bg-red-500/10 rounded-xl p-2 ml-2"
              accessibilityRole="button"
              accessibilityLabel={`מחק ${item.name}`}
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </Pressable>
          )}
          <View className="bg-background-700 rounded-full p-1">
            <Ionicons name="chevron-back" size={16} color="#9ca3af" />
          </View>
        </View>
      </View>

      <View className="flex-row-reverse bg-white/5 px-4 py-3 justify-between items-center">
        <View className="items-center flex-1">
          <Text className="text-lime-500 font-black text-xs">
            {item.measurement_type === 'units' ? item.protein_per_unit : item.protein_per_100}g
          </Text>
          <Text className="text-gray-500 text-[9px] uppercase font-bold mt-0.5">חלבון</Text>
        </View>
        <View className="w-[1px] h-4 bg-white/10" />
        <View className="items-center flex-1">
          <Text className="text-orange-500 font-black text-xs">
            {item.measurement_type === 'units' ? item.carbs_per_unit : item.carbs_per_100}g
          </Text>
          <Text className="text-gray-500 text-[9px] uppercase font-bold mt-0.5">פחמימה</Text>
        </View>
        <View className="w-[1px] h-4 bg-white/10" />
        <View className="items-center flex-1">
          <Text className="text-red-500 font-black text-xs">
            {item.measurement_type === 'units' ? item.fat_per_unit : item.fat_per_100}g
          </Text>
          <Text className="text-gray-500 text-[9px] uppercase font-bold mt-0.5">שומן</Text>
        </View>
      </View>
    </Pressable>
  );
});
