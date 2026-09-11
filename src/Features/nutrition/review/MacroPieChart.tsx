import { colors } from '@/colors';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const PROTEIN_COLOR = 'rgb(96, 165, 250)';
const CALORIES_COLOR = colors.lime[500];

const CHART_SIZE = 200;

interface Props {
  proteinConsumed: number;
  proteinGoal: number;
  caloriesConsumed: number;
  caloriesGoal: number;
  isManualCalories: boolean;
  onEditCalories: () => void;
  onEditProtein: () => void;
}

type Metric = 'protein' | 'calories';

const MacroPieChart = ({
  proteinConsumed,
  proteinGoal,
  caloriesConsumed,
  caloriesGoal,
  isManualCalories,
  onEditCalories,
  onEditProtein,
}: Props) => {
  const [metric, setMetric] = useState<Metric>('calories');
  const isProtein = metric === 'protein';
  const consumed = isProtein ? proteinConsumed : caloriesConsumed;
  const goal = isProtein ? proteinGoal : caloriesGoal;
  const unit = isProtein ? 'ג׳' : 'קק״ל';
  const color = isProtein ? PROTEIN_COLOR : CALORIES_COLOR;
  const pct = goal > 0 ? Math.min(100, Math.round((consumed / goal) * 100)) : 0;
  const remaining = Math.max(0, goal - consumed);
  const pieData = useMemo(() => {
    if (consumed === 0) {
      return [
        {
          value: 1,
          color: colors.background[600],
          text: '',
          tooltipText: isProtein ? 'עוד לא אכלת חלבון היום' : 'עוד לא צרכת קלוריות היום',
        },
      ];
    }
    return [
      {
        value: consumed,
        color,
        text: '',
        tooltipText: `נצרך: ${consumed}${unit}`,
      },
      {
        value: remaining,
        color: colors.background[600],
        text: '',
        tooltipText: remaining > 0 ? `נותר: ${remaining}${unit}` : 'השגת את היעד!',
      },
    ];
  }, [color, consumed, isProtein, remaining, unit]);

  return (
    <View className="bg-background-800 rounded-2xl p-5 mb-4 border border-background-600 items-center">
      <View className="w-full mb-4">
        <Text className="typo-h4 text-white">
          {isProtein ? 'יעד חלבון יומי' : 'יעד קלוריות יומי'}
        </Text>
        <View className="items-end mt-3">
          <View
            className="relative flex-row rounded-full bg-background-950 p-1"
            style={{ width: 172, height: 44, direction: 'ltr' }}
          >
            <Pressable
              onPress={() => setMetric('protein')}
              className="flex-1 items-center justify-center rounded-full"
              style={{ backgroundColor: isProtein ? PROTEIN_COLOR : 'transparent' }}
              accessibilityRole="radio"
              accessibilityLabel="הצג חלבון"
              accessibilityState={{ selected: isProtein }}
            >
              <Text
                className="typo-caption-bold"
                style={{ color: isProtein ? colors.background[950] : colors.background[400] }}
              >
                חלבון
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMetric('calories')}
              className="flex-1 items-center justify-center rounded-full"
              style={{ backgroundColor: !isProtein ? CALORIES_COLOR : 'transparent' }}
              accessibilityRole="radio"
              accessibilityLabel="הצג קלוריות"
              accessibilityState={{ selected: !isProtein }}
            >
              <Text
                className="typo-caption-bold"
                style={{ color: !isProtein ? colors.background[950] : colors.background[400] }}
              >
                קלוריות
              </Text>
            </Pressable>
          </View>
        </View>
        {!isProtein && (
          <Pressable
            onPress={onEditCalories}
            className="self-end px-1 py-2"
            accessibilityRole="button"
            accessibilityLabel="עריכת יעד קלוריות יומי"
            accessibilityHint="פותח חלון להזנת יעד קלוריות ידני או חזרה לחישוב אוטומטי"
          >
            <Text className="typo-caption-bold text-lime-500">
              {isManualCalories ? 'עריכת יעד ידני' : 'עריכת יעד'}
            </Text>
          </Pressable>
        )}
        {isProtein && (
          <Pressable
            onPress={onEditProtein}
            className="self-end px-1 py-2"
            accessibilityRole="button"
            accessibilityLabel="עריכת יעד חלבון יומי"
            accessibilityHint="פותח חלון לעדכון כמות החלבון לכל ק״ג משקל"
          >
            <Text className="typo-caption-bold" style={{ color: PROTEIN_COLOR }}>
              עריכת יעד
            </Text>
          </Pressable>
        )}
      </View>

      <View
        className="items-center justify-center mb-5"
        style={{ width: CHART_SIZE, height: CHART_SIZE }}
      >
        <PieChart
          data={pieData}
          donut
          radius={100}
          backgroundColor={colors.background[800]}
          innerRadius={68}
          showText={false}
          showTooltip
          tooltipDuration={1200}
          strokeColor={colors.background[800]}
          strokeWidth={3}
          tooltipBackgroundColor={colors.background[700]}
          tooltipBorderRadius={10}
          centerLabelComponent={() => (
            <View className="items-center justify-center gap-0.5">
              <Text className="typo-h2 text-white leading-tight">{consumed}</Text>
              <Text className="typo-caption-bold text-background-400 leading-tight">
                {isProtein ? 'חלבון' : 'קלוריות'}
              </Text>
              <Text className="typo-caption text-background-400 leading-tight">מתוך {goal}</Text>
              <Text className="typo-caption-bold leading-tight" style={{ color }}>
                {pct}%
              </Text>
            </View>
          )}
        />
      </View>

      <View className="flex-row items-center justify-between w-full">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <Text className="typo-label text-white">נצרך</Text>
        </View>
        <Text className="typo-label text-background-400">
          {consumed}
          {unit}
        </Text>
      </View>

      <View className="flex-row items-center justify-between w-full mt-2">
        <View className="flex-row items-center gap-2">
          <View
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.background[600] }}
          />
          <Text className="typo-label text-white">נותר</Text>
        </View>
        <Text className="typo-label text-background-400">
          {remaining > 0 ? `${remaining}${unit}` : '✓ השגת יעד'}
        </Text>
      </View>
    </View>
  );
};

export default MacroPieChart;
