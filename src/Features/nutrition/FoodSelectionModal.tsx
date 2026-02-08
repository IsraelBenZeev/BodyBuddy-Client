import { colors } from '@/colors';
import {
    useCreateFoodItem,
    useCreateNutritionEntry,
    useFoodItems,
} from '@/src/hooks/useNutrition';
import type { FoodItem, SliderEntryFormData } from '@/src/types/nutrition';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import ManualEntryWithSliders from './ManualEntryWithSliders';
import PortionSelector from './PortionSelector';

interface Props {
  userId: string;
  date: string;
  onClose: () => void;
}

type ViewMode = 'list' | 'portion' | 'manual';

const FoodSelectionModal = ({ userId, date, onClose }: Props) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const { data: foodItems = [], isLoading } = useFoodItems(userId);
  const { mutate: createFoodItem, isPending: isCreatingFood } = useCreateFoodItem(userId);
  const { mutate: createEntry, isPending: isCreatingEntry } = useCreateNutritionEntry(
    userId,
    date,
  );

  const handleFoodSelect = useCallback((food: FoodItem) => {
    setSelectedFood(food);
    setViewMode('portion');
  }, []);

  const handlePortionSubmit = useCallback(
    (portionSize: number) => {
      if (!selectedFood) return;

      const ratio = portionSize / 100;

      createEntry(
        {
          user_id: userId,
          date,
          food_name: selectedFood.name,
          protein: Math.round(selectedFood.protein_per_100 * ratio * 10) / 10,
          carbs: Math.round(selectedFood.carbs_per_100 * ratio * 10) / 10,
          fat: Math.round(selectedFood.fat_per_100 * ratio * 10) / 10,
          calories: Math.round(selectedFood.calories_per_100 * ratio * 10) / 10,
          portion_size: portionSize,
          portion_unit: 'g',
          food_item_id: selectedFood.id,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    },
    [selectedFood, userId, date, createEntry, onClose],
  );

  const handleManualEntrySubmit = useCallback(
    (data: SliderEntryFormData) => {
      const calories = Math.round(
        (data.protein_per_100 * 4 + data.carbs_per_100 * 4 + data.fat_per_100 * 9) * 10,
      ) / 10;

      createFoodItem(
        {
          name: data.food_name,
          protein_per_100: data.protein_per_100,
          carbs_per_100: data.carbs_per_100,
          fat_per_100: data.fat_per_100,
          calories_per_100: calories,
        },
        {
          onSuccess: (newFood) => {
            const ratio = data.portion_size / 100;

            createEntry(
              {
                user_id: userId,
                date,
                food_name: newFood.name,
                protein: Math.round(newFood.protein_per_100 * ratio * 10) / 10,
                carbs: Math.round(newFood.carbs_per_100 * ratio * 10) / 10,
                fat: Math.round(newFood.fat_per_100 * ratio * 10) / 10,
                calories: Math.round(newFood.calories_per_100 * ratio * 10) / 10,
                portion_size: data.portion_size,
                portion_unit: data.portion_unit,
                food_item_id: newFood.id,
              },
              {
                onSuccess: () => {
                  onClose();
                },
              },
            );
          },
        },
      );
    },
    [userId, date, createFoodItem, createEntry, onClose],
  );

  if (viewMode === 'portion' && selectedFood) {
    return (
      <PortionSelector
        foodItem={selectedFood}
        onSubmit={handlePortionSubmit}
        isPending={isCreatingEntry}
        onBack={() => {
          setViewMode('list');
          setSelectedFood(null);
        }}
      />
    );
  }

  if (viewMode === 'manual') {
    return (
      <ManualEntryWithSliders
        onSubmit={handleManualEntrySubmit}
        isPending={isCreatingFood || isCreatingEntry}
        onBack={() => setViewMode('list')}
      />
    );
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 16 }}>
      <Text className="text-lime-400 text-2xl font-black mb-2 text-right">בחר מזון</Text>
      <Text className="text-background-400 text-sm mb-6 text-right">
        {foodItems.length > 0 ? 'מהרשימה שלך' : 'עדיין לא הוספת מזונות'}
      </Text>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.lime[500]} size="large" />
        </View>
      ) : foodItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons name="nutrition-outline" size={60} color={colors.background[400]} />
          <Text className="text-white text-lg font-bold text-center mt-4">
            עדיין לא הוספת מזונות
          </Text>
          <Text className="text-background-400 text-center mt-2 mb-6">
            התחל על ידי הוספת מזון ידנית
          </Text>
        </View>
      ) : (
        <FlatList
          data={foodItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="h-3" />}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleFoodSelect(item)}
              className="bg-background-800 border border-background-600 rounded-2xl p-4"
            >
              <Text className="text-white text-base font-bold mb-2 text-right">
                {item.name}
              </Text>
              <View className="flex-row-reverse gap-3">
                <View className="items-center">
                  <Text className="text-lime-500 text-xs font-bold">
                    {item.protein_per_100}g
                  </Text>
                  <Text className="text-background-400 text-xs">חלבון</Text>
                </View>
                <View className="items-center">
                  <Text className="text-orange-500 text-xs font-bold">
                    {item.carbs_per_100}g
                  </Text>
                  <Text className="text-background-400 text-xs">פחמימות</Text>
                </View>
                <View className="items-center">
                  <Text className="text-red-500 text-xs font-bold">{item.fat_per_100}g</Text>
                  <Text className="text-background-400 text-xs">שומן</Text>
                </View>
                <View className="items-center ml-auto">
                  <Text className="text-white text-xs font-bold">
                    {item.calories_per_100}
                  </Text>
                  <Text className="text-background-400 text-xs">קק״ל/100g</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}

      <View className="absolute bottom-5 left-5 right-5 bg-background-900">
        <Pressable
          onPress={() => setViewMode('manual')}
          className="bg-lime-500 rounded-2xl py-4 flex-row-reverse items-center justify-center"
        >
          <Ionicons name="add-circle-outline" size={24} color={colors.background[900]} />
          <Text className="text-background-900 font-black text-base mr-2">
            {foodItems.length === 0 ? 'הוסף מזון עכשיו' : 'המזון שלך לא ברשימה?'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FoodSelectionModal;
