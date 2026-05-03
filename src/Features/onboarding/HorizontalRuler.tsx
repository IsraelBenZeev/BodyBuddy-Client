import { colors } from '@/colors';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
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
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const lastHapticValue = useRef(value);
  const lastScrolledValue = useRef<number | null>(null);

  const data = useMemo(() => {
    const items: number[] = [];
    for (let i = min; i <= max; i++) {
      items.push(i);
    }
    return items;
  }, [min, max]);

  // מערך מפורש של נקודות snap — [0, 14, 28, ...]
  const snapOffsets = useMemo(
    () => data.map((_, i) => i * TICK_SPACING),
    [data],
  );

  const handleContainerLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const sidePadding = (containerWidth - TICK_SPACING) / 2;

  // גלילה לערך – גם בטעינה ראשונית וגם כש-value משתנה מבחוץ (reset)
  useEffect(() => {
    if (scrollViewRef.current && lastScrolledValue.current !== value) {
      const offset = (value - min) * TICK_SPACING;
      const isInitial = lastScrolledValue.current === null;
      const timer = setTimeout(
        () => {
          scrollViewRef.current?.scrollTo({ x: offset, animated: !isInitial });
          lastScrolledValue.current = value;
          setDisplayValue(value);
        },
        isInitial ? 100 : 0,
      );
      return () => clearTimeout(timer);
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
    [min, max],
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
    [min, max, onChange],
  );

  return (
    <View className="items-center">
      {/* ערך נבחר */}
      <View className="flex-row items-baseline justify-center mb-3">
        <Text className="typo-h4 text-background-400 mr-2">{unit}</Text>
        <Text className="typo-h3 text-white">{displayValue}</Text>
      </View>

      {/* סרגל */}
      <View
        className="w-full overflow-hidden"
        style={{ height: 90, direction: 'ltr' }}
        onLayout={handleContainerLayout}
      >
        {/* נקודה עליונה */}
        <View
          className="absolute z-10"
          style={{
            left: containerWidth / 2 - 5,
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
            left: containerWidth / 2 - 1,
            top: 10,
            width: 2,
            height: 48,
            backgroundColor: colors.lime[500],
            borderRadius: 1,
          }}
        />

        <ScrollView
          ref={scrollViewRef}
          horizontal
          snapToOffsets={snapOffsets}
          snapToAlignment="start"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumEnd}
          contentContainerStyle={{
            paddingHorizontal: sidePadding,
            alignItems: 'flex-end',
          }}
        >
          {data.map((item) => {
            const isMajor = item % 10 === 0;
            const isMedium = item % 5 === 0;
            return (
              <View
                key={item}
                style={{ width: TICK_SPACING, alignItems: 'center', justifyContent: 'flex-end', height: 80 }}
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
                    numberOfLines={1}
                    className="typo-caption"
                    style={{ color: colors.background[300], marginTop: 3, width: 30, textAlign: 'center' }}
                  >
                    {item}
                  </Text>
                )}
                {!isMajor && isMedium && (
                  <Text
                    numberOfLines={1}
                    className="typo-caption"
                    style={{ color: colors.background[500], marginTop: 2, width: 30, textAlign: 'center' }}
                  >
                    {item}
                  </Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default HorizontalRuler;
