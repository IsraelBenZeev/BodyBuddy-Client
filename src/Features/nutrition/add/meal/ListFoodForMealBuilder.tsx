import AddNewFood, { type Phase } from '@/src/Features/nutrition/add/food/AddNewFoodForm';
import AddNewFoodSelection from '@/src/Features/nutrition/add/food/AddNewFoodSelection';
import { getCategoryIconName } from '@/src/Features/nutrition/add/food/foodCategories';
import type { CreateFoodFormData, FoodItem } from '@/src/types/nutrition';
import ActionButton from '@/src/ui/ActionButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

type Step = 'list' | 'amount' | 'create';

export interface ListFoodForMealBuilderProps {
  nameMeal: string;
  closeAddModal: () => void;
  foodItems: FoodItem[];
  addItemFromPortion: (food: FoodItem, amount: number, portionUnit: 'g' | 'unit') => void;
  onNewFoodSubmit: (data: CreateFoodFormData) => void;
  onAddFoodFromDB: (food: FoodItem, amount: number) => void;
  isCreatingFood: boolean;
}

const ListFoodForMealBuilder = ({
  nameMeal,
  closeAddModal,
  foodItems,
  addItemFromPortion,
  onNewFoodSubmit,
  onAddFoodFromDB,
  isCreatingFood,
}: ListFoodForMealBuilderProps) => {
  const [step, setStep] = useState<Step>('list');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [formPhase, setFormPhase] = useState<Phase>('search');

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setStep('amount');
  };

  const handleBack = () => {
    if (step !== 'list') {
      setStep('list');
    } else {
      closeAddModal();
    }
  };

  const isCreateFormInProgress = step === 'create' && formPhase !== 'search';

  return (
    <View className="flex-1 bg-background-950">
      {/* Handle עליון - נותן תחושה של דף נשלף */}
      <View className="items-center pt-3 pb-1">
        <View className="w-12 h-1.5 bg-white/10 rounded-full" />
      </View>

      {/* Header — מוסתר ב-amount כי AddNewFoodSelection מנהלת header משלה */}
      {step !== 'amount' && (
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/5">
          <View className="flex-1 flex-row gap-3 items-center">
            {!isCreateFormInProgress && (
              <Pressable
                onPress={handleBack}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="bg-background-800 w-11 h-11 rounded-2xl items-center justify-center border border-white/10 shadow-lg"
                accessibilityRole="button"
                accessibilityLabel={step !== 'list' ? 'חזרה לרשימה' : 'סגור'}
              >
                <Ionicons
                  name={step !== 'list' ? 'arrow-forward' : 'close'}
                  size={20}
                  color="#fff"
                />
              </Pressable>
            )}
            <View>
              <Text className="typo-h2 text-white tracking-tight">
                {step === 'list' ? 'בחירת מאכל' : 'מאכל חדש'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {step === 'create' ? (
        <AddNewFood
          mode="meal-builder"
          onSubmit={(data) => onNewFoodSubmit(data)}
          onSelectExisting={onAddFoodFromDB}
          isPending={isCreatingFood}
          onBack={() => setStep('list')}
          onPhaseChange={setFormPhase}
        />
      ) : step === 'list' ? (
        <View className="flex-1">
          {/* כפתור יצירת מאכל חדש */}
          <View className="mx-6 mt-4 mb-2">
            <ActionButton
              onPress={() => setStep('create')}
              label="הוסף מאכל חדש לרשימה"
              iconName="add-circle-outline"
              fullWidth
            />
          </View>

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
                <Text className="typo-h4 text-gray-500">הרשימה ריקה</Text>
                <Text className="typo-label text-gray-600 mt-1 text-center px-10">
                  לחץ על &quot;הוסף מאכל חדש&quot; למעלה כדי להתחיל
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectFood(item)}
                style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}
                className="bg-background-800 border-b-4 border-black/20 rounded-3xl p-4 flex-row items-center gap-3 text-left"
                accessibilityRole="button"
                accessibilityLabel={`${item.name} - בחר מאכל`}
              >
                <View className="bg-orange-500/20 w-14 h-14 rounded-2xl items-center justify-center ml-2 shadow-inner">
                  <MaterialCommunityIcons
                    name={getCategoryIconName(item.category)}
                    size={28}
                    color="#fb923c"
                  />
                </View>

                <View className="flex-1 items-start">
                  <Text className="typo-h4 text-white tracking-tight">{item.name}</Text>
                  <View className="flex-row items-center mt-1">
                    <View className="bg-background-900 px-2 py-0.5 rounded-md border border-white/5">
                      <Text className="typo-caption-bold text-orange-400">
                        {item.measurement_type === 'units'
                          ? item.calories_per_unit
                          : item.calories_per_100}{' '}
                        קק״ל
                      </Text>
                    </View>
                    <Text className="typo-caption text-gray-500 text-right mr-2">
                      {item.measurement_type === 'units' ? `ליחידה` : 'ל-100 ג׳'}
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
          <AddNewFoodSelection
            foodItem={selectedFood}
            onSubmit={(amount, portionUnit) => addItemFromPortion(selectedFood, amount, portionUnit)}
            isPending={false}
            onBack={() => setStep('list')}
            submitLabel="הוסף לארוחה"
          />
        </View>
      ) : null}
    </View>
  );
};
export default ListFoodForMealBuilder;
