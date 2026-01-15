import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const GAP = 15;

const AnimatedCarouselItem = ({ item, index, scrollX, widthCard, TOTAL_ITEM_SIZE, renderItem, isActive }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * TOTAL_ITEM_SIZE,
      index * TOTAL_ITEM_SIZE,
      (index + 1) * TOTAL_ITEM_SIZE,
    ];

    const scale = interpolate(scrollX.value, inputRange, [0.9, 1, 0.9], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolation.CLAMP);

    return {
      // transform: [{ scale }] + היפוך חזרה כדי שהטקסט לא יהיה בכתב ראי
      transform: [{ scale }, { scaleX: -1 }], 
      opacity,
      zIndex: isActive ? 10 : 1,
    };
  });

  return (
    <Animated.View style={[{ width: widthCard, marginHorizontal: GAP / 2, overflow: 'visible' }, animatedStyle]}>
      {renderItem(item, isActive)}
    </Animated.View>
  );
};

const CustomCarousel = ({ data, renderItem, widthCard }: { data: any[]; renderItem: any; widthCard: number }) => {
  console.log('data', data);
  
  const [activeId, setActiveId] = useState<string | number | null>(data[0]?.id || null);
  const scrollX = useSharedValue(0);
  const TOTAL_ITEM_SIZE = widthCard + GAP;
  const ITEM_SPACING = (width - widthCard) / 2;

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
          paddingHorizontal: ITEM_SPACING - (GAP / 2),
          paddingBottom: 80,
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
            renderItem={renderItem}
            isActive={item.id === activeId}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    overflow: 'visible',
  },
});


export default CustomCarousel;