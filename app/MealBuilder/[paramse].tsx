import { colors } from '@/colors';
import { getCategoryIconName } from '@/src/Features/nutrition/foodCategories';
import { useCreateMealWithItems, useFoodItems } from '@/src/hooks/useNutrition';
import { useAuthStore } from '@/src/store/useAuthStore';
import type { MealItemForm } from '@/src/types/meal';
import type { FoodItem } from '@/src/types/nutrition';
import BackGround from '@/src/ui/BackGround';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

type AddStep = 'list' | 'amount';

export default function MealBuilderPage() {
  const params = useLocalSearchParams<{ paramse?: string; initialName?: string }>();
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id) ?? '';

  const mode = params.paramse ?? 'create';
  const initialName = params.initialName ?? '';

  const [nameMeal, setNameMeal] = useState(initialName || '');
  const [items, setItems] = useState<MealItemForm[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addStep, setAddStep] = useState<AddStep>('list');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [amountG, setAmountG] = useState(100);

  const { data: foodItems = [], isLoading: foodsLoading } = useFoodItems(userId);
  const { mutate: createMeal, isPending: isSaving } = useCreateMealWithItems(userId);

  const totalCal = useMemo(
    () =>
      items.reduce(
        (sum, i) =>
          sum + Math.round((i.calories_per_100 * i.amount_g) / 100),
        0
      ),
    [items]
  );

  const openAddModal = useCallback(() => {
    setSelectedFood(null);
    setAmountG(100);
    setAddStep('list');
    setAddModalVisible(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setAddModalVisible(false);
    setSelectedFood(null);
    setAddStep('list');
  }, []);

  const onSelectFood = useCallback((food: FoodItem) => {
    setSelectedFood(food);
    setAmountG(food.serving_weight ?? 100);
    setAddStep('amount');
  }, []);

  const onAddItem = useCallback(() => {
    if (!selectedFood) return;
    const serving = selectedFood.serving_weight ?? 100;
    setItems((prev) => [
      ...prev,
      {
        food_item_id: selectedFood.id,
        name: selectedFood.name,
        amount_g: amountG,
        protein_per_100: selectedFood.protein_per_100,
        carbs_per_100: selectedFood.carbs_per_100,
        fat_per_100: selectedFood.fat_per_100,
        calories_per_100: selectedFood.calories_per_100,
        serving_weight: serving,
      },
    ]);
    closeAddModal();
  }, [selectedFood, amountG, closeAddModal]);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(() => {
    const trimmed = nameMeal.trim();
    if (!trimmed) return;
    const payload = items.map((it: MealItemForm) => ({
      food_item_id: it.food_item_id,
      amount_g: it.amount_g,
    }));
    createMeal(
      {
        name_meal: trimmed,
        items: payload,
      },
      {
        onSuccess: () => router.back(),
      }
    );
  }, [nameMeal, items, createMeal, router]);

  const canSave = nameMeal.trim().length > 0 && !isSaving;

  return (
    <BackGround>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-background-700">
        <Pressable onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-forward" size={24} color={colors.white} />
        </Pressable>
        <Text className="text-white text-lg font-bold">
          {mode === 'create' ? 'צור ארוחה חדשה' : 'עריכת ארוחה'}
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-5 py-4">
        <Text className="text-background-400 text-sm mb-2 text-right">
          שם הארוחה
        </Text>
        <TextInput
          value={nameMeal}
          onChangeText={setNameMeal}
          placeholder="למשל: ארוחת בוקר, פוסט אימון..."
          placeholderTextColor={colors.background[500]}
          className="bg-background-800 border border-background-600 rounded-xl px-4 py-3 text-right text-white text-base mb-6"
        />

        <View className="flex-row-reverse items-center justify-between mb-3">
          <Text className="text-lime-400 text-lg font-bold">פריטים בארוחה</Text>
          <Text className="text-background-400 text-sm">{totalCal} קק״ל</Text>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item.food_item_id}-${item.amount_g}-${index}`}
          ItemSeparatorComponent={() => <View className="h-2" />}
          ListEmptyComponent={
            <View className="py-8 items-center">
              <Ionicons
                name="nutrition-outline"
                size={48}
                color={colors.background[500]}
              />
              <Text className="text-background-400 mt-2 text-center">
                הוסף מאכלים מהרשימה שלך
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View className="bg-background-800 border border-background-600 rounded-xl p-3 flex-row-reverse items-center justify-between">
              <View className="flex-1 mr-2">
                <Text className="text-white font-bold text-right" numberOfLines={1}>
                  {item.name}
                </Text>
                <View className="flex-row-reverse items-center mt-0.5">
                  <Ionicons name="information-circle-outline" size={12} color={colors.background[400]} />
                  <Text className="text-background-400 text-xs mr-1">מנה: {item.serving_weight}g</Text>
                </View>
                <Text className="text-background-400 text-xs text-right">
                  {item.amount_g}g ·{' '}
                  {Math.round((item.calories_per_100 * item.amount_g) / 100)} קק״ל
                </Text>
              </View>
              <Pressable
                onPress={() => removeItem(index)}
                className="p-2"
                hitSlop={12}
              >
                <Ionicons name="trash-outline" size={20} color={colors.red[400]} />
              </Pressable>
            </View>
          )}
        />

        <Pressable
          onPress={openAddModal}
          className="bg-background-700 border border-dashed border-background-600 rounded-xl py-4 flex-row-reverse items-center justify-center mb-4"
        >
          <Ionicons name="add-circle-outline" size={24} color={colors.lime[500]} />
          <Text className="text-lime-500 font-bold mr-2">הוסף מאכל</Text>
        </Pressable>

        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          className={`rounded-2xl py-4 flex-row-reverse items-center justify-center ${
            canSave ? 'bg-lime-500' : 'bg-background-700 opacity-60'
          }`}
        >
          {isSaving ? (
            <ActivityIndicator color={colors.background[900]} size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color={colors.background[900]} />
              <Text className="text-background-900 font-black text-base mr-2">
                שמור ארוחה
              </Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Modal: בחר מאכל + כמות */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeAddModal}
      >
        <View style={{ flex: 1, backgroundColor: colors.background[900] }}>
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-background-700">
            <Pressable
              onPress={() =>
                addStep === 'amount' ? setAddStep('list') : closeAddModal()
              }
              className="p-2"
            >
              <Ionicons name="arrow-forward" size={24} color={colors.white} />
            </Pressable>
            <Text className="text-white text-lg font-bold">
              {addStep === 'list' ? 'בחר מאכל' : 'כמות בגרם'}
            </Text>
            <View className="w-10" />
          </View>

          {addStep === 'list' && (
            <View className="flex-1 px-4 py-2">
              {foodsLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator color={colors.lime[500]} size="large" />
                </View>
              ) : foodItems.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-background-400 text-center">
                    אין מאכלים ברשימה. הוסף מאכלים מהטאב "מאכלים".
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={foodItems}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={() => <View className="h-2" />}
                  contentContainerStyle={{ paddingBottom: 24 }}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => onSelectFood(item)}
                      className="bg-background-800 border border-background-600 rounded-xl p-3.5 flex-row-reverse items-center"
                    >
                      <View className="bg-background-700 rounded-lg w-10 h-10 items-center justify-center mr-2">
                        <Ionicons
                          name={getCategoryIconName(item.category)}
                          size={20}
                          color={colors.orange[400]}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-bold text-right">
                          {item.name}
                        </Text>
                        <View className="flex-row-reverse items-center mt-0.5">
                          <Ionicons name="information-circle-outline" size={12} color={colors.background[400]} />
                          <Text className="text-background-400 text-xs mr-1">
                            מנה: {item.serving_weight ?? 100}g
                          </Text>
                        </View>
                        <Text className="text-background-400 text-xs text-right">
                          {item.calories_per_100} קק״ל ל-100g
                        </Text>
                      </View>
                      <Ionicons name="chevron-back" size={18} color={colors.background[500]} />
                    </Pressable>
                  )}
                />
              )}
            </View>
          )}

          {addStep === 'amount' && selectedFood && (
            <View className="flex-1 px-5 py-6">
              <Text className="text-white text-lg font-bold text-right mb-1">
                {selectedFood.name}
              </Text>
              <View className="flex-row-reverse items-center mb-1">
                <Ionicons name="information-circle-outline" size={14} color={colors.background[400]} />
                <Text className="text-background-400 text-sm mr-1">
                  מנה: {selectedFood.serving_weight ?? 100}g
                </Text>
              </View>
              <Text className="text-background-400 text-sm text-right mb-6">
                בחר כמות בגרם
              </Text>
              <View className="mb-4">
                <Text className="text-lime-500 text-2xl font-black text-center">
                  {amountG} g
                </Text>
                <Slider
                  minimumValue={1}
                  maximumValue={500}
                  step={1}
                  value={amountG}
                  onValueChange={setAmountG}
                  minimumTrackTintColor={colors.lime[500]}
                  maximumTrackTintColor={colors.background[600]}
                  thumbTintColor={colors.lime[500]}
                />
              </View>
              <Text className="text-background-400 text-xs text-center mb-8">
                {Math.round((selectedFood.calories_per_100 * amountG) / 100)} קק״ל
              </Text>
              <Pressable
                onPress={onAddItem}
                className="bg-lime-500 rounded-2xl py-4 flex-row-reverse items-center justify-center"
              >
                <Ionicons name="add" size={22} color={colors.background[900]} />
                <Text className="text-background-900 font-black text-base mr-2">
                  הוסף לארוחה
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </BackGround>
  );
}
