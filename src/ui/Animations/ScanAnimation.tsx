import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';

export default function ScanAnimation() {
    const animRef = useRef<LottieView>(null);

    useEffect(() => {
        animRef.current?.play();
        return () => animRef.current?.pause();
    }, []);

    return (
        <View
            className="rounded-3xl items-center justify-center overflow-hidden bg-background-800 border border-lime-500/25"
            style={{ width: 160, height: 160 }}
        >
            <LottieView
                ref={animRef}
                source={require('@/assets/animations/Restaurant Food Loading.json')}
                autoPlay={false}
                loop={true}
                style={{ width: 160, height: 160 }}
            />
        </View>
    );
}
