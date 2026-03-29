import { memo } from 'react';
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
          <Text className="typo-body-primary text-white mr-2">{label}</Text>
        </View>
        <View className="flex-row-reverse items-center space-x-1 space-x-reverse">
          <Text className="typo-label text-background-400">
            {consumed}
          </Text>
          <Text className="typo-caption text-background-400 mx-1">מתוך</Text>
          <Text className="typo-label text-background-400">
            {goal}
          </Text>
          <Text className="typo-caption text-background-400 mr-1">{unit}</Text>
        </View>
      </View>

      <View className="bg-background-700 rounded-full h-3 overflow-hidden mb-2">
        <View
          className="h-full rounded-full"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </View>

      <View className="flex-row-reverse items-center justify-between">
        <Text className="typo-caption text-background-400">
          נותר: {remaining} {unit}
        </Text>
        <Text className="typo-caption-bold text-background-400">{progress}%</Text>
      </View>
    </View>
  );
};

export default memo(ProgressStats);
