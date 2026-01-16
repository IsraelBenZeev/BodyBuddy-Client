import { useState } from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  SharedValue // הוספנו את הטיפוס הזה
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CarouselProps {
  data: any[];
  renderItem: (
    item: any, 
    isActive: boolean, 
    isSwiped: boolean, // חובה לפי ה-CardPlan שלך
    translateY: SharedValue<number> // חובה לפי ה-CardPlan שלך
  ) => React.ReactNode;
  widthCard: number;
  onSelect?: (id: any) => void;
  variant?: 'center' | 'chain';
  gap?: number;
}

const AnimatedCarouselItem = ({ 
  item, index, scrollX, widthCard, TOTAL_ITEM_SIZE, renderItem, isActive, onPress, variant, gap 
}: any) => {
  
  // FIX: יצירת הערכים עבור ה-CardPlan בתוך כל אייטם
  const translateY = useSharedValue(0);
  const isSwiped = false; // כאן תוכל להוסיף לוגיקה עתידית

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * TOTAL_ITEM_SIZE, index * TOTAL_ITEM_SIZE, (index + 1) * TOTAL_ITEM_SIZE];
    const isCenter = variant === 'center';
    const scale = interpolate(scrollX.value, inputRange, [isCenter ? 0.9 : 1, 1, isCenter ? 0.9 : 1], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [isCenter ? 0.5 : 1, 1, isCenter ? 0.5 : 1], Extrapolation.CLAMP);

    return {
      transform: [{ scale }, { scaleX: -1 }],
      opacity,
      zIndex: isActive ? 10 : 1,
    };
  });

  return (
    <TouchableOpacity onPress={() => onPress?.(item.id)} activeOpacity={0.8}>
      <Animated.View style={[{ width: widthCard, marginRight: gap, overflow: 'visible' }, animatedStyle]}>
        {/* FIX: כאן אנחנו מעבירים את כל 4 הארגומנטים שה-renderItem מצפה להם */}
        {renderItem(item, isActive, isSwiped, translateY)}
      </Animated.View>
    </TouchableOpacity>
  );
};

const CustomCarousel = ({ data, renderItem, widthCard, onSelect, variant = 'chain', gap = 15 }: CarouselProps) => {
  const [activeId, setActiveId] = useState<string | number | null>(data[0]?.id || null);
  const scrollX = useSharedValue(0);

  const TOTAL_ITEM_SIZE = widthCard + gap;
  const ITEM_SPACING = variant === 'center' ? (SCREEN_WIDTH - widthCard) / 2 : 20;

  const updateActiveId = (id: string | number) => {
    if (activeId !== id) setActiveId(id);
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / TOTAL_ITEM_SIZE);
      if (data[index]) {
        runOnJS(updateActiveId)(data[index].id);
      }
    },
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        style={{ transform: [{ scaleX: -1 }] }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToInterval={TOTAL_ITEM_SIZE}
        decelerationRate="fast"
        disableIntervalMomentum={true}
        contentContainerStyle={{
          paddingHorizontal: ITEM_SPACING,
          paddingBottom: variant === 'center' ? 80 : 20,
        }}
      >
        {data.map((item, index) => (
          <AnimatedCarouselItem
            key={item.id.toString()}
            item={item}
            index={index}
            scrollX={scrollX}
            widthCard={widthCard}
            TOTAL_ITEM_SIZE={TOTAL_ITEM_SIZE}
            renderItem={renderItem} // מעבירים את הפונקציה המקורית
            isActive={item.id === activeId}
            variant={variant}
            gap={gap}
            onPress={(id: any) => {
              setActiveId(id);
              onSelect?.(id);
            }}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', paddingVertical: 0 },
});

export default CustomCarousel;