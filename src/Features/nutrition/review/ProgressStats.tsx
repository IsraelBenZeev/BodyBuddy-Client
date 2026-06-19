import { colors } from '@/colors';
import { calculateProgress, calculateRemaining } from '@/src/utils/calculateNutritionMetrics';
import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  label: string;
  consumed: number;
  goal: number;
  unit: string;
  color: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onHide?: () => void;
}

const toRgba = (rgb: string, alpha: number): string =>
  rgb.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);

const ProgressStats = ({ label, consumed, goal, unit, color, iconName, onHide }: Props) => {
  const remaining = calculateRemaining(goal, consumed);
  const progress = calculateProgress(goal, consumed);
  const isOver = consumed > goal;
  const overage = isOver ? Math.round(consumed - goal) : 0;
  const overagePercent = isOver && goal > 0 ? ((consumed - goal) / goal) * 100 : 0;
  const displayPercent = goal === 0 ? 0 : Math.round((consumed / goal) * 100);

  const overageColor = overagePercent >= 15 ? colors.red[400] : colors.orange[400];
  const barColor = isOver ? overageColor : color;

  return (
    <View
      className="bg-background-800 rounded-2xl p-4 mb-3"
      style={{ borderWidth: 1, borderColor: isOver ? toRgba(overageColor, 0.4) : '#3f3f46' }}
    >
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Ionicons
            name={isOver ? 'warning-outline' : iconName}
            size={20}
            color={isOver ? overageColor : color}
          />
          <Text className="typo-body-primary text-white">{label}</Text>
        </View>

        <View className="flex-row items-center gap-2">
          {onHide && (
            <Pressable
              onPress={onHide}
              className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.10)',
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={`הסתר ${label}`}
            >
              <Ionicons name="eye-outline" size={13} color={colors.background[400]} />
              <Text className="typo-caption text-background-400">הסתר</Text>
            </Pressable>
          )}
          <View className="flex-row items-center">
            <Text className="typo-label mr-1" style={{ color: isOver ? overageColor : colors.background[50] }}>
              {consumed}
            </Text>
            <Text className="typo-caption text-background-400 mx-1">מתוך</Text>
            <Text className="typo-label text-background-400 mr-1">{goal}</Text>
            <Text className="typo-caption text-background-400">{unit}</Text>
          </View>
        </View>
      </View>

      {/* Progress bar */}
      <View className="bg-background-700 rounded-full h-3 overflow-hidden mb-2">
        <View
          className="h-full rounded-full"
          style={{ width: `${progress}%`, backgroundColor: barColor }}
        />
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between">
        {isOver ? (
          <View className="flex-row items-center gap-1">
            <Ionicons name="arrow-up-circle" size={14} color={overageColor} />
            <Text className="typo-caption" style={{ color: overageColor }}>
              חריגה: +{overage} {unit}
            </Text>
          </View>
        ) : (
          <Text className="typo-caption text-background-400">
            נותר: {remaining} {unit}
          </Text>
        )}
        <Text className="typo-caption-bold" style={{ color: isOver ? overageColor : colors.background[400] }}>
          {displayPercent}%
        </Text>
      </View>

      {isOver && (
        <View
          className="mt-3 rounded-xl p-3 flex-row items-center gap-2"
          style={{ backgroundColor: toRgba(overageColor, 0.1) }}
        >
          <Ionicons
            name={overagePercent >= 15 ? 'alert-circle-outline' : 'information-circle-outline'}
            size={16}
            color={overageColor}
          />
          <Text className="typo-label flex-1 text-left" style={{ color: overageColor }}>
            {overagePercent >= 15
              ? 'עברת את היעד בצורה משמעותית – שים לב מחר'
              : 'קצת מעל היעד'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default memo(ProgressStats);
