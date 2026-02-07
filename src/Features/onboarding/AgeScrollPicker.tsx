import { colors } from '@/colors';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from 'react-native';

interface AgeScrollPickerProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const ITEM_WIDTH = 64;

/** פריט בודד – מונפש לפי מרחק מהמרכז */
const AgeItem: React.FC<{
  item: number;
  index: number;
  scrollX: Animated.Value;
}> = React.memo(
  ({
    item,
    index,
    scrollX,
  }: {
    item: number;
    index: number;
    scrollX: Animated.Value;
  }) => {
    const inputRange = [
      (index - 2) * ITEM_WIDTH,
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
      (index + 2) * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 0.7, 1.3, 0.7, 0.5],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.15, 0.35, 1, 0.35, 0.15],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{
          width: ITEM_WIDTH,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale }],
          opacity,
        }}
      >
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 32,
            fontWeight: '800',
          }}
        >
          {item}
        </Text>
      </Animated.View>
    );
  },
);
AgeItem.displayName = 'AgeItem';

const AgeScrollPicker = ({
  min,
  max,
  value,
  onChange,
}: AgeScrollPickerProps) => {
  const flatListRef = useRef<FlatList<number>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const lastHapticValue = useRef(value);
  /** עוקב אחרי הערך האחרון שגללנו אליו – מונע גלילה מיותרת אחרי scroll פנימי */
  const lastScrolledValue = useRef<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const data = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  );

  const sidePadding = containerWidth > 0 ? (containerWidth - ITEM_WIDTH) / 2 : 0;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  // גלילה לערך – גם בטעינה ראשונית וגם כש-value משתנה מבחוץ (reset)
  useEffect(() => {
    if (flatListRef.current && containerWidth > 0 && lastScrolledValue.current !== value) {
      const index = value - min;
      const offset = index * ITEM_WIDTH;
      const isInitial = lastScrolledValue.current === null;
      setTimeout(
        () => {
          flatListRef.current?.scrollToOffset({ offset, animated: !isInitial });
          lastScrolledValue.current = value;
        },
        isInitial ? 50 : 0,
      );
    }
  }, [value, min, containerWidth]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / ITEM_WIDTH);
        const newVal = Math.max(min, Math.min(max, min + index));
        if (newVal !== lastHapticValue.current) {
          lastHapticValue.current = newVal;
          Haptics.selectionAsync();
        }
      },
    },
  );

  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / ITEM_WIDTH);
      const newVal = Math.max(min, Math.min(max, min + index));
      lastScrolledValue.current = newVal;
      onChange(newVal);
    },
    [min, max, onChange],
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: number; index: number }) => (
      <AgeItem item={item} index={index} scrollX={scrollX} />
    ),
    [scrollX],
  );

  const keyExtractor = useCallback((item: number) => item.toString(), []);

  return (
    <View className="items-center">
      {/* Label */}
      <Text className="text-background-400 text-sm font-semibold mb-1">שנים</Text>

      {/* Scroll picker */}
      <View style={{ height: 70 }} className="w-full" onLayout={handleLayout}>
        {containerWidth > 0 && (
          <>
            {/* קו אינדיקטור מרכזי עדין */}
            <View
              className="absolute z-10"
              style={{
                left: containerWidth / 2 - 24,
                bottom: 0,
                width: 48,
                height: 3,
                backgroundColor: colors.lime[500],
                borderRadius: 2,
              }}
            />

            <Animated.FlatList
              ref={flatListRef}
              horizontal
              data={data}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              snapToInterval={ITEM_WIDTH}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={handleScroll}
              onMomentumScrollEnd={handleMomentumEnd}
              getItemLayout={getItemLayout}
              contentContainerStyle={{
                paddingHorizontal: sidePadding,
                alignItems: 'center',
              }}
              onScrollToIndexFailed={() => {
                flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
              }}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default AgeScrollPicker;
