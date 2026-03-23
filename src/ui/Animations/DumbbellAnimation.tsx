import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';

export default function DumbbellAnimation({ size }: { size: number }) {
  const animRef = useRef<LottieView>(null);

  useEffect(() => {
    animRef.current?.play();
    return () => animRef.current?.pause();
  }, []);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <LottieView
        ref={animRef}
        source={require('@/assets/animations/dumbell animation.json')}
        autoPlay={false}
        loop={true}
        style={{ width: size, height: size }}
      />
    </View>
  );
}
