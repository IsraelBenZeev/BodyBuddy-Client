import { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { colors } from '@/colors';
import type { MacroSplit } from '@/src/types/nutrition';

interface Props {
  macroSplit: MacroSplit;
}

type DisplayMode = 'percentage' | 'grams';

const MacroPieChart = ({ macroSplit }: Props) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('percentage');

  const pieData = useMemo(() => {
    const { protein, carbs, fat } = macroSplit;
    return [
      {
        value: displayMode === 'percentage' ? protein.percentage : protein.grams,
        color: colors.lime[500],
        text: displayMode === 'percentage' ? `${protein.percentage}%` : `${protein.grams}g`,
      },
      {
        value: displayMode === 'percentage' ? carbs.percentage : carbs.grams,
        color: colors.orange[500],
        text: displayMode === 'percentage' ? `${carbs.percentage}%` : `${carbs.grams}g`,
      },
      {
        value: displayMode === 'percentage' ? fat.percentage : fat.grams,
        color: colors.red[500],
        text: displayMode === 'percentage' ? `${fat.percentage}%` : `${fat.grams}g`,
      },
    ];
  }, [macroSplit, displayMode]);

  return (
    <View className="bg-background-800 rounded-2xl p-5 mb-4 border border-background-600">
      <Text className="text-white text-lg font-bold mb-4 text-right">
        פילוח מקרו נוטריינטים
      </Text>

      <View className="items-center mb-4">
        <PieChart
          data={pieData}
          donut
          radius={100}
          innerRadius={60}
          showText
          textColor="white"
          textSize={14}
        />
      </View>

      <View className="space-y-2 mb-4">
        <View className="flex-row-reverse items-center justify-between">
          <View className="flex-row-reverse items-center">
            <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colors.lime[500] }} />
            <Text className="text-white text-sm">חלבון</Text>
          </View>
          <Text className="text-background-400 text-sm">{pieData[0].text}</Text>
        </View>

        <View className="flex-row-reverse items-center justify-between">
          <View className="flex-row-reverse items-center">
            <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colors.orange[500] }} />
            <Text className="text-white text-sm">פחמימות</Text>
          </View>
          <Text className="text-background-400 text-sm">{pieData[1].text}</Text>
        </View>

        <View className="flex-row-reverse items-center justify-between">
          <View className="flex-row-reverse items-center">
            <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colors.red[500] }} />
            <Text className="text-white text-sm">שומן</Text>
          </View>
          <Text className="text-background-400 text-sm">{pieData[2].text}</Text>
        </View>
      </View>

      <Pressable
        onPress={() => setDisplayMode(prev => prev === 'percentage' ? 'grams' : 'percentage')}
        className="bg-background-700 border border-lime-500/30 rounded-xl py-3"
      >
        <Text className="text-lime-500 font-bold text-center text-sm">
          {displayMode === 'percentage' ? 'הצג בגרמים' : 'הצג באחוזים'}
        </Text>
      </Pressable>
    </View>
  );
};

export default MacroPieChart;
