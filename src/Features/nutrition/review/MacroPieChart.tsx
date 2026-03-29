import { colors } from '@/colors';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const CHART_SIZE = 200;

interface Props {
  proteinConsumed: number;
  proteinGoal: number;
}

const MacroPieChart = ({ proteinConsumed, proteinGoal }: Props) => {
  const pct = proteinGoal > 0 ? Math.min(100, Math.round((proteinConsumed / proteinGoal) * 100)) : 0;
  const remaining = Math.max(0, proteinGoal - proteinConsumed);

  const pieData = useMemo(() => {
    if (proteinConsumed === 0) {
      return [{ value: 1, color: colors.background[600], text: '', tooltipText: 'עוד לא אכלת חלבון היום' }];
    }
    return [
      {
        value: proteinConsumed,
        color: colors.lime[500],
        text: '',
        tooltipText: `נצרך: ${proteinConsumed}ג׳`,
      },
      {
        value: remaining,
        color: colors.background[600],
        text: '',
        tooltipText: remaining > 0 ? `נותר: ${remaining}ג׳` : 'השגת את היעד!',
      },
    ];
  }, [proteinConsumed, remaining]);

  return (
    <View className="bg-background-800 rounded-2xl p-5 mb-4 border border-background-600 items-center">
      <Text className="typo-h4 text-white mb-4 text-right w-full">יעד חלבון יומי</Text>

      <View className="items-center justify-center mb-5" style={{ width: CHART_SIZE, height: CHART_SIZE }}>
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
              <Text className="typo-h2 text-white leading-tight">
                {proteinConsumed}ג׳
              </Text>
              <Text className="typo-caption text-background-400 leading-tight">
                מתוך {proteinGoal}ג׳
              </Text>
              <Text
                className="typo-caption-bold leading-tight"
                style={{ color: pct >= 100 ? colors.lime[400] : colors.lime[500] }}
              >
                {pct}%
              </Text>
            </View>
          )}
        />
      </View>

      <View className="flex-row-reverse items-center justify-between w-full">
        <View className="flex-row-reverse items-center gap-2">
          <View className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.lime[500] }} />
          <Text className="typo-label text-white">נצרך</Text>
        </View>
        <Text className="typo-label text-background-400">{proteinConsumed}ג׳</Text>
      </View>

      <View className="flex-row-reverse items-center justify-between w-full mt-2">
        <View className="flex-row-reverse items-center gap-2">
          <View className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.background[600] }} />
          <Text className="typo-label text-white">נותר</Text>
        </View>
        <Text className="typo-label text-background-400">
          {remaining > 0 ? `${remaining}ג׳` : '✓ השגת יעד'}
        </Text>
      </View>
    </View>
  );
};

export default MacroPieChart;
