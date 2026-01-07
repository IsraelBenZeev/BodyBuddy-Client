import { useEffect } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

const CarouselItem = ({ item, index, activeId, swipedItemId, setSwipedItemId, renderItem, widthCard, scrollX, TOTAL_ITEM_SIZE, GAP }: any) => {
    const isActive = item.id === activeId;

    const contextY = useSharedValue(0);
    const translateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .enabled(isActive)
        .activeOffsetY([-10, 10])
        .failOffsetX([-20, 20])
        .onStart(() => {
            contextY.value = translateY.value;
        })
        .onUpdate((event) => {
            let nextY = contextY.value + event.translationY;
            if (nextY > 0) nextY = 0;
            if (nextY < -180) nextY = -180;
            translateY.value = nextY;
        })
        .onFinalize((event) => {
            const velocity = event.velocityY;
            const currentPos = translateY.value;
            const isFlickDown = velocity > 500;
            const isFlickUp = velocity < -500;
            const passedHalfWay = currentPos < -65;
            if ((passedHalfWay || isFlickUp) && !isFlickDown) {
                translateY.value = withSpring(-130, {
                    damping: 20,
                    stiffness: 90,
                    overshootClamping: true
                });
                runOnJS(setSwipedItemId)(item.id);
            } else {
                translateY.value = withTiming(0, { duration: 400 });
                runOnJS(setSwipedItemId)(null);
            }
        });

    useEffect(() => {
        if (!isActive) {
            translateY.value = withTiming(0, { duration: 400 });
        }
    }, [isActive]);
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * TOTAL_ITEM_SIZE,
            index * TOTAL_ITEM_SIZE,
            (index + 1) * TOTAL_ITEM_SIZE,
        ];

        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.4, 1, 0.4],
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { translateY: translateY.value },
                { scale: scale }
            ],
            opacity: opacity,
            zIndex: isActive ? 100 : 1,
        };
    });

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[
                animatedStyle,
                {
                    width: widthCard,
                    marginHorizontal: GAP / 2,
                    paddingBottom: 40,
                    marginBottom: -40,
                    backgroundColor: 'transparent',
                }
            ]}>
                {renderItem(item, isActive, swipedItemId === item.id)}
            </Animated.View>
        </GestureDetector>
    );
};

export default CarouselItem;