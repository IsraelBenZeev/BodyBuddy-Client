import LottieView from 'lottie-react-native';
import { View } from 'react-native';

export default function DumbbellAnimation({ size }: { size: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <LottieView
        source={require('@/assets/animations/dumbell animation.json')}
        autoPlay
        loop={true}
        style={{ width: size, height: size }}
      />
    </View>
  );
}
