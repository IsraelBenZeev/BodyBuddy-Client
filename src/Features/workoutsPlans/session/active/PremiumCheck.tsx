import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
    ZoomIn,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
    checked: boolean;
    onPress: () => void;
}

const PremiumCheck = ({ checked, onPress }: Props) => {
    const progress = useSharedValue(checked ? 1 : 0);
    const ringScale = useSharedValue(1);
    const ringOpacity = useSharedValue(0);
    const pressScale = useSharedValue(1);

    useEffect(() => {
        progress.value = withSpring(checked ? 1 : 0, { damping: 15 });
    }, [checked]);

    const animatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ['transparent', '#bef264']
        );
        const borderColor = interpolateColor(
            progress.value,
            [0, 1],
            ['#3f3f46', '#bef264']
        );
        return { backgroundColor, borderColor };
    });

    const pressScaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pressScale.value }],
    }));

    const ringStyle = useAnimatedStyle(() => ({
        transform: [{ scale: ringScale.value }],
        opacity: ringOpacity.value,
    }));

    const handlePress = useCallback(() => {
        if (checked) return;
        pressScale.value = withSequence(
            withTiming(0.82, { duration: 80 }),
            withSpring(1, { damping: 8, stiffness: 200 })
        );
        ringOpacity.value = withSequence(
            withTiming(0.7, { duration: 40 }),
            withTiming(0, { duration: 480 })
        );
        ringScale.value = withSequence(
            withTiming(1, { duration: 0 }),
            withTiming(2.4, { duration: 520 })
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onPress();
    }, [checked, onPress]);

    return (
        <View className="items-center justify-center">
            {/* Ring burst */}
            <Animated.View
                style={[
                    ringStyle,
                    {
                        position: 'absolute',
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: '#bef264',
                    },
                ]}
            />
            {/* כפתור */}
            <Animated.View style={pressScaleStyle}>
                <AnimatedPressable
                    onPress={handlePress}
                    style={[animatedStyle]}
                    className="w-9 h-9 rounded-xl border-2 items-center justify-center"
                    accessibilityRole="checkbox"
                    accessibilityLabel={checked ? 'סט הושלם' : 'סמן סט כהושלם'}
                    accessibilityState={{ checked }}
                >
                    {checked && (
                        <Animated.View entering={ZoomIn.duration(200)}>
                            <MaterialCommunityIcons name="check-bold" size={20} color="black" />
                        </Animated.View>
                    )}
                </AnimatedPressable>
            </Animated.View>
        </View>
    );
};

export default PremiumCheck;
