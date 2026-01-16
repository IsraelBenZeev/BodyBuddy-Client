import React from 'react';
import { Pressable, PressableProps, View } from 'react-native';

interface PressableOpacityProps extends PressableProps {
    children: React.ReactNode;
    className?: string;        // כל העיצוב (מסגרת, גודל, ריווח)
    bgColor?: string;         // צבע בסיס, למשל: "zinc-900" 
    activeOpacity?: string;   // רמת השקיפות, למשל: "/70"
    onPress?: () => void;
}

const PressableOpacity = ({
    children,
    className = "",
    bgColor = "zinc-900",
    activeOpacity = "/70",
    onPress,
}: PressableOpacityProps) => {
    return (
        <Pressable onPress={onPress}>
            {({ pressed }) => {
                // חישוב ה-className בזמן ריצה
                const dynamicBg = pressed ? `bg-${bgColor}${activeOpacity}` : `bg-${bgColor}`;

                return (
                    <View className={`${className} ${dynamicBg}`}>
                        {children}
                    </View>
                );
            }}
        </Pressable>
    );
};

export default PressableOpacity;