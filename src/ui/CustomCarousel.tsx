import { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, ViewToken } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue
} from 'react-native-reanimated';
import CarouselItem from './CarouselItem';

const { width } = Dimensions.get('window');
const GAP = 15;

const CustomCarousel = ({ data, renderItem, widthCard }: { data: any[]; renderItem: any; widthCard: number }) => {
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [swipedItemId, setSwipedItemId] = useState<string | number | null>(null);
  const scrollX = useSharedValue(0);
  const TOTAL_ITEM_SIZE = widthCard + GAP;
  const ITEM_SPACING = (width - widthCard) / 2;
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const centeredItem = viewableItems[0].item;
      if (centeredItem) setActiveId(centeredItem.id);
    }
  }).current;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        onScroll={onScroll}
        scrollEventThrottle={16}
        horizontal
        inverted
        showsHorizontalScrollIndicator={false}
        snapToInterval={TOTAL_ITEM_SIZE}
        decelerationRate="fast"
        style={{ overflow: 'visible' }}
        contentContainerStyle={{
          paddingHorizontal: ITEM_SPACING - (GAP / 2),
          overflow: 'visible'
        }}

        {...({
          delaysContentTouches: false,
          canCancelContentTouches: true,
        } as any)}

        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <CarouselItem
            item={item}
            index={index}
            activeId={activeId}
            swipedItemId={swipedItemId}
            setSwipedItemId={setSwipedItemId}
            renderItem={renderItem}
            widthCard={widthCard}
            scrollX={scrollX}
            TOTAL_ITEM_SIZE={TOTAL_ITEM_SIZE}
            GAP={GAP}
          />
        )}
      />
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