import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Carousel, { TAnimationStyle } from 'react-native-reanimated-carousel';

export interface FanArcItem {
  key: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  arcLabel?: string;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  colors: {
    iconBg: string;
    iconBorder: string;
    iconColor: string;
    labelColor: string;
  };
}

interface FanArcCarouselProps {
  items: FanArcItem[];
  itemSize?: number;
}

interface FanArcCarouselButtonProps {
  item: FanArcItem;
  itemSize: number;
  animationValue: SharedValue<number>;
}

const FanArcCarouselButton = ({ item, itemSize, animationValue }: FanArcCarouselButtonProps) => {
  const dimStyle = useAnimatedStyle(() => {
    const distance = Math.abs(animationValue.value);
    const dimOpacity = interpolate(distance, [0, 1, 2], [0, 0.6, 0.82], Extrapolation.CLAMP);
    return { opacity: dimOpacity };
  });

  return (
    <Pressable
      onPress={item.onPress}
      accessibilityRole="button"
      accessibilityLabel={item.accessibilityLabel}
      accessibilityHint={item.accessibilityHint}
      hitSlop={8}
      style={{ width: itemSize, height: itemSize }}
    >
      <View
        style={{
          width: '100%',
          height: '100%',
          borderRadius: itemSize / 2,
          backgroundColor: item.colors.iconBg,
          borderWidth: 1,
          borderColor: item.colors.iconBorder,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <Ionicons name={item.icon} size={itemSize * 0.32} color={item.colors.iconColor} />
        <Text
          style={{ color: item.colors.labelColor }}
          className="typo-caption-bold mt-1 text-center"
          numberOfLines={1}
        >
          {item.arcLabel ?? item.label}
        </Text>
        <Animated.View
          pointerEvents="none"
          style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000' }, dimStyle]}
        />
      </View>
    </Pressable>
  );
};

const FanArcCarousel = ({ items, itemSize = 76 }: FanArcCarouselProps) => {
  const [pageWidth, setPageWidth] = useState(0);
  const containerHeight = itemSize + 90;

  const animationStyle: TAnimationStyle = useCallback(
    (value: number) => {
      'worklet';
      const centerOffset = pageWidth / 2 - itemSize / 2;

      const itemGap = interpolate(value, [-3, -2, -1, 0, 1, 2, 3], [-30, -15, 0, 0, 0, 15, 30]);

      const translateX = interpolate(value, [-1, 0, 1], [-itemSize, 0, itemSize]) + centerOffset - itemGap;

      const translateY = interpolate(value, [-1, -0.5, 0, 0.5, 1], [64, 50, 42, 50, 64]);

      const scale = interpolate(value, [-1, -0.5, 0, 0.5, 1], [0.72, 0.85, 1.15, 0.85, 0.72]);

      return {
        transform: [{ translateX }, { translateY }, { scale }],
      };
    },
    [pageWidth, itemSize]
  );

  return (
    <View
      onLayout={(e) => setPageWidth(e.nativeEvent.layout.width)}
      style={{ height: containerHeight, width: '100%', direction: 'ltr' }}
    >
      {pageWidth > 0 && (
        <Carousel
          loop
          width={pageWidth}
          height={containerHeight}
          style={{ width: pageWidth, height: containerHeight, direction: 'ltr' }}
          data={items}
          customAnimation={animationStyle}
          renderItem={({ item, animationValue }) => (
            <FanArcCarouselButton item={item} itemSize={itemSize} animationValue={animationValue} />
          )}
        />
      )}
    </View>
  );
};

export default FanArcCarousel;
