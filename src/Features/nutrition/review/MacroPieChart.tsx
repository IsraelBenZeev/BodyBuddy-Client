import { colors } from '@/colors';
import type { MacroSplit } from '@/src/types/nutrition';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const CHART_SIZE = 200;
const INNER_RADIUS = 60;

interface Props {
  macroSplit: MacroSplit;
  /** קלוריות שנצרכו היום – מוצג במרכז הטבעת */
  caloriesConsumed?: number;
  /** יעד קלוריות יומי – אופציונלי, להצגת "X / Y" */
  caloriesGoal?: number;
}

type DisplayMode = 'percentage' | 'grams';

const MacroPieChart = ({ macroSplit, caloriesConsumed, caloriesGoal }: Props) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('percentage');
  const showCenterCalories =
    typeof caloriesConsumed === 'number' && caloriesConsumed >= 0;

  const pieData = useMemo(() => {
    const { protein, carbs, fat } = macroSplit;
    const v = (n: number) =>
      displayMode === 'percentage' ? `${n}%` : `${n}g`;
    return [
      {
        value: displayMode === 'percentage' ? protein.percentage : protein.grams,
        color: colors.lime[500],
        text: v(displayMode === 'percentage' ? protein.percentage : protein.grams),
        tooltipText: `חלבון: ${v(displayMode === 'percentage' ? protein.percentage : protein.grams)}`,
      },
      {
        value: displayMode === 'percentage' ? carbs.percentage : carbs.grams,
        color: colors.orange[500],
        text: v(displayMode === 'percentage' ? carbs.percentage : carbs.grams),
        tooltipText: `פחמימות: ${v(displayMode === 'percentage' ? carbs.percentage : carbs.grams)}`,
      },
      {
        value: displayMode === 'percentage' ? fat.percentage : fat.grams,
        color: colors.red[500],
        text: v(displayMode === 'percentage' ? fat.percentage : fat.grams),
        tooltipText: `שומן: ${v(displayMode === 'percentage' ? fat.percentage : fat.grams)}`,
      },
    ];
  }, [macroSplit, displayMode]);

  return (
    <View className="bg-background-800 rounded-2xl p-5 mb-4 border border-background-600 items-center justify-center">
      <Text className="text-white text-lg font-bold mb-4 text-right">
        פילוח מקרו נוטריינטים
      </Text>

      <View
        className="items-center justify-center mb-4"
        style={{ width: CHART_SIZE, height: CHART_SIZE }}
      >
        <PieChart
          data={pieData}
          donut
          radius={100}
          backgroundColor={colors.background[800]}
          innerRadius={70}
          showText={false}
          showTooltip
          tooltipDuration={1000}
          textSize={14}
          strokeColor={colors.background[600]}
          tooltipBackgroundColor={colors.background[800]}
          tooltipBorderRadius={12}
        />
      </View>

      <View className="space-y-2 mb-4 w-full">
        <View className="flex-row-reverse items-center justify-between">
          <View className="flex-row-reverse items-center gap-1">
            <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colors.lime[500] }} />
            <Text className="text-white text-sm">חלבון</Text>
          </View>
          <Text className="text-background-400 text-sm">{pieData[0].text}</Text>
        </View>

        <View className="flex-row-reverse items-center justify-between">
          <View className="flex-row-reverse items-center gap-1">
            <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colors.orange[500] }} />
            <Text className="text-white text-sm">פחמימות</Text>
          </View>
          <Text className="text-background-400 text-sm">{pieData[1].text}</Text>
        </View>

        <View className="flex-row-reverse items-center justify-between ">
          <View className="flex-row-reverse items-center gap-1">
            <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colors.red[500] }} />
            <Text className="text-white text-sm">שומן</Text>
          </View>
          <Text className="text-background-400 text-sm">{pieData[2].text}</Text>
        </View>
      </View>

      <Pressable
        onPress={() => setDisplayMode(prev => prev === 'percentage' ? 'grams' : 'percentage')}
        className="bg-background-700 border border-lime-500/30 rounded-xl py-3 w-full"
      >
        <Text className="text-lime-500 font-bold text-center text-sm">
          {displayMode === 'percentage' ? 'הצג בגרמים' : 'הצג באחוזים'}
        </Text>
      </Pressable>
    </View>
  );
};

export default MacroPieChart;
