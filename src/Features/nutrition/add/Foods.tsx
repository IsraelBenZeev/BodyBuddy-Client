import { getCategoryIconName } from '@/src/Features/nutrition/add/foodCategories';
import { useCreateFoodItem, useCreateNutritionEntry, useFoodItems } from '@/src/hooks/useNutrition';
import { useUIStore } from '@/src/store/useUIStore';
import type { FoodItem, SliderEntryFormData } from '@/src/types/nutrition';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import AddNewFood from './AddNewFoodForm';
import AddNewFoodSelection from './AddNewFoodSelection';

interface Props {
  userId: string;
  date: string;
  onClose: () => void;
}

type ViewMode = 'list' | 'portion' | 'manual';

const Foods = ({ userId, date, onClose }: Props) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const { triggerSuccess } = useUIStore();

  const { data: foodItems = [], isLoading } = useFoodItems(userId);
  const { mutate: createFoodItem, isPending: isCreatingFood } = useCreateFoodItem(userId);
  const { mutate: createEntry, isPending: isCreatingEntry } = useCreateNutritionEntry(userId, date);

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
          serving_weight: selectedFood.serving_weight ?? undefined,
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

  const handleManualEntrySubmit = useCallback(
    (data: SliderEntryFormData, addToJournal: boolean) => {
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
            if (!addToJournal) {
              triggerSuccess('המזון נוסף בהצלחה', 'success');
              onClose();
              return;
            }
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
                serving_weight: newFood.serving_weight ?? data.serving_weight ?? undefined,
                food_item_id: newFood.id,
              },
              {
                onSuccess: () => onClose(),
              }
            );
          },
        }
      );
    },
    [userId, date, createFoodItem, createEntry, onClose, triggerSuccess]
  );

  if (viewMode === 'portion' && selectedFood) {
    return (
      <AddNewFoodSelection
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
      <AddNewFood
        onSubmit={handleManualEntrySubmit}
        isPending={isCreatingFood || isCreatingEntry}
        onBack={() => setViewMode('list')}
      />
    );
  }

  // return (
  //   <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 16 }} className=''>
  //     <Text className="text-lime-400 text-2xl font-black mb-2 text-right">בחר מהרשימה</Text>
  //     <Text className="text-background-400 text-sm mb-6 text-right">
  //       {foodItems.length > 0 ? 'מהרשימה שלך' : 'עדיין לא הוספת מזונות'}
  //     </Text>

  //     {isLoading ? (
  //       <View className="flex-1 items-center justify-center">
  //         <ActivityIndicator color={colors.lime[500]} size="large" />
  //       </View>
  //     ) : foodItems.length === 0 ? (
  //       <View className="flex-1 items-center justify-center px-5">
  //         <Ionicons name="nutrition-outline" size={60} color={colors.background[400]} />
  //         <Text className="text-white text-lg font-bold text-center mt-4">
  //           עדיין לא הוספת מזונות
  //         </Text>
  //         <Text className="text-background-400 text-center mt-2 mb-6">
  //           התחל על ידי הוספת מזון ידנית
  //         </Text>
  //       </View>
  //     ) : (
  //       <FlatList
  //         data={foodItems}
  //         keyExtractor={(item) => item.id}
  //         showsVerticalScrollIndicator={false}
  //         ItemSeparatorComponent={() => <View className="h-3" />}
  //         contentContainerStyle={{ paddingBottom: 120 }}
  //         renderItem={({ item }) => (
  //           <Pressable
  //             onPress={() => handleFoodSelect(item)}
  //             className="bg-background-800 border border-background-600 rounded-2xl overflow-hidden"
  //           >
  //             <View className="flex-row-reverse items-center p-3.5">
  //               {/* Icon by category or default */}
  //               <View className="bg-background-700 rounded-xl w-12 h-12 items-center justify-center mr-1">
  //                 <Ionicons
  //                   name={getCategoryIconName(item.category)}
  //                   size={22}
  //                   color={colors.orange[400]}
  //                 />
  //               </View>

  //               {/* Food name & calories */}
  //               <View className="flex-1 mr-3">
  //                 <Text className="text-white text-base font-bold text-right" numberOfLines={1}>
  //                   {item.name}
  //                 </Text>
  //                 <Text className="text-background-400 text-xs text-right mt-0.5">
  //                   {item.calories_per_100} קק״ל ל-100g
  //                 </Text>
  //               </View>

  //               {/* Arrow indicator */}
  //               <Ionicons name="chevron-back" size={18} color={colors.background[500]} />
  //             </View>

  //             {/* Macro bar */}
  //             <View className="flex-row-reverse border-t border-background-700 px-3.5 py-2.5">
  //               <View className="flex-row-reverse items-center flex-1 justify-around">
  //                 <View className="flex-row-reverse items-center">
  //                   <View className="w-2 h-2 rounded-full bg-lime-500 ml-1.5" />
  //                   <Text className="text-background-300 text-xs">
  //                     חלבון <Text className="text-lime-500 font-bold">{item.protein_per_100}g</Text>
  //                   </Text>
  //                 </View>

  //                 <View className="flex-row-reverse items-center">
  //                   <View className="w-2 h-2 rounded-full bg-orange-500 ml-1.5" />
  //                   <Text className="text-background-300 text-xs">
  //                     פחמימות{' '}
  //                     <Text className="text-orange-500 font-bold">{item.carbs_per_100}g</Text>
  //                   </Text>
  //                 </View>

  //                 <View className="flex-row-reverse items-center">
  //                   <View className="w-2 h-2 rounded-full bg-red-500 ml-1.5" />
  //                   <Text className="text-background-300 text-xs">
  //                     שומן <Text className="text-red-500 font-bold">{item.fat_per_100}g</Text>
  //                   </Text>
  //                 </View>
  //               </View>
  //             </View>
  //           </Pressable>
  //         )}
  //       />
  //     )}

  //     <View className="absolute bottom-5 left-5 right-5 bg-background-900 pb-10">
  //       <Pressable
  //         onPress={() => setViewMode('manual')}
  //         className="bg-lime-500 rounded-2xl py-4 flex-row-reverse items-center justify-center"
  //       >
  //         <Ionicons name="add-circle-outline" size={24} color={colors.background[900]} />
  //         <Text className="text-background-900 font-black text-base mr-2">
  //           {foodItems.length === 0 ? 'הוסף מזון עכשיו' : 'המזון שלך לא ברשימה?'}
  //         </Text>
  //       </Pressable>
  //     </View>
  //   </View>
  // );
  return (
    <View className="flex-1 bg-background-900 px-5 pt-6">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-white text-3xl font-black text-right mb-1">רשימת המאכלים שלי</Text>
        <Text className="text-gray-400 text-sm text-right font-medium">
          {foodItems.length > 0 ? `בחר מאכל מתוך ${foodItems.length} פריטים` : 'עדיין לא הוספת מזונות'}
        </Text>
      </View>
  
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#84cc16" size="large" />
        </View>
      ) : foodItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="bg-background-800 p-8 rounded-full mb-6">
            <Ionicons name="search-outline" size={60} color="#4b5563" />
          </View>
          <Text className="text-white text-xl font-bold text-center">רשימת המאכלים שלך ריקה</Text>
          <Text className="text-gray-400 text-center mt-2 leading-5">
            נראה שעדיין לא הוספת מוצרים. הוסף את המזונות שאתה אוכל בדרך כלל כדי שיופיעו כאן.
          </Text>
        </View>
      ) : (
        <FlatList
          data={foodItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleFoodSelect(item)}
              style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
              className="bg-background-800 border border-white/5 rounded-3xl overflow-hidden shadow-sm"
            >
              <View className="flex-row-reverse items-center p-4">
                {/* אייקון קטגוריה משודרג */}
                <View className="bg-orange-500/10 rounded-2xl w-14 h-14 items-center justify-center ml-4 border border-orange-500/10">
                  <Ionicons
                    name={getCategoryIconName(item.category)}
                    size={26}
                    color="#fb923c"
                  />
                </View>
  
                {/* שם המאכל וקלוריות */}
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold text-right" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View className="flex-row-reverse items-center mt-1">
                    <Text className="text-lime-400 text-xs font-bold">{item.calories_per_100} קק״ל</Text>
                    <Text className="text-gray-500 text-[10px] mr-1">/ ל-100 גרם</Text>
                  </View>
                </View>
  
                {/* אינדיקטור בחירה */}
                <View className="bg-background-700 rounded-full p-1 mr-1">
                  <Ionicons name="chevron-back" size={16} color="#9ca3af" />
                </View>
              </View>
  
              {/* שורת מאקרו תחתונה - נקייה יותר */}
              <View className="flex-row-reverse bg-white/5 px-4 py-3 justify-between items-center">
                <View className="items-center flex-1">
                  <Text className="text-lime-500 font-black text-xs">{item.protein_per_100}g</Text>
                  <Text className="text-gray-500 text-[9px] uppercase font-bold mt-0.5">חלבון</Text>
                </View>
                <View className="w-[1px] h-4 bg-white/10" />
                <View className="items-center flex-1">
                  <Text className="text-orange-500 font-black text-xs">{item.carbs_per_100}g</Text>
                  <Text className="text-gray-500 text-[9px] uppercase font-bold mt-0.5">פחמימה</Text>
                </View>
                <View className="w-[1px] h-4 bg-white/10" />
                <View className="items-center flex-1">
                  <Text className="text-red-500 font-black text-xs">{item.fat_per_100}g</Text>
                  <Text className="text-gray-500 text-[9px] uppercase font-bold mt-0.5">שומן</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
  
      {/* כפתור הוספה צף בתחתית */}
      <View className="absolute bottom-8 left-6 right-6 shadow-2xl">
        <Pressable
          onPress={() => setViewMode('manual')}
          className="bg-lime-500 rounded-2xl h-16 flex-row-reverse items-center justify-center"
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        >
          <Ionicons name="add-circle" size={24} color="#000" />
          <Text className="text-black font-black text-base mr-2">
            {foodItems.length === 0 ? 'הוסף מזון ראשון' : 'הוסף מזון חדש למזווה'}
          </Text>
        </Pressable>
        {/* טקסט עזרה קטן מתחת לכפתור */}
        <Text className="text-gray-500 text-[10px] text-center mt-3">
          * המזונות שתגדיר כאן יהיו זמינים להוספה מהירה ליומן
        </Text>
      </View>
    </View>
  );
};

export default Foods;
