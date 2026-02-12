import AddNewFoodSelection from '@/src/Features/nutrition/add/AddNewFoodSelection';
import { getCategoryIconName } from '@/src/Features/nutrition/add/foodCategories';
import type { FoodItem } from '@/src/types/nutrition';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, Text, View } from 'react-native';

export type AddStep = 'list' | 'amount';

export interface ListFoodForMealBuilderProps {
  addStep: AddStep;
  setAddStep: (step: AddStep) => void;
  selectedFood: FoodItem | null;
  nameMeal: string;
  closeAddModal: () => void;
  foodItems: FoodItem[];
  onSelectFood: (food: FoodItem) => void;
  addItemFromPortion: (portionGrams: number) => void;
}

const ListFoodForMealBuilder = ({
  addStep,
  setAddStep,
  selectedFood,
  nameMeal,
  closeAddModal,
  foodItems,
  onSelectFood,
  addItemFromPortion,
}: ListFoodForMealBuilderProps) => {
  return (
        <View className="flex-1 bg-background-950">
        {/* Handle עליון - נותן תחושה של דף נשלף */}
        <View className="items-center pt-3 pb-1">
          <View className="w-12 h-1.5 bg-white/10 rounded-full" />
        </View>

        {/* Header - משופר עם היררכיה ברורה */}
        <View className="flex-row-reverse items-center justify-between px-6 py-4 border-b border-white/5">
          <View className="flex-1">
            <Text className="text-white text-2xl font-black text-right tracking-tight">
              {addStep === 'list' ? 'בחירת מאכל' : 'כמות והגשה'}
            </Text>
            {addStep === 'amount' && selectedFood && (
              <View className="flex-row-reverse items-center mt-1">
                <Ionicons name="cart-outline" size={12} color="#84cc16" />
                <Text className="text-lime-500 text-[11px] font-bold text-right mr-1 uppercase tracking-tighter">
                  מוסיף ל: {nameMeal || 'ארוחה חדשה'}
                </Text>
              </View>
            )}
          </View>

          <Pressable
            onPress={() => (addStep === 'amount' ? setAddStep('list') : closeAddModal())}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="bg-background-800 w-11 h-11 rounded-2xl items-center justify-center border border-white/10 shadow-lg"
          >
            <Ionicons
              name={addStep === 'amount' ? 'arrow-forward' : 'close'}
              size={24}
              color="#fff"
            />
          </Pressable>
        </View>

        {addStep === 'list' ? (
          <View className="flex-1">
            {/* שורת חיפוש דמו (אופציונלי) - מוסיף המון לסטייל */}
            {/* <View className="px-6 py-4">
              <View className="bg-background-800 rounded-2xl flex-row-reverse items-center px-4 py-3 border border-white/5">
                <Ionicons name="search" size={18} color="#6b7280" />
                <Text className="text-gray-500 text-right mr-3 flex-1 text-sm font-medium">
                  חפש ברשימה שלך...
                </Text>
              </View>
            </View> */}

            <FlatList
              data={foodItems}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
              ItemSeparatorComponent={() => <View className="h-4" />}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View className="items-center justify-center mt-32">
                  <View className="bg-background-800 p-6 rounded-full mb-4">
                    <Ionicons name="file-tray-outline" size={40} color="#374151" />
                  </View>
                  <Text className="text-gray-500 font-bold text-lg">הרשימה ריקה</Text>
                  <Text className="text-gray-600 text-sm mt-1 text-center px-10">
                    הוסף מאכלים בטאב הראשי כדי שיופיעו כאן
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onSelectFood(item)}
                  style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}
                  className="bg-background-800 border-b-4 border-black/20 rounded-3xl p-4 flex-row-reverse items-center"
                >
                  {/* אייקון מאכל מעוצב */}
                  <View className="bg-orange-500/20 w-14 h-14 rounded-2xl items-center justify-center ml-4 shadow-inner">
                    <Ionicons
                      name={getCategoryIconName(item.category)}
                      size={28}
                      color="#fb923c"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-white font-black text-lg text-right tracking-tight">
                      {item.name}
                    </Text>
                    <View className="flex-row-reverse items-center mt-1.5">
                      <View className="bg-background-900 px-2 py-0.5 rounded-md border border-white/5">
                        <Text className="text-orange-400 text-[11px] font-black">
                          {item.calories_per_100} קק״ל
                        </Text>
                      </View>
                      <Text className="text-gray-500 text-[10px] text-right mr-2 font-medium">
                        ל-100 ג׳
                      </Text>
                    </View>
                  </View>

                  <View className="bg-background-700 w-8 h-8 rounded-full items-center justify-center">
                    <Ionicons name="chevron-back" size={14} color="#9ca3af" />
                  </View>
                </Pressable>
              )}
            />
          </View>
        ) : selectedFood ? (
          <View className="flex-1">
            {/* PortionSelector מקבל רקע כהה יותר לעומק */}
            <AddNewFoodSelection
              foodItem={selectedFood}
              onSubmit={addItemFromPortion}
              isPending={false}
              onBack={() => setAddStep('list')}
              submitLabel="הוסף לארוחה"
            />
          </View>
        ) : null}
      </View>
  );
};
export default ListFoodForMealBuilder;