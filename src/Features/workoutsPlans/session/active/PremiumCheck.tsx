import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
    ZoomIn
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
    checked: boolean;
    onPress: () => void;
}

const PremiumCheck = ({ checked, onPress }: Props) => {
    // 0 = לא מסומן, 1 = מסומן
    const progress = useSharedValue(checked ? 1 : 0);

    useEffect(() => {
        progress.value = withSpring(checked ? 1 : 0, { damping: 15 });
    }, [checked]);

    const animatedStyle = useAnimatedStyle(() => {
        // אנימציה של הצבע
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ['transparent', '#bef264'] // מטרנספרנט לליים
        );

        const borderColor = interpolateColor(
            progress.value,
            [0, 1],
            ['#3f3f46', '#bef264'] // מאפור כהה לליים
        );

        return {
            backgroundColor,
            borderColor,
            transform: [{ scale: progress.value === 1 ? withSequence(withTiming(1.2), withSpring(1)) : 1 }]
        };
    });

    const handlePress = () => {
        if (!checked) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
    };

    return (
        <AnimatedPressable
            onPress={handlePress}
            style={[animatedStyle]}
            className="w-9 h-9 rounded-xl border-2 items-center justify-center"
        >
            {checked && (
                <Animated.View
                    // השתמש ב-ZoomIn או FadeIn מובנה
                    entering={ZoomIn.duration(200)}
                    // exiting={withTiming({ duration: 150 })} // אופציונלי אם רוצים אנימציית יציאה
                >
                    <MaterialCommunityIcons name="check-bold" size={20} color="black" />
                </Animated.View>
            )}
        </AnimatedPressable>
    );
};

export default PremiumCheck;