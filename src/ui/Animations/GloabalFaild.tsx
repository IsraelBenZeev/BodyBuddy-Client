import { useUIStore } from '@/src/store/useUIStore';
import LottieView from 'lottie-react-native';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function GlobalFaild() {
    const { isSuccessVisible, message, hideSuccess, type } = useUIStore();

    if (!isSuccessVisible || type !== 'failed') return null;

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            pointerEvents="none" // חשוב! מאפשר ללחוץ "דרך" האנימציה
            className="absolute inset-0 z-[999] items-center justify-center bg-background-950/20"
        >
            <View className="bg-background-900 p-6 rounded-3xl items-center shadow-2xl border border-white/10">
                <LottieView
                    source={require('@/assets/animations/Error.lottie')}
                    autoPlay
                    loop={false}
                    onAnimationFinish={hideSuccess} // נסגר אוטומטית כשה-V מסתיים
                    style={{ width: 100, height: 100 }}
                    colorFilters={[
                        {
                            keypath: "**",
                            color: "red" // כאן שמים את קוד ה-HEX של הצבע (זה הליים שלך)
                        },
                    ]}
                />
                {message ? (
                    <Text className="text-red-500 text-lg font-bold mt-2 italic uppercase">
                        {message}
                    </Text>
                ) : null}
            </View>
        </Animated.View>
    );
}