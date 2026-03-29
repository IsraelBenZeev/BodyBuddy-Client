import { colors } from '@/colors';
import { getDaysInMonth, isValid, parseISO } from 'date-fns';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from 'react-native';

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 3;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING = Math.floor(VISIBLE_ITEMS / 2); // 1

const MONTH_LABELS = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
];

const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();
const MIN_YEAR = CURRENT_YEAR - 100;
const MAX_BIRTH_YEAR = CURRENT_YEAR - 18;
const MAX_BIRTH_MONTH = TODAY.getMonth(); // 0-indexed
const MAX_BIRTH_DAY = TODAY.getDate();
const YEARS = Array.from({ length: MAX_BIRTH_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);

// ─── PickerItem ───────────────────────────────────────────────
interface PickerItemProps {
  item: string | number;
  index: number;
  scrollY: Animated.Value;
}

const PickerItem: React.FC<PickerItemProps> = React.memo(
  ({ item, index, scrollY }) => {
    const realIndex = index - PADDING;

    const inputRange = [
      (realIndex - 2) * ITEM_HEIGHT,
      (realIndex - 1) * ITEM_HEIGHT,
      realIndex * ITEM_HEIGHT,
      (realIndex + 1) * ITEM_HEIGHT,
      (realIndex + 2) * ITEM_HEIGHT,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.6, 0.8, 1.2, 0.8, 0.6],
      extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.1, 0.35, 1, 0.35, 0.1],
      extrapolate: 'clamp',
    });

    if (item === '') {
      return <View style={{ height: ITEM_HEIGHT }} />;
    }

    return (
      <Animated.View
        style={{
          height: ITEM_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale }],
          opacity,
        }}
      >
        <Text
          style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: 14,
            fontWeight: '600',
          }}
        >
          {String(item)}
        </Text>
      </Animated.View>
    );
  }
);
PickerItem.displayName = 'PickerItem';

// ─── PickerColumn ─────────────────────────────────────────────
interface PickerColumnProps {
  data: (string | number)[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  flex: number;
  label: string;
}

const PickerColumn: React.FC<PickerColumnProps> = ({
  data,
  selectedIndex,
  onSelect,
  flex,
  label,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(selectedIndex * ITEM_HEIGHT)).current;
  const lastHapticIndex = useRef(selectedIndex);
  const lastScrolledIndex = useRef<number | null>(null);

  const paddedData = useMemo(
    () => [...Array(PADDING).fill(''), ...data, ...Array(PADDING).fill('')] as (string | number)[],
    [data]
  );

  // גלילה לערך שהשתנה מבחוץ (למשל clamping יום כשחודש משתנה)
  useEffect(() => {
    if (lastScrolledIndex.current !== selectedIndex) {
      const offset = selectedIndex * ITEM_HEIGHT;
      const isInitial = lastScrolledIndex.current === null;
      const timer = setTimeout(
        () => {
          flatListRef.current?.scrollToOffset({ offset, animated: !isInitial });
          lastScrolledIndex.current = selectedIndex;
        },
        isInitial ? 50 : 0
      );
      return () => clearTimeout(timer);
    }
  }, [selectedIndex]);

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
    listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, data.length - 1));
      if (clamped !== lastHapticIndex.current) {
        lastHapticIndex.current = clamped;
        Haptics.selectionAsync().catch(() => {});
      }
    },
  });

  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, data.length - 1));
      lastScrolledIndex.current = clamped;
      onSelect(clamped);
    },
    [data.length, onSelect]
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: string | number; index: number }) => (
      <PickerItem item={item} index={index} scrollY={scrollY} />
    ),
    [scrollY]
  );

  const keyExtractor = useCallback((_: unknown, index: number) => String(index), []);

  return (
    <View style={{ flex }}>
      <Text
        style={{
          color: colors.background[400],
          fontSize: 11,
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <View style={{ height: CONTAINER_HEIGHT, overflow: 'hidden' }}>
        {/* קו הדגשה למרכז */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: PADDING * ITEM_HEIGHT,
            left: 4,
            right: 4,
            height: ITEM_HEIGHT,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: `${colors.lime[500]}50`,
            backgroundColor: `${colors.lime[500]}10`,
            borderRadius: 8,
            zIndex: 0,
          }}
        />
        <Animated.FlatList
          ref={flatListRef}
          data={paddedData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          extraData={selectedIndex}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumEnd}
          getItemLayout={getItemLayout}
          style={{ zIndex: 1 }}
          onScrollToIndexFailed={() => {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
          }}
        />
      </View>
    </View>
  );
};

// ─── BirthDatePicker ──────────────────────────────────────────
interface BirthDatePickerProps {
  value: string; // ISO: YYYY-MM-DD
  onChange: (iso: string) => void;
}

const BirthDatePicker: React.FC<BirthDatePickerProps> = ({ value, onChange }) => {
  const parsed = useMemo(() => {
    const date = parseISO(value);
    if (!isValid(date)) {
      return { year: CURRENT_YEAR - 25, month: 1, day: 1 };
    }
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }, [value]);

  const { year, month, day } = parsed;

  const isMaxYear = year === MAX_BIRTH_YEAR;
  const isMaxMonth = isMaxYear && month - 1 === MAX_BIRTH_MONTH;

  const daysInCurrentMonth = useMemo(
    () => getDaysInMonth(new Date(year, month - 1)),
    [year, month]
  );

  const months = useMemo(
    () => (isMaxYear ? MONTH_LABELS.slice(0, MAX_BIRTH_MONTH + 1) : MONTH_LABELS),
    [isMaxYear]
  );

  const days = useMemo(() => {
    const maxDay = isMaxMonth ? Math.min(daysInCurrentMonth, MAX_BIRTH_DAY) : daysInCurrentMonth;
    return Array.from({ length: maxDay }, (_, i) => i + 1);
  }, [daysInCurrentMonth, isMaxMonth]);

  const yearIndex = Math.max(0, YEARS.indexOf(year));
  const monthIndex = Math.min(month - 1, months.length - 1);
  const dayIndex = Math.min(day - 1, days.length - 1);

  const handleDaySelect = useCallback(
    (index: number) => {
      onChange(`${year}-${String(month).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`);
    },
    [year, month, onChange]
  );

  const handleMonthSelect = useCallback(
    (index: number) => {
      const newMonth = index + 1;
      const newDaysInMonth = getDaysInMonth(new Date(year, index));
      const isNewMaxMonth = year === MAX_BIRTH_YEAR && index === MAX_BIRTH_MONTH;
      const maxDay = isNewMaxMonth ? Math.min(newDaysInMonth, MAX_BIRTH_DAY) : newDaysInMonth;
      const clampedDay = Math.min(day, maxDay);
      onChange(
        `${year}-${String(newMonth).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`
      );
    },
    [year, day, onChange]
  );

  const handleYearSelect = useCallback(
    (index: number) => {
      const newYear = YEARS[index];
      const isNewMaxYear = newYear === MAX_BIRTH_YEAR;
      const clampedMonth = isNewMaxYear ? Math.min(month, MAX_BIRTH_MONTH + 1) : month;
      const newDaysInMonth = getDaysInMonth(new Date(newYear, clampedMonth - 1));
      const isNewMaxMonth = isNewMaxYear && clampedMonth - 1 === MAX_BIRTH_MONTH;
      const maxDay = isNewMaxMonth ? Math.min(newDaysInMonth, MAX_BIRTH_DAY) : newDaysInMonth;
      const clampedDay = Math.min(day, maxDay);
      onChange(
        `${newYear}-${String(clampedMonth).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`
      );
    },
    [month, day, onChange]
  );

  return (
    <View style={{ flexDirection: 'row-reverse', gap: 8, paddingHorizontal: 4 }}>
      <PickerColumn
        data={days}
        selectedIndex={dayIndex}
        onSelect={handleDaySelect}
        flex={1}
        label="יום"
      />
      <PickerColumn
        data={months}
        selectedIndex={monthIndex}
        onSelect={handleMonthSelect}
        flex={2.2}
        label="חודש"
      />
      <PickerColumn
        data={YEARS}
        selectedIndex={yearIndex}
        onSelect={handleYearSelect}
        flex={1.5}
        label="שנה"
      />
    </View>
  );
};

export default BirthDatePicker;
