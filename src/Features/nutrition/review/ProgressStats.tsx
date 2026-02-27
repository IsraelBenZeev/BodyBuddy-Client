import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calculateRemaining, calculateProgress } from '@/src/utils/calculateNutritionMetrics';

interface Props {
  label: string;
  consumed: number;
  goal: number;
  unit: string;
  color: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const ProgressStats = ({ label, consumed, goal, unit, color, iconName }: Props) => {
  const remaining = calculateRemaining(goal, consumed);
  const progress = calculateProgress(goal, consumed);

  return (
    <View className="bg-background-800 rounded-2xl p-4 mb-3 border border-background-600">
      <View className="flex-row-reverse items-center justify-between mb-3">
        <View className="flex-row-reverse items-center">
          <Ionicons name={iconName} size={20} color={color} />
          <Text className="text-white text-base font-bold mr-2">{label}</Text>
        </View>
        <View className="flex-row-reverse items-center space-x-1 space-x-reverse">
          <Text className="text-background-400 text-sm font-bold">
            {consumed}
          </Text>
          <Text className="text-background-400 text-xs mx-1">מתוך</Text>
          <Text className="text-background-400 text-sm">
            {goal}
          </Text>
          <Text className="text-background-400 text-xs mr-1">{unit}</Text>
        </View>
      </View>

      <View className="bg-background-700 rounded-full h-3 overflow-hidden mb-2">
        <View
          className="h-full rounded-full"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </View>

      <View className="flex-row-reverse items-center justify-between">
        <Text className="text-background-400 text-xs">
          נותר: {remaining} {unit}
        </Text>
        <Text className="text-background-400 text-xs font-bold">{progress}%</Text>
      </View>
    </View>
  );
};

export default ProgressStats;
