import AddNewFood from '@/src/Features/nutrition/add/food/AddNewFoodForm';
import AddNewFoodSelection from '@/src/Features/nutrition/add/food/AddNewFoodSelection';
import { getCategoryIconName } from '@/src/Features/nutrition/add/food/foodCategories';
import type { CreateFoodFormData, FoodItem } from '@/src/types/nutrition';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, Pressable, Text, View } from 'react-native';

export type AddStep = 'list' | 'amount' | 'create';

export interface ListFoodForMealBuilderProps {
  addStep: AddStep;
  setAddStep: (step: AddStep) => void;
  selectedFood: FoodItem | null;
  nameMeal: string;
  closeAddModal: () => void;
  foodItems: FoodItem[];
  onSelectFood: (food: FoodItem) => void;
  addItemFromPortion: (amount: number, portionUnit: 'g' | 'unit') => void;
  onNewFoodSubmit: (data: CreateFoodFormData) => void;
  isCreatingFood: boolean;
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
  onNewFoodSubmit,
  isCreatingFood,
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
            {addStep === 'list' ? 'בחירת מאכל' : addStep === 'amount' ? 'כמות והגשה' : 'מאכל חדש'}
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
          onPress={() => (addStep !== 'list' ? setAddStep('list') : closeAddModal())}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          className="bg-background-800 w-11 h-11 rounded-2xl items-center justify-center border border-white/10 shadow-lg"
          accessibilityRole="button"
          accessibilityLabel={addStep !== 'list' ? 'חזרה לרשימה' : 'סגור'}
        >
          <Ionicons name={addStep !== 'list' ? 'arrow-forward' : 'close'} size={24} color="#fff" />
        </Pressable>
      </View>

      {addStep === 'create' ? (
        <AddNewFood
          mode="meal-builder"
          onSubmit={(data) => onNewFoodSubmit(data)}
          isPending={isCreatingFood}
          onBack={() => setAddStep('list')}
        />
      ) : addStep === 'list' ? (
        <View className="flex-1">
          {/* כפתור יצירת מאכל חדש */}
          <Pressable
            onPress={() => setAddStep('create')}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="mx-6 mt-4 mb-2 flex-row-reverse items-center justify-center bg-lime-500/10 border border-lime-500/30 border-dashed rounded-2xl py-3.5"
            accessibilityRole="button"
            accessibilityLabel="הוסף מאכל חדש לרשימה"
          >
            <Ionicons name="add-circle-outline" size={20} color="#84cc16" />
            <Text className="text-lime-400 font-bold text-sm mr-2">הוסף מאכל חדש לרשימה</Text>
          </Pressable>

          <FlatList
            data={foodItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60, paddingTop: 8 }}
            ItemSeparatorComponent={() => <View className="h-4" />}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            maxToRenderPerBatch={5}
            removeClippedSubviews={true}
            ListEmptyComponent={() => (
              <View className="items-center justify-center mt-20">
                <View className="bg-background-800 p-6 rounded-full mb-4">
                  <Ionicons name="file-tray-outline" size={40} color="#374151" />
                </View>
                <Text className="text-gray-500 font-bold text-lg">הרשימה ריקה</Text>
                <Text className="text-gray-600 text-sm mt-1 text-center px-10">
                  לחץ על &quot;הוסף מאכל חדש&quot; למעלה כדי להתחיל
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSelectFood(item)}
                style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}
                className="bg-background-800 border-b-4 border-black/20 rounded-3xl p-4 flex-row-reverse items-center"
                accessibilityRole="button"
                accessibilityLabel={`${item.name} - בחר מאכל`}
              >
                {/* אייקון מאכל מעוצב */}
                <View className="bg-orange-500/20 w-14 h-14 rounded-2xl items-center justify-center ml-4 shadow-inner">
                  <MaterialCommunityIcons
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
                        {item.measurement_type === 'units'
                          ? item.calories_per_unit
                          : item.calories_per_100}{' '}
                        קק״ל
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-[10px] text-right mr-2 font-medium">
                      {item.measurement_type === 'units'
                        ? `ליחידה`
                        : 'ל-100 ג׳'}
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
