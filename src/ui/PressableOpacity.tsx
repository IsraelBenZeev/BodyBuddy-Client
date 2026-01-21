// import * as Haptics from 'expo-haptics'; // ייבוא הרטט
// import React from 'react';
// import { Pressable, PressableProps, View } from 'react-native';

// interface PressableOpacityProps extends PressableProps {
//     children: React.ReactNode;
//     className?: string;        // כל העיצוב (מסגרת, גודל, ריווח)
//     bgColor?: string;         // צבע בסיס, למשל: "zinc-900" 
//     activeOpacity?: string;   // רמת השקיפות, למשל: "/70"
//     onPress?: () => void;
//     onPressIn?: () => void;
//     onPressOut?: () => void;
//     haptics?: { isLongPress: boolean, type: Haptics.NotificationFeedbackType };
// }

// const PressableOpacity = ({
//     children,
//     className = "",
//     bgColor = "zinc-900",
//     activeOpacity = "/70",
//     onPress,
//     onPressIn,
//     onPressOut,
//     haptics = { isLongPress: false, type: Haptics.NotificationFeedbackType.Warning },
// }: PressableOpacityProps) => {
//     return (
//         <Pressable onPress={() => {
//             if (haptics.isLongPress) {
//                 Haptics.notificationAsync(haptics.type);
//             }
//             onPress?.();
//         }} onPressIn={onPressIn} onPressOut={onPressOut}>
//             {({ pressed }) => {
//                 // חישוב ה-className בזמן ריצה
//                 const dynamicBg = pressed ? `bg-${bgColor}${activeOpacity}` : `bg-${bgColor}`;

//                 return (
//                     <View className={`${className} ${dynamicBg}`}>
//                         {children}
//                     </View>
//                 );
//             }}
//         </Pressable>
//     );
// };

// export default PressableOpacity;


import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'none';
// סוג האנימציה שנרצה
type AnimationType = 'scale' | 'opacity' | 'both';

interface Props extends PressableProps {
    children: React.ReactNode;
    className?: string;
    haptic?: HapticType;
    animationType: AnimationType; 
    activeScale?: number;
    activeOpacity?: number;
}

const AppButton = ({
    children,
    className = "",
    onPress,
    haptic = 'medium',
    animationType,
    activeScale = 0.96,
    activeOpacity = 0.6,
    ...props
}: Props) => {
    
    // נשתמש ב-Shared Value אחד כדי לשלוט בשני האפקטים
    const pressedValue = useSharedValue(0); // 0 = לא לחוץ, 1 = לחוץ

    const animatedStyle = useAnimatedStyle(() => {
        const styles: any = {};

        // אם בחרנו scale או both
        if (animationType === 'scale' || animationType === 'both') {
            styles.transform = [
                { scale: withSpring(pressedValue.value === 1 ? activeScale : 1, { damping: 10, stiffness: 200 }) }
            ];
        }

        // אם בחרנו opacity או both
        if (animationType === 'opacity' || animationType === 'both') {
            styles.opacity = withTiming(pressedValue.value === 1 ? activeOpacity : 1, { duration: 100 });
        }

        return styles;
    });

    const triggerHaptic = (type: HapticType) => {
        switch (type) {
            case 'light': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
            case 'medium': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
            case 'heavy': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); break;
            case 'success': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
            case 'warning': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); break;
            case 'error': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
        }
    };

    const handlePressIn = (event: any) => {
        triggerHaptic(haptic);
        pressedValue.value = 1; // מעדכן למצב לחוץ
        props.onPressIn?.(event);
    };

    const handlePressOut = (event: any) => {
        pressedValue.value = 0; // חוזר למצב רגיל
        props.onPressOut?.(event);
    };

    return (
        <AnimatedPressable
            {...props}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[animatedStyle]}
            className={className}
        >
            {children}
        </AnimatedPressable>
    );
};

export default AppButton;