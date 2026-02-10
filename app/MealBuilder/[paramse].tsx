import { getCategoryIconName } from '@/src/Features/nutrition/foodCategories';
import PortionSelector from '@/src/Features/nutrition/PortionSelector';
import {
  useCreateMealWithItems,
  useCreateNutritionEntriesBulk,
  useFoodItems,
} from '@/src/hooks/useNutrition';
import { useAuthStore } from '@/src/store/useAuthStore';
import type { MealItemForm } from '@/src/types/meal';
import type { FoodItem } from '@/src/types/nutrition';
import BackGround from '@/src/ui/BackGround';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';

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
  const [savingMode, setSavingMode] = useState<'list' | 'list-and-journal' | null>(null);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const { data: foodItems = [] } = useFoodItems(userId);
  const { mutate: createMeal, isPending: isSaving } = useCreateMealWithItems(userId);
  const { mutate: addToJournal, isPending: isAddingToJournal } =
    useCreateNutritionEntriesBulk(userId, today);

  const totalCal = useMemo(
    () => items.reduce((sum, i) => sum + Math.round((i.calories_per_100 * i.amount_g) / 100), 0),
    [items]
  );

  const openAddModal = useCallback(() => {
    setSelectedFood(null);
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
    setAddStep('amount');
  }, []);

  const addItemFromPortion = useCallback(
    (portionGrams: number) => {
      if (!selectedFood) return;
      const serving = selectedFood.serving_weight ?? 100;
      setItems((prev) => [
        ...prev,
        {
          food_item_id: selectedFood.id,
          name: selectedFood.name,
          amount_g: portionGrams,
          protein_per_100: selectedFood.protein_per_100,
          carbs_per_100: selectedFood.carbs_per_100,
          fat_per_100: selectedFood.fat_per_100,
          calories_per_100: selectedFood.calories_per_100,
          serving_weight: serving,
        },
      ]);
      closeAddModal();
    },
    [selectedFood, closeAddModal]
  );

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSaveListOnly = useCallback(() => {
    const trimmed = nameMeal.trim();
    if (!trimmed) return;
    setSavingMode('list');
    const payload = items.map((it: MealItemForm) => ({
      food_item_id: it.food_item_id,
      amount_g: it.amount_g,
    }));
    createMeal(
      { name_meal: trimmed, items: payload },
      {
        onSuccess: () => {
          setSavingMode(null);
          router.back();
        },
        onError: () => setSavingMode(null),
      }
    );
  }, [nameMeal, items, createMeal, router]);

  const handleSaveListAndJournal = useCallback(() => {
    const trimmed = nameMeal.trim();
    if (!trimmed) return;
    const mealPayload = items.map((it: MealItemForm) => ({
      food_item_id: it.food_item_id,
      amount_g: it.amount_g,
    }));
    const groupId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
    const entryPayloads = items.map((it: MealItemForm) => {
      const ratio = it.amount_g / 100;
      return {
        user_id: userId,
        date: today,
        food_name: it.name,
        portion_size: Math.round(it.amount_g),
        protein: Math.round(it.protein_per_100 * ratio * 10) / 10,
        carbs: Math.round(it.carbs_per_100 * ratio * 10) / 10,
        fat: Math.round(it.fat_per_100 * ratio * 10) / 10,
        calories: Math.round((it.calories_per_100 * it.amount_g) / 100),
        portion_unit: 'g' as const,
        serving_weight: it.serving_weight,
        food_item_id: it.food_item_id,
        group_id: groupId,
        group_name: trimmed,
      };
    });
    setSavingMode('list-and-journal');
    createMeal(
      { name_meal: trimmed, items: mealPayload },
      {
        onSuccess: () => {
          addToJournal(entryPayloads, {
            onSuccess: () => {
              setSavingMode(null);
              router.back();
            },
            onError: () => setSavingMode(null),
          });
        },
        onError: () => setSavingMode(null),
      }
    );
  }, [nameMeal, items, userId, today, createMeal, addToJournal, router]);

  const canSave = nameMeal.trim().length > 0 && items.length > 0 && !isSaving && !isAddingToJournal;

  
  return (
    <BackGround>
      {/* Header משודרג */}
      <View className="flex-row-reverse items-center justify-between px-6 py-4 border-b border-white/5 bg-background-900/50">
        <Pressable
          onPress={() => router.back()}
          className="p-2 bg-background-800 rounded-full border border-white/5"
        >
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
        <Text className="text-white text-xl font-black">
          {mode === 'create' ? 'בניית ארוחה' : 'עריכת ארוחה'}
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-5 py-6">
        {/* קלט שם הארוחה */}
        <View className="mb-8">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 text-right px-1">
            איך נקרא לארוחה?
          </Text>
          <TextInput
            value={nameMeal}
            onChangeText={setNameMeal}
            placeholder="למשל: שייק חלבון בוקר..."
            placeholderTextColor="#525252"
            className="bg-background-800 border border-white/5 rounded-2xl px-5 py-4 text-right text-white text-lg font-bold shadow-sm"
          />
        </View>

        {/* כותרת רשימת הפריטים */}
        <View className="flex-row-reverse items-center justify-between mb-4 px-1">
          <View className="flex-row-reverse items-center">
            <Ionicons name="list" size={18} color="#84cc16" />
            <Text className="text-white text-lg font-black mr-2">מרכיבי הארוחה</Text>
          </View>
          <View className="bg-lime-500/10 px-3 py-1 rounded-full">
            <Text className="text-lime-500 text-xs font-bold">{totalCal} קק״ל</Text>
          </View>
        </View>

        {/* רשימת המרכיבים שנבחרו */}
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item.food_item_id}-${index}`}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListEmptyComponent={
            <View className="py-12 items-center bg-background-800/50 rounded-3xl border border-dashed border-white/10">
              <Ionicons name="restaurant-outline" size={40} color="#404040" />
              <Text className="text-gray-500 mt-3 text-center font-medium">
                הארוחה עדיין ריקה.{'\n'}לחץ על &quot;הוסף מאכל&quot; כדי להתחיל.
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View className="bg-background-800 border border-white/5 rounded-2xl p-4 flex-row-reverse items-center shadow-sm">
              <View className="bg-background-700 w-12 h-12 rounded-xl items-center justify-center ml-4">
                <Ionicons name="nutrition" size={20} color="#fb923c" />
              </View>

              <View className="flex-1">
                <Text className="text-white font-bold text-base text-right" numberOfLines={1}>
                  {item.name}
                </Text>
                <View className="flex-row-reverse items-center mt-1">
                  <Text className="text-gray-400 text-xs">{item.amount_g} גרם</Text>
                  <View className="w-1 h-1 rounded-full bg-gray-600 mx-2" />
                  <Text className="text-lime-400 text-xs font-bold">
                    {Math.round((item.calories_per_100 * item.amount_g) / 100)} קק״ל
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => removeItem(index)}
                className="bg-red-500/10 p-2.5 rounded-xl"
                hitSlop={15}
              >
                <Ionicons name="trash-outline" size={18} color="#f87171" />
              </Pressable>
            </View>
          )}
        />

        {/* כפתורי פעולה בתחתית הרשימה */}
        <View className="mt-6 gap-4">
          <Pressable
            onPress={openAddModal}
            className="bg-background-800 border border-dashed border-white/20 rounded-2xl py-4 flex-row-reverse items-center justify-center"
          >
            <Ionicons name="add-circle" size={22} color="#84cc16" />
            <Text className="text-lime-500 font-bold text-base mr-2">הוסף מאכל לארוחה</Text>
          </Pressable>

          <View className="gap-3">
            <Pressable
              onPress={handleSaveListOnly}
              disabled={!canSave}
              className={`rounded-2xl h-14 flex-row-reverse items-center justify-center border border-white/10 ${
                canSave ? 'bg-background-800' : 'bg-background-700 opacity-50'
              }`}
            >
              {savingMode === 'list' && isSaving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text className="text-white font-black text-base mr-2">הוסף לרשימה בלבד</Text>
                  <Ionicons name="list" size={22} color="#fff" />
                </>
              )}
            </Pressable>
            <Pressable
              onPress={handleSaveListAndJournal}
              disabled={!canSave}
              className={`rounded-2xl h-16 flex-row-reverse items-center justify-center shadow-lg ${
                canSave ? 'bg-lime-500 shadow-lime-500/20' : 'bg-background-700 opacity-50'
              }`}
            >
              {savingMode === 'list-and-journal' && (isSaving || isAddingToJournal) ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#000" />
                  <Text className="text-black font-black text-lg mr-2">הוסף לרשימה וליומן</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>

      {/* Modal: בחירת מאכל */}
      <Modal visible={addModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-background-900">
          <View className="flex-row-reverse items-center justify-between px-6 py-4 border-b border-white/5">
            <Pressable
              onPress={() => (addStep === 'amount' ? setAddStep('list') : closeAddModal())}
              className="p-2"
            >
              <Ionicons name="close" size={26} color="#fff" />
            </Pressable>
            <Text className="text-white text-lg font-black">
              {addStep === 'list' ? 'בחירת מאכל' : 'הגדרת כמות'}
            </Text>
            <View className="w-10" />
          </View>

          {addStep === 'list' ? (
            <View className="flex-1 px-5 pt-4">
              <FlatList
                data={foodItems}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View className="h-3" />}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => onSelectFood(item)}
                    className="bg-background-800 border border-white/5 rounded-2xl p-4 flex-row-reverse items-center"
                  >
                    <View className="bg-orange-500/10 w-10 h-10 rounded-xl items-center justify-center ml-3">
                      <Ionicons
                        name={getCategoryIconName(item.category)}
                        size={20}
                        color="#fb923c"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-right">{item.name}</Text>
                      <Text className="text-gray-500 text-xs text-right">
                        {item.calories_per_100} קק״ל ל-100ג׳
                      </Text>
                    </View>
                    <Ionicons name="chevron-back" size={18} color="#404040" />
                  </Pressable>
                )}
              />
            </View>
          ) : selectedFood ? (
            <PortionSelector
              foodItem={selectedFood}
              onSubmit={addItemFromPortion}
              isPending={false}
              onBack={() => setAddStep('list')}
              submitLabel="הוסף לארוחה"
            />
          ) : null}
        </View>
      </Modal>
    </BackGround>
  );
}
