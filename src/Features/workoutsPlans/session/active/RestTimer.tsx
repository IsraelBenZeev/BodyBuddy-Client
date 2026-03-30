import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

interface RestTimerProps {
    startTime: number;
    endTime: number | null;
}

const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const RestTimer = ({ startTime, endTime }: RestTimerProps) => {
    const isFrozen = endTime != null;

    const [elapsed, setElapsed] = useState<number>(() =>
        isFrozen ? endTime - startTime : Date.now() - startTime
    );

    const dotOpacity = useSharedValue(1);

    useEffect(() => {
        if (!isFrozen) {
            dotOpacity.value = withRepeat(withTiming(0.15, { duration: 700 }), -1, true);
        }
    }, [isFrozen]);

    useEffect(() => {
        if (isFrozen) {
            setElapsed(endTime - startTime);
            return;
        }
        const id = setInterval(() => {
            setElapsed(Date.now() - startTime);
        }, 1000);
        return () => clearInterval(id);
    }, [startTime, endTime, isFrozen]);

    const dotStyle = useAnimatedStyle(() => ({
        opacity: dotOpacity.value,
    }));

    return (
        <Animated.View
            entering={FadeIn.duration(300)}
            className="flex-row items-center justify-center gap-2 py-2"
        >
            <View className="flex-1 h-px bg-white/10" />

            <View
                className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                    isFrozen
                        ? 'bg-background-800 border-lime-500/30'
                        : 'bg-background-800 border-white/10'
                }`}
            >
                {isFrozen ? (
                    <Animated.View entering={FadeIn.duration(200)}>
                        <Text className="text-lime-500 text-xs">✓</Text>
                    </Animated.View>
                ) : (
                    <Animated.View
                        style={[dotStyle]}
                        className="w-1.5 h-1.5 rounded-full bg-lime-400"
                    />
                )}
                <Text
                    className={`typo-caption-bold font-mono ${
                        isFrozen ? 'text-lime-500' : 'text-white/50'
                    }`}
                >
                    מנוחה: {formatTime(elapsed)}
                </Text>
            </View>

            <View className="flex-1 h-px bg-white/10" />
        </Animated.View>
    );
};

export default RestTimer;
