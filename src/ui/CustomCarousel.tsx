import { useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue, // הוספנו את הטיפוס הזה
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CarouselProps {
  data: any[];
  renderItem: (
    item: any,
    isActive: boolean,
    isSwiped: boolean, // חובה לפי ה-CardPlan שלך
    activeId: string,
    translateY: SharedValue<number> // חובה לפי ה-CardPlan שלך
  ) => React.ReactNode;
  widthCard: number;
  onSelect?: (id: any) => void;
  variant?: 'center' | 'chain';
  gap?: number;
  keyField?: string;
  onIndexChange?: (index: number) => void;
  initialIndex?: number;
  showNavArrows?: boolean;
}

const AnimatedCarouselItem = ({
  item,
  index,
  scrollX,
  widthCard,
  TOTAL_ITEM_SIZE,
  renderItem,
  isActive,
  onPress,
  variant,
  gap,
  activeId,
  itemId,
  onIndexChange,
}: any) => {
  // FIX: יצירת הערכים עבור ה-CardPlan בתוך כל אייטם
  const translateY = useSharedValue(0);
  const isSwiped = false; // כאן תוכל להוסיף לוגיקה עתידית

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * TOTAL_ITEM_SIZE,
      index * TOTAL_ITEM_SIZE,
      (index + 1) * TOTAL_ITEM_SIZE,
    ];
    const isCenter = variant === 'center';
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [isCenter ? 0.9 : 1, 1, isCenter ? 0.9 : 1],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [isCenter ? 0.5 : 1, 1, isCenter ? 0.5 : 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
      zIndex: isActive ? 10 : 1,
    };
  });
  const currentActiveId = activeId || '';
  return (
    <Animated.View
      style={[{ width: widthCard, marginRight: gap, overflow: 'visible', }, animatedStyle]}
    >
      {/* FIX: כאן אנחנו מעבירים את כל 4 הארגומנטים שה-renderItem מצפה להם */}
      {renderItem(item, isActive, isSwiped, currentActiveId, translateY)}
    </Animated.View>
  );
};

const CustomCarousel = ({
  data,
  renderItem,
  widthCard,
  onSelect,
  variant = 'chain',
  gap = 15,
  keyField = 'id',
  onIndexChange,
  initialIndex,
  showNavArrows = false,
}: CarouselProps) => {
  const TOTAL_ITEM_SIZE = widthCard + gap;
  const ITEM_SPACING = variant === 'center' ? (SCREEN_WIDTH - widthCard) / 2 : 20;
  const initialScrollX = (initialIndex ?? 0) * TOTAL_ITEM_SIZE;

  const [activeId, setActiveId] = useState<string | number | null>(
    data[initialIndex ?? 0]?.[keyField] || null
  );
  const [currentIndex, setCurrentIndex] = useState(initialIndex ?? 0);
  const scrollX = useSharedValue(initialScrollX);
  const scrollRef = useRef<React.ElementRef<typeof Animated.ScrollView>>(null);

  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(data.length - 1, index));
    scrollRef.current?.scrollTo({ x: clampedIndex * TOTAL_ITEM_SIZE, animated: true });
  };

  const updateActiveId = (id: string | number) => {
    if (activeId !== id) setActiveId(id);
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / TOTAL_ITEM_SIZE);
      if (data[index]) {
        runOnJS(updateActiveId)(data[index][keyField]);
      }
    },
  });
  useEffect(() => {
    if (data.length > 0 && activeId === null) {
      setActiveId(data[0][keyField]);
    }
  }, [data]);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= data.length - 1;

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        style={{ flex: 1 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToInterval={TOTAL_ITEM_SIZE}
        decelerationRate="fast"
        disableIntervalMomentum={true}
        onMomentumScrollEnd={(event) => {
          // בגלל ה-transform scaleX: -1, לפעמים צריך Math.abs או חישוב הפוך
          // נסה קודם ככה:
          const offset = event.nativeEvent.contentOffset.x;
          const index = Math.round(offset / TOTAL_ITEM_SIZE);

          console.log("index: ", index);

          if (data[index]) {
            const id = data[index][keyField];

            // 1. עדכון ה-ID הפנימי של הקרוסלה (במידה ויש runOnJS)
            runOnJS(setActiveId)(id);
            runOnJS(setCurrentIndex)(index);

            // 2. שליחת האינדקס וה-ID חזרה ל-Session
            if (onIndexChange) {
              runOnJS(onIndexChange)(index);
            }

            if (onSelect) {
              runOnJS(onSelect)(id);
            }
          }
        }}
        contentOffset={{ x: initialScrollX, y: 0 }}
        contentContainerStyle={{
          paddingHorizontal: ITEM_SPACING,
          paddingBottom: variant === 'center' ? 80 : 20,
          direction: 'ltr',
        }}
      >
        {data.map((item, index) => {
          const itemId = item?.[keyField];
          return (
            <AnimatedCarouselItem
              key={itemId?.toString() || index}
              item={item}
              itemId={itemId}
              index={index}
              scrollX={scrollX}
              widthCard={widthCard}
              TOTAL_ITEM_SIZE={TOTAL_ITEM_SIZE}
              renderItem={renderItem} // מעבירים את הפונקציה המקורית
              isActive={itemId === activeId}
              activeId={activeId as string}
              variant={variant}
              gap={gap}
              onPress={(id: any) => {
                setActiveId(id);
                onSelect?.(id);
              }}
            />
          );
        })}
      </Animated.ScrollView>

      {showNavArrows && (
        <>
          <Pressable
            onPress={() => scrollToIndex(currentIndex - 1)}
            disabled={isFirst}
            hitSlop={8}
            style={[styles.navArrow, styles.navArrowLeft, isFirst && styles.navArrowDisabled]}
            accessibilityRole="button"
            accessibilityLabel="התרגיל הקודם"
            accessibilityHint="גרור או לחץ כדי לעבור לתרגיל הקודם"
            accessibilityState={{ disabled: isFirst }}
          >
            <MaterialCommunityIcons name="chevron-left" size={26} color="rgb(161,161,170)" />
          </Pressable>

          <Pressable
            onPress={() => scrollToIndex(currentIndex + 1)}
            disabled={isLast}
            hitSlop={8}
            style={[styles.navArrow, styles.navArrowRight, isLast && styles.navArrowDisabled]}
            accessibilityRole="button"
            accessibilityLabel="התרגיל הבא"
            accessibilityHint="גרור או לחץ כדי לעבור לתרגיל הבא"
            accessibilityState={{ disabled: isLast }}
          >
            <MaterialCommunityIcons name="chevron-right" size={26} color="rgb(161,161,170)" />
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', flex: 1, paddingVertical: 0, direction: 'ltr' },
  navArrow: {
    position: 'absolute',
    top: '15%',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(63,63,70)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  navArrowLeft: { left: 4 },
  navArrowRight: { right: 4 },
  navArrowDisabled: {
    opacity: 0.25,
  },
});

export default CustomCarousel;
