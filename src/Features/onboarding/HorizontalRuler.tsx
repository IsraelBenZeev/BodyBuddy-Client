import { colors } from '@/colors';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

interface HorizontalRulerProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}

const TICK_SPACING = 14;

const HorizontalRuler = ({ min, max, value, onChange, unit = 'kg' }: HorizontalRulerProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const flatListRef = useRef<FlatList<number>>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const lastHapticValue = useRef(value);
  /** עוקב אחרי הערך האחרון שגללנו אליו – מונע גלילה מיותרת אחרי scroll פנימי */
  const lastScrolledValue = useRef<number | null>(null);

  const data = useMemo(() => {
    const items: number[] = [];
    for (let i = min; i <= max; i++) {
      items.push(i);
    }
    return items;
  }, [min, max]);

  const sidePadding = (screenWidth - TICK_SPACING) / 2;

  // גלילה לערך – גם בטעינה ראשונית וגם כש-value משתנה מבחוץ (reset)
  useEffect(() => {
    if (flatListRef.current && lastScrolledValue.current !== value) {
      const index = value - min;
      const isInitial = lastScrolledValue.current === null;
      setTimeout(
        () => {
          flatListRef.current?.scrollToOffset({
            offset: index * TICK_SPACING,
            animated: !isInitial,
          });
          lastScrolledValue.current = value;
          setDisplayValue(value);
        },
        isInitial ? 100 : 0
      );
    }
  }, [value, min]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / TICK_SPACING);
      const newValue = Math.max(min, Math.min(max, min + index));
      if (newValue !== lastHapticValue.current) {
        lastHapticValue.current = newValue;
        Haptics.selectionAsync();
      }
      setDisplayValue(newValue);
    },
    [min, max]
  );

  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / TICK_SPACING);
      const newValue = Math.max(min, Math.min(max, min + index));
      setDisplayValue(newValue);
      lastScrolledValue.current = newValue;
      onChange(newValue);
    },
    [min, max, onChange]
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: TICK_SPACING,
      offset: TICK_SPACING * index,
      index,
    }),
    []
  );

  const renderTick = useCallback(({ item }: { item: number }) => {
    const isMajor = item % 10 === 0;
    const isMedium = item % 5 === 0;

    return (
      <View
        style={{ width: TICK_SPACING, alignItems: 'center', justifyContent: 'flex-end' }}
        className="h-20"
      >
        <View
          style={{
            width: isMajor ? 2.5 : isMedium ? 1.5 : 1,
            height: isMajor ? 44 : isMedium ? 30 : 18,
            backgroundColor: isMajor
              ? colors.background[100]
              : isMedium
                ? colors.background[300]
                : colors.background[600],
            borderRadius: 1,
          }}
        />
        {isMajor && (
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: colors.background[300],
              marginTop: 3,
            }}
          >
            {item}
          </Text>
        )}
        {!isMajor && isMedium && (
          <Text
            style={{
              fontSize: 9,
              color: colors.background[500],
              marginTop: 2,
            }}
          >
            {item}
          </Text>
        )}
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: number) => item.toString(), []);

  return (
    <View className="items-center">
      {/* ערך נבחר */}
      <View className="flex-row items-baseline justify-center mb-3">
        <Text className="text-background-400 text-lg font-semibold mr-2">{unit}</Text>
        <Text className="text-white text-5xl font-black">{displayValue}</Text>
      </View>

      {/* סרגל */}
      <View className="w-full overflow-hidden" style={{ height: 90 }}>
        {/* נקודה עליונה */}
        <View
          className="absolute z-10"
          style={{
            left: screenWidth / 2 - 5,
            top: 0,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: colors.lime[500],
          }}
        />
        {/* קו אינדיקטור מרכזי */}
        <View
          className="absolute z-10"
          style={{
            left: screenWidth / 2 - 1,
            top: 10,
            width: 2,
            height: 48,
            backgroundColor: colors.lime[500],
            borderRadius: 1,
          }}
        />

        <FlatList
          ref={flatListRef}
          horizontal
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderTick}
          snapToInterval={TICK_SPACING}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumEnd}
          getItemLayout={getItemLayout}
          contentContainerStyle={{
            paddingHorizontal: sidePadding,
            alignItems: 'flex-end',
          }}
          initialScrollIndex={Math.max(0, value - min)}
          onScrollToIndexFailed={() => {
            // fallback – גלול לתחילה ואז לנקודה הנכונה
            flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
          }}
        />
      </View>
    </View>
  );
};

export default HorizontalRuler;
