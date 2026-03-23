import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

export default function ScanAnimation() {
    const animRef = useRef<LottieView>(null);

    useEffect(() => {
        animRef.current?.play();
        return () => animRef.current?.pause();
    }, []);

    return (
        <View className="items-center py-4">
            <LottieView
                ref={animRef}
                source={require('@/assets/animations/Circle.json')}
                autoPlay={false}
                loop={true}
                style={{ width: 220, height: 220 }}
                colorFilters={[
                    {
                        keypath: '**',
                        color: '#96C828',
                    },
                ]}
            />
            <Text className="text-white font-black text-lg -mt-2">מנתח את הארוחה...</Text>
            <Text className="text-gray-500 text-sm mt-1">ה-AI עובד על זה, רגע</Text>
        </View>
    );
}
