import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface StepDotsProps {
  totalSteps: number;
  currentStep: number;
}

const DOT_SIZE = 10;
const ACTIVE_WIDTH = 28;

const StepDots = ({ totalSteps, currentStep }: StepDotsProps) => {
  return (
    <View className="flex-row-reverse justify-center items-center gap-2 py-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <Dot key={index} isActive={index === currentStep} />
      ))}
    </View>
  );
};

interface DotProps {
  isActive: boolean;
}

const Dot = ({ isActive }: DotProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(isActive ? ACTIVE_WIDTH : DOT_SIZE, {
        damping: 15,
        stiffness: 150,
      }),
      opacity: withSpring(isActive ? 1 : 0.4, {
        damping: 15,
        stiffness: 150,
      }),
    };
  }, [isActive]);

  return (
    <Animated.View
      style={[
        {
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          backgroundColor: isActive
            ? 'rgb(150, 200, 40)' // lime-500
            : 'rgb(113, 113, 122)', // background-400
        },
        animatedStyle,
      ]}
    />
  );
};

export default StepDots;
