import { useUIStore } from '@/src/store/useUIStore';
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function GlobalSuccess() {
    const { isSuccessVisible, message, hideSuccess, type } = useUIStore();

    useEffect(() => {
        if (!isSuccessVisible || type !== 'success') return;
        const timer = setTimeout(hideSuccess, 3000);
        return () => clearTimeout(timer);
    }, [isSuccessVisible, hideSuccess, type]);

    if (!isSuccessVisible || type !== 'success') return null;

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            pointerEvents="none" // חשוב! מאפשר ללחוץ "דרך" האנימציה
            className="absolute inset-0 z-[999] items-center justify-center bg-background-950/20"
        >
            <View className="bg-background-900 p-6 rounded-3xl items-center shadow-2xl border border-white/10">
                <LottieView
                    source={require('@/assets/animations/Success.json')}
                    autoPlay
                    loop={false}
                    onAnimationFinish={hideSuccess} // נסגר אוטומטית כשה-V מסתיים
                    style={{ width: 100, height: 100 }}
                    colorFilters={[
                        {
                            keypath: "**",
                            color: "#96C828"
                        },
                    ]}
                />
                {message ? (
                    <Text className="text-lime-500 text-lg font-bold mt-2 italic uppercase">
                        {message}
                    </Text>
                ) : null}
            </View>
        </Animated.View>
    );
}