import { View, Text, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/colors';
import type { NutritionEntry } from '@/src/types/nutrition';

interface Props {
  entries: NutritionEntry[];
  onDelete: (entryId: string) => void;
  isDeleting: boolean;
}

const NutritionEntriesList = ({ entries, onDelete, isDeleting }: Props) => {
  if (entries.length === 0) {
    return (
      <View className="bg-background-800 rounded-2xl p-6 border border-background-600">
        <Text className="text-background-400 text-center">
          עדיין לא נוספו מזונות היום
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-background-800 rounded-2xl p-4 border border-background-600">
      <Text className="text-white text-lg font-bold mb-4 text-right">
        מזונות שנוספו היום
      </Text>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <View className="bg-background-700 rounded-xl p-4">
            <View className="flex-row-reverse items-start justify-between mb-2">
              <Text className="text-white text-base font-bold flex-1">
                {item.food_name}
              </Text>
              <Pressable
                onPress={() => onDelete(item.id)}
                disabled={isDeleting}
                className="ml-2"
              >
                <Ionicons name="trash-outline" size={20} color={colors.red[500]} />
              </Pressable>
            </View>

            <Text className="text-background-400 text-xs mb-3 text-right">
              {item.portion_size} {item.portion_unit}
            </Text>

            <View className="flex-row-reverse gap-4">
              <View className="items-center">
                <Text className="text-lime-500 text-sm font-bold">{item.protein}g</Text>
                <Text className="text-background-400 text-xs">חלבון</Text>
              </View>

              <View className="items-center">
                <Text className="text-orange-500 text-sm font-bold">{item.carbs}g</Text>
                <Text className="text-background-400 text-xs">פחמימות</Text>
              </View>

              <View className="items-center">
                <Text className="text-red-500 text-sm font-bold">{item.fat}g</Text>
                <Text className="text-background-400 text-xs">שומן</Text>
              </View>

              <View className="items-center">
                <Text className="text-white text-sm font-bold">{item.calories}</Text>
                <Text className="text-background-400 text-xs">קלוריות</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default NutritionEntriesList;
