import { colors } from '@/colors';
import type { AddStep } from '@/src/Features/nutrition/add/ListFoodForMealBuilder';
import ListFoodForMealBuilder from '@/src/Features/nutrition/add/ListFoodForMealBuilder';
import {
  useCreateFoodItem,
  useCreateMealWithItems,
  useCreateNutritionEntriesBulk,
  useFoodItems,
} from '@/src/hooks/useNutrition';
import { useAuthStore } from '@/src/store/useAuthStore';
import type { MealItemForm } from '@/src/types/meal';
import type { AIMealResultItem, FoodItem, SliderEntryFormData } from '@/src/types/nutrition';
import BackGround from '@/src/ui/BackGround';
import Handle from '@/src/ui/Handle';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

type MealItemState = MealItemForm & { isPendingCreate?: boolean };

const MealBuilderScreen = () => {
  const params = useLocalSearchParams<{
    paramse?: string;
    initialName?: string;
    initialItemsJson?: string;
  }>();
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id) ?? '';

  const mode = params.paramse ?? 'create';
  const initialName = params.initialName ?? '';

  const parsedInitialItems = useMemo<MealItemState[]>(() => {
    if (!params.initialItemsJson) return [];
    try {
      const aiItems: AIMealResultItem[] = JSON.parse(params.initialItemsJson);
      return aiItems.map((item) => ({
        food_item_id: '',
        name: item.food_name,
        amount_g: item.estimated_grams,
        protein_per_100: item.protein_per_100,
        carbs_per_100: item.carbs_per_100,
        fat_per_100: item.fat_per_100,
        calories_per_100: item.calories_per_100,
        serving_weight: 100,
        isPendingCreate: true,
      }));
    } catch {
      return [];
    }
  }, [params.initialItemsJson]);

  const [nameMeal, setNameMeal] = useState(initialName || '');
  const [items, setItems] = useState<MealItemState[]>(parsedInitialItems);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addStep, setAddStep] = useState<AddStep>('list');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [savingMode, setSavingMode] = useState<'list' | 'list-and-journal' | null>(null);
  const [editDraft, setEditDraft] = useState<{
    index: number;
    name: string;
    isPendingCreate: boolean;
    amount_g: number;
    serving_weight: number;
    protein_per_100: number;
    carbs_per_100: number;
    fat_per_100: number;
  } | null>(null);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const { data: foodItems = [] } = useFoodItems(userId);
  const { mutate: createMeal, isPending: isSaving } = useCreateMealWithItems(userId);
  const { mutate: addToJournal, isPending: isAddingToJournal } = useCreateNutritionEntriesBulk(
    userId,
    today
  );
  const {
    mutate: createFoodItem,
    mutateAsync: createFoodItemAsync,
    isPending: isCreatingFood,
  } = useCreateFoodItem(userId);

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

  const handleNewFoodSubmit = useCallback(
    (data: SliderEntryFormData) => {
      const calories =
        Math.round(
          (data.protein_per_100 * 4 + data.carbs_per_100 * 4 + data.fat_per_100 * 9) * 10
        ) / 10;
      createFoodItem(
        {
          name: data.food_name,
          category: data.category,
          serving_weight: data.serving_weight,
          protein_per_100: data.protein_per_100,
          carbs_per_100: data.carbs_per_100,
          fat_per_100: data.fat_per_100,
          calories_per_100: calories,
        },
        {
          onSuccess: (newFood) => {
            setItems((prev) => [
              ...prev,
              {
                food_item_id: newFood.id,
                name: newFood.name,
                amount_g: data.portion_size,
                protein_per_100: newFood.protein_per_100,
                carbs_per_100: newFood.carbs_per_100,
                fat_per_100: newFood.fat_per_100,
                calories_per_100: newFood.calories_per_100,
                serving_weight: newFood.serving_weight ?? 100,
              },
            ]);
            closeAddModal();
          },
        }
      );
    },
    [createFoodItem, closeAddModal]
  );

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const openEditItem = useCallback(
    (index: number) => {
      const item = items[index];
      setEditDraft({
        index,
        name: item.name,
        isPendingCreate: item.isPendingCreate ?? false,
        amount_g: item.amount_g,
        serving_weight: item.serving_weight,
        protein_per_100: item.protein_per_100,
        carbs_per_100: item.carbs_per_100,
        fat_per_100: item.fat_per_100,
      });
    },
    [items]
  );

  const confirmEditItem = useCallback(() => {
    if (!editDraft) return;
    const p = editDraft.protein_per_100;
    const c = editDraft.carbs_per_100;
    const f = editDraft.fat_per_100;
    const calories_per_100 = Math.round((p * 4 + c * 4 + f * 9) * 10) / 10;
    setItems((prev) =>
      prev.map((item, i) =>
        i === editDraft.index
          ? {
              ...item,
              amount_g: editDraft.amount_g,
              serving_weight: editDraft.serving_weight,
              protein_per_100: p,
              carbs_per_100: c,
              fat_per_100: f,
              calories_per_100,
            }
          : item
      )
    );
    setEditDraft(null);
  }, [editDraft]);

  // יצור מאכלים שעדיין לא קיימים ב-DB (מ-AI) ומחזיר רשימה עם IDs מלאים
  const resolvePendingItems = useCallback(async (): Promise<MealItemState[]> => {
    const pending = items.filter((i) => i.isPendingCreate);
    if (pending.length === 0) return items;
    const created = await Promise.all(
      pending.map((i) =>
        createFoodItemAsync({
          name: i.name,
          protein_per_100: i.protein_per_100,
          carbs_per_100: i.carbs_per_100,
          fat_per_100: i.fat_per_100,
          calories_per_100: i.calories_per_100,
          serving_weight: i.serving_weight,
        })
      )
    );
    let createdIdx = 0;
    return items.map((item) => {
      if (!item.isPendingCreate) return item;
      const newFood = created[createdIdx++];
      return { ...item, food_item_id: newFood?.id ?? '', isPendingCreate: false };
    });
  }, [items, createFoodItemAsync]);

  const handleSaveListOnly = useCallback(async () => {
    const trimmed = nameMeal.trim();
    if (!trimmed) return;
    setSavingMode('list');
    try {
      const resolvedItems = await resolvePendingItems();
      const payload = resolvedItems.map((it) => ({
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
    } catch {
      setSavingMode(null);
    }
  }, [nameMeal, resolvePendingItems, createMeal, router]);

  const handleSaveListAndJournal = useCallback(async () => {
    const trimmed = nameMeal.trim();
    if (!trimmed) return;
    setSavingMode('list-and-journal');
    let resolvedItems: MealItemState[];
    try {
      resolvedItems = await resolvePendingItems();
    } catch {
      setSavingMode(null);
      return;
    }
    const mealPayload = resolvedItems.map((it) => ({
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
    const entryPayloads = resolvedItems.map((it) => {
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
  }, [nameMeal, resolvePendingItems, userId, today, createMeal, addToJournal, router]);

  const canSave = nameMeal.trim().length > 0 && items.length > 0 && !isSaving && !isAddingToJournal;

  return (
    <BackGround>
      <View className="flex-1 px-5 pb-6">
        {/* Handle + כפתור סגירה */}
        <View className="items-center pt-3 pb-2">
          <Handle />
        </View>
        <View className="flex-row-reverse items-center justify-between mb-6">
          <Text className="text-white text-3xl font-black text-right">בניית ארוחה</Text>
          <Pressable
            onPress={() => router.back()}
            className="bg-background-800 w-10 h-10 rounded-xl items-center justify-center border border-white/10"
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </Pressable>
        </View>
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
          renderItem={({ item, index }) => {
            const ratio = item.amount_g / 100;
            const cal = Math.round(item.calories_per_100 * ratio);
            const pActual = Math.round(item.protein_per_100 * ratio * 10) / 10;
            const cActual = Math.round(item.carbs_per_100 * ratio * 10) / 10;
            const fActual = Math.round(item.fat_per_100 * ratio * 10) / 10;
            return (
              <View className="bg-background-800 border border-white/5 rounded-2xl p-4">
                {/* שורה 1: אייקון + שם + כפתורים */}
                <View className="flex-row-reverse items-center mb-2">
                  <View className="bg-background-700 w-10 h-10 rounded-xl items-center justify-center ml-3">
                    <Ionicons name="nutrition" size={18} color="#fb923c" />
                  </View>
                  <Text
                    className="text-white font-bold text-base flex-1 text-right"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => openEditItem(index)}
                      className="bg-background-700 p-2 rounded-xl"
                      hitSlop={10}
                    >
                      <Ionicons name="pencil-outline" size={16} color="#a3a3a3" />
                    </Pressable>
                    <Pressable
                      onPress={() => removeItem(index)}
                      className="bg-red-500/10 p-2 rounded-xl"
                      hitSlop={10}
                    >
                      <Ionicons name="trash-outline" size={16} color="#f87171" />
                    </Pressable>
                  </View>
                </View>
                {/* שורה 2: כמות + קלוריות */}
                <View className="flex-row-reverse items-center gap-2 mb-1">
                  <Text className="text-gray-400 text-xs">{item.amount_g}g</Text>
                  <View className="w-1 h-1 rounded-full bg-gray-600" />
                  <Text className="text-lime-400 text-xs font-bold">{cal} קק״ל</Text>
                </View>
                {/* שורה 3: מאקרו בפועל */}
                <View className="flex-row-reverse gap-3">
                  <Text className="text-blue-400 text-xs">P {pActual}g</Text>
                  <Text className="text-orange-400 text-xs">C {cActual}g</Text>
                  <Text className="text-red-400 text-xs">F {fActual}g</Text>
                </View>
              </View>
            );
          }}
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

      {/* Modal: עריכת מאכל */}
      <Modal
        visible={editDraft !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setEditDraft(null)}
      >
        <Pressable className="flex-1 bg-black/70 justify-end" onPress={() => setEditDraft(null)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="bg-background-900 rounded-t-3xl" style={{ maxHeight: '92%' }}>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View className="px-6 pt-5 pb-10">
                  {/* Handle */}
                  <View className="items-center mb-5">
                    <View className="w-12 h-1.5 bg-white/10 rounded-full" />
                  </View>

                  {/* שם המאכל + AI badge */}
                  <View className="flex-row-reverse items-center mb-6">
                    <View className="bg-orange-500/10 w-11 h-11 rounded-2xl items-center justify-center ml-3">
                      <Ionicons name="nutrition" size={20} color="#fb923c" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-black text-xl text-right" numberOfLines={1}>
                        {editDraft?.name ?? ''}
                      </Text>
                      {editDraft?.isPendingCreate && (
                        <View className="flex-row-reverse items-center mt-1">
                          <Ionicons name="flash" size={12} color="#84cc16" />
                          <Text className="text-lime-400 text-xs font-bold mr-1">
                            זוהה ע״י AI — בדוק ערכים
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Hero קלוריות — live */}
                  {editDraft && (
                    <View className="bg-background-800 border border-lime-500/15 rounded-3xl p-5 mb-7 items-center">
                      <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
                        קלוריות בצלחת
                      </Text>
                      <Text
                        className="text-white font-black"
                        style={{ fontSize: 52, lineHeight: 60 }}
                      >
                        {Math.round(
                          (editDraft.protein_per_100 * 4 +
                            editDraft.carbs_per_100 * 4 +
                            editDraft.fat_per_100 * 9) *
                            (editDraft.amount_g / 100)
                        )}
                      </Text>
                      <Text className="text-gray-500 text-sm mb-5">קק״ל</Text>
                      <View className="flex-row items-center" style={{ gap: 24 }}>
                        <View className="items-center">
                          <Text className="text-blue-400 font-black text-xl">
                            {Math.round(
                              editDraft.protein_per_100 * (editDraft.amount_g / 100) * 10
                            ) / 10}
                            g
                          </Text>
                          <Text className="text-gray-500 text-xs mt-0.5">חלבון</Text>
                        </View>
                        <View className="w-px bg-white/10" style={{ height: 32 }} />
                        <View className="items-center">
                          <Text className="text-orange-400 font-black text-xl">
                            {Math.round(editDraft.carbs_per_100 * (editDraft.amount_g / 100) * 10) /
                              10}
                            g
                          </Text>
                          <Text className="text-gray-500 text-xs mt-0.5">פחמימות</Text>
                        </View>
                        <View className="w-px bg-white/10" style={{ height: 32 }} />
                        <View className="items-center">
                          <Text className="text-red-400 font-black text-xl">
                            {Math.round(editDraft.fat_per_100 * (editDraft.amount_g / 100) * 10) /
                              10}
                            g
                          </Text>
                          <Text className="text-gray-500 text-xs mt-0.5">שומן</Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* כמות שאכלת */}
                  <View className="mb-7 mt-5">
                    <View className="flex-row-reverse items-center justify-between mb-2">
                      <Text className="text-white font-bold">כמות שאכלת</Text>
                      <View className="bg-lime-500/10 border border-lime-500/20 px-4 py-1.5 rounded-full">
                        <Text className="text-lime-400 font-black text-base">
                          {editDraft?.amount_g ?? 0}g
                        </Text>
                      </View>
                    </View>
                    <Slider
                      style={{ width: '100%', height: 44 }}
                      minimumValue={0}
                      maximumValue={1000}
                      step={5}
                      value={editDraft?.amount_g ?? 0}
                      onValueChange={(v) => setEditDraft((d) => d && { ...d, amount_g: v })}
                      minimumTrackTintColor={colors.lime[500]}
                      maximumTrackTintColor={colors.background[600]}
                      thumbTintColor={colors.lime[400]}
                    />
                    <View className="flex-row-reverse justify-between" style={{ marginTop: -4 }}>
                      <Text className="text-gray-700 text-xs">0g</Text>
                      <Text className="text-gray-700 text-xs">1000g</Text>
                    </View>
                  </View>

                  {/* גרם ליחידה */}
                  <View className="bg-background-800 rounded-2xl p-4 border border-white/5 mb-4">
                    <View className="flex-row-reverse items-center justify-between mb-1">
                      <Text className="text-gray-400 text-sm font-bold">גרם ליחידה</Text>
                      <Text className="text-white text-xl font-black">
                        {editDraft?.serving_weight ?? 100}g
                      </Text>
                    </View>
                    <Slider
                      style={{ width: '100%', height: 44 }}
                      minimumValue={1}
                      maximumValue={500}
                      step={1}
                      value={editDraft?.serving_weight ?? 100}
                      onValueChange={(v) =>
                        setEditDraft((d) => d && { ...d, serving_weight: Math.round(v) })
                      }
                      minimumTrackTintColor={colors.background[400]}
                      maximumTrackTintColor={colors.background[600]}
                      thumbTintColor={colors.background[300]}
                    />
                    <View className="flex-row-reverse justify-between" style={{ marginTop: -4 }}>
                      <Text className="text-gray-700 text-xs">1g</Text>
                      <Text className="text-gray-700 text-xs">500g</Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="flex-row items-center mb-5">
                    <View className="flex-1 h-px bg-white/5" />
                    <Text className="text-gray-600 text-xs font-bold uppercase tracking-widest px-3">
                      ערכים ל-100g
                    </Text>
                    <View className="flex-1 h-px bg-white/5" />
                  </View>

                  {/* חלבון */}
                  <View className="bg-background-800 rounded-2xl p-4 mb-3 border border-blue-500/20">
                    <View className="flex-row-reverse items-center justify-between mb-1">
                      <Text className="text-blue-400 text-sm font-bold">חלבון</Text>
                      <Text className="text-blue-400 text-xl font-black">
                        {editDraft?.protein_per_100 ?? 0}g
                      </Text>
                    </View>
                    <Slider
                      style={{ width: '100%', height: 44 }}
                      minimumValue={0}
                      maximumValue={100}
                      step={0.5}
                      value={editDraft?.protein_per_100 ?? 0}
                      onValueChange={(v) =>
                        setEditDraft((d) => d && { ...d, protein_per_100: Math.round(v * 10) / 10 })
                      }
                      minimumTrackTintColor="#60a5fa"
                      maximumTrackTintColor={colors.background[600]}
                      thumbTintColor="#60a5fa"
                    />
                  </View>

                  {/* פחמימות */}
                  <View className="bg-background-800 rounded-2xl p-4 mb-3 border border-orange-500/20">
                    <View className="flex-row-reverse items-center justify-between mb-1">
                      <Text className="text-orange-400 text-sm font-bold">פחמימות</Text>
                      <Text className="text-orange-400 text-xl font-black">
                        {editDraft?.carbs_per_100 ?? 0}g
                      </Text>
                    </View>
                    <Slider
                      style={{ width: '100%', height: 44 }}
                      minimumValue={0}
                      maximumValue={100}
                      step={0.5}
                      value={editDraft?.carbs_per_100 ?? 0}
                      onValueChange={(v) =>
                        setEditDraft((d) => d && { ...d, carbs_per_100: Math.round(v * 10) / 10 })
                      }
                      minimumTrackTintColor={colors.orange[500]}
                      maximumTrackTintColor={colors.background[600]}
                      thumbTintColor={colors.orange[500]}
                    />
                  </View>

                  {/* שומן */}
                  <View className="bg-background-800 rounded-2xl p-4 mb-5 border border-red-500/20">
                    <View className="flex-row-reverse items-center justify-between mb-1">
                      <Text className="text-red-400 text-sm font-bold">שומן</Text>
                      <Text className="text-red-400 text-xl font-black">
                        {editDraft?.fat_per_100 ?? 0}g
                      </Text>
                    </View>
                    <Slider
                      style={{ width: '100%', height: 44 }}
                      minimumValue={0}
                      maximumValue={100}
                      step={0.5}
                      value={editDraft?.fat_per_100 ?? 0}
                      onValueChange={(v) =>
                        setEditDraft((d) => d && { ...d, fat_per_100: Math.round(v * 10) / 10 })
                      }
                      minimumTrackTintColor={colors.red[500]}
                      maximumTrackTintColor={colors.background[600]}
                      thumbTintColor={colors.red[500]}
                    />
                  </View>

                  {/* כפתור שמור */}
                  <Pressable
                    onPress={confirmEditItem}
                    className="bg-lime-500 rounded-2xl h-14 items-center justify-center"
                  >
                    <Text className="text-black font-black text-base">שמור</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal: בחירת מאכל */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeAddModal}
      >
        <ListFoodForMealBuilder
          addStep={addStep}
          setAddStep={setAddStep}
          selectedFood={selectedFood}
          nameMeal={nameMeal}
          closeAddModal={closeAddModal}
          foodItems={foodItems}
          onSelectFood={onSelectFood}
          addItemFromPortion={addItemFromPortion}
          onNewFoodSubmit={handleNewFoodSubmit}
          isCreatingFood={isCreatingFood}
        />
      </Modal>
    </BackGround>
  );
};
export default MealBuilderScreen;
