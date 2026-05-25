import { colors } from '@/colors';
import { ExerciseLogDBType } from '@/src/types/session';
import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Line as SvgLine,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

interface Props {
  logs: ExerciseLogDBType[];
}

type GraphType = 'weight' | 'reps' | 'sets';

interface DataPoint {
  index: number;
  value: number;
}

const CHART_HEIGHT = 220;
const PAD = { top: 38, bottom: 28, left: 16, right: 16 };
const MIN_POINT_SPACING = 60;

const buildCurvePath = (pts: { x: number; y: number }[]) => {
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = (pts[i + 1].x - pts[i].x) / 2.5;
    d += ` C ${pts[i].x + dx} ${pts[i].y}, ${pts[i + 1].x - dx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
};

const GraphData = ({ logs }: Props) => {
  const [activeTab, setActiveTab] = useState<GraphType>('weight');
  const screenWidth = Dimensions.get('window').width;

  const sessionDateMap = useMemo(
    () => new Map(logs.map((l) => [l.session_id, l.created_at])),
    [logs]
  );

  const sortByDate = (a: [string, number], b: [string, number]) => {
    const dateA = sessionDateMap.get(a[0]);
    const dateB = sessionDateMap.get(b[0]);
    if (dateA && dateB) return new Date(dateA).getTime() - new Date(dateB).getTime();
    return a[0].localeCompare(b[0]);
  };

  const weightData = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    const s: Record<string, number> = {};
    logs.forEach((l) => {
      if (!s[l.session_id] || l.weight > s[l.session_id]) s[l.session_id] = l.weight;
    });
    return Object.entries(s)
      .sort(sortByDate)
      .map(([, value], i) => ({ index: i + 1, value }));
  }, [logs, sessionDateMap]);

  const repsData = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    const s: Record<string, number> = {};
    logs.forEach((l) => {
      if (!s[l.session_id] || l.reps > s[l.session_id]) s[l.session_id] = l.reps;
    });
    return Object.entries(s)
      .sort(sortByDate)
      .map(([, value], i) => ({ index: i + 1, value }));
  }, [logs, sessionDateMap]);

  const setsData = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    const s: Record<string, number> = {};
    logs.forEach((l) => {
      s[l.session_id] = (s[l.session_id] || 0) + 1;
    });
    return Object.entries(s)
      .sort(sortByDate)
      .map(([, value], i) => ({ index: i + 1, value }));
  }, [logs, sessionDateMap]);

  const handleTabPress = useCallback((type: GraphType) => setActiveTab(type), []);

  const getTabLabel = (type: GraphType) => {
    switch (type) {
      case 'weight': return 'משקל';
      case 'reps': return 'חזרות';
      case 'sets': return 'סטים';
    }
  };

  const currentData: DataPoint[] = useMemo(() => {
    switch (activeTab) {
      case 'weight': return weightData;
      case 'reps': return repsData;
      case 'sets': return setsData;
    }
  }, [activeTab, weightData, repsData, setsData]);

  if (!logs || logs.length === 0 || currentData.length === 0) return null;

  const containerPadding = 32;
  const innerWidth = Math.max(
    screenWidth - containerPadding - PAD.left - PAD.right,
    currentData.length * MIN_POINT_SPACING
  );
  const svgWidth = innerWidth + PAD.left + PAD.right;
  const chartH = CHART_HEIGHT - PAD.top - PAD.bottom;

  const maxVal = Math.max(...currentData.map((d) => d.value));
  const range = maxVal || 1;

  const getX = (i: number) =>
    PAD.left + (currentData.length === 1 ? innerWidth / 2 : (i / (currentData.length - 1)) * innerWidth);
  const getY = (val: number) => PAD.top + chartH - (val / range) * chartH;

  const svgPts = currentData.map((d, i) => ({ x: getX(i), y: getY(d.value) }));
  const linePath = buildCurvePath(svgPts);
  const areaPath =
    linePath +
    ` L ${svgPts[svgPts.length - 1].x} ${PAD.top + chartH}` +
    ` L ${svgPts[0].x} ${PAD.top + chartH} Z`;

  return (
    <View className="mb-4">
      <View className="flex-row gap-2 mb-4">
        {(['weight', 'reps', 'sets'] as GraphType[]).map((type) => (
          <Pressable
            key={type}
            onPress={() => handleTabPress(type)}
            className={`flex-1 py-2 px-3 rounded-xl border ${
              activeTab === type
                ? 'bg-lime-500/20 border-lime-500/50'
                : 'bg-zinc-800/50 border-zinc-700/50'
            }`}
            accessibilityLabel={`הצג גרף ${getTabLabel(type)}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === type }}
          >
            <Text
              className={`typo-label text-center font-semibold ${
                activeTab === type ? 'text-lime-500' : 'text-zinc-400'
              }`}
            >
              {getTabLabel(type)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden" style={{ height: CHART_HEIGHT }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEventThrottle={16}>
          <Svg width={svgWidth} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={colors.lime[500]} stopOpacity="0.4" />
                <Stop offset="100%" stopColor={colors.lime[500]} stopOpacity="0.01" />
              </LinearGradient>
            </Defs>

            {svgPts.map(({ x }, i) => (
              <SvgLine
                key={`grid-${i}`}
                x1={x}
                y1={PAD.top}
                x2={x}
                y2={PAD.top + chartH}
                stroke={colors.background[700]}
                strokeWidth="1"
              />
            ))}

            <Path d={areaPath} fill="url(#areaGrad)" />

            <Path
              d={linePath}
              fill="none"
              stroke={colors.lime[500]}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {svgPts.map(({ x, y }, i) => (
              <React.Fragment key={`pt-${i}`}>
                <Circle cx={x} cy={y} r={5} fill={colors.lime[500]} />
                <SvgText
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fill={colors.background[300]}
                  fontSize="11"
                >
                  {currentData[i].value}
                </SvgText>
              </React.Fragment>
            ))}

            {currentData.map((d, i) => (
              <SvgText
                key={`xl-${i}`}
                x={getX(i)}
                y={CHART_HEIGHT - 6}
                textAnchor="middle"
                fill={colors.background[400]}
                fontSize="11"
              >
                {d.index}
              </SvgText>
            ))}
          </Svg>
        </ScrollView>
      </View>
    </View>
  );
};

export default GraphData;
