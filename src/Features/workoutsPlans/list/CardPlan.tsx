import { colors } from '@/colors';
import { useDeleteWorkoutPlan } from '@/src/hooks/useWorkout';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import { daysInHebrew, WorkoutPlan } from '@/src/types/workout';
// import { IconCalendar } from '@/src/ui/IconsSVG';
import AppButton from '@/src/ui/PressableOpacity';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { router, useFocusEffect } from 'expo-router';
import { CalendarClock, Dumbbell } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Buttons from './Buttons';
import { useAuthStore } from '@/src/store/useAuthStore';
interface CardPlanProps {
  plan: WorkoutPlan;
  isActive: boolean;
  isSwiped: boolean;
}
const CardPlan = ({ plan, isActive }: CardPlanProps) => {
  const [deleteId, setDeleteId] = useState<string>('');
  const user = useAuthStore((state) => state.user);
  const {
    mutateAsync: deleteWorkoutPlanMutation,
    isPending: deletePending,
    isSuccess: deleteSuccess,
  } = useDeleteWorkoutPlan(user?.id as string);
  const toggleExercise = useWorkoutStore((state) => state.toggleExercise);
  const clearAllExercises = useWorkoutStore((state) => state.clearAllExercises);
  const [isShowButtons, setIsShowButtons] = useState<boolean>(false);

  useEffect(() => {
    if (deleteSuccess) {
      setDeleteId('');
    }
  }, [deletePending, deleteSuccess]);
  const translateY = useSharedValue(0);
  const handleViewWorkout = useCallback(() => {
    router.navigate({
      pathname: '/workout_plan/[paramse]',
      params: { paramse: plan.id || '' },
    });
  }, [plan.id]);

  const handlePress = useCallback(() => {
    const isOpening = translateY.value === 0;
    const gentleConfig = {
      damping: 18,
      stiffness: 90,
      mass: 1,
      overshootClamping: true,
    };

    if (isOpening) {
      translateY.value = withSpring(-100, gentleConfig);
      setIsShowButtons(true);
    } else {
      translateY.value = withSpring(0, gentleConfig);
      setIsShowButtons(false);
    }
  }, [translateY]);

  const handleOptions = useCallback(() => {
    if (isActive) handlePress();
  }, [isActive, handlePress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (translateY.value !== 0) {
          translateY.value = withTiming(0, { duration: 600 });
          setIsShowButtons(false);
        }
      };
    }, [])
  );
  useEffect(() => {
    if (!isActive) {
      translateY.value = withTiming(0);
      setIsShowButtons(false);
    }
  }, [isActive]);

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          height: 470,
          width: 280,
          backgroundColor: '#18181b',
          borderWidth: 1,
          borderRadius: 40,
          marginTop: 30,
        },
      ]}
    >
      <View className="h-40 w-full relative rounded-t-[40px]">
        <Image
          source={require('../../../../assets/images/bg-9.jpg')}
          className="w-full h-full opacity-60 rounded-t-[40px]"
        />
        <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-900" />
      </View>

      {/* 2. תוכן האימון */}
      <View className="p-5 flex-1 justify-between ">
        {/* <View className="bd"> */}

        <View>
          <Text className="typo-caption-bold text-lime-500 mb-1 uppercase tracking-widest">
            Workout Plan
          </Text>
          <Text numberOfLines={2} className="typo-h2 text-white leading-7">
            {plan.title}
          </Text>
        </View>

        <Text numberOfLines={3} className="typo-label text-zinc-400 mt-3 leading-5">
          {plan?.description}
        </Text>
        <View className="flex-row items-center gap-2">
          <Dumbbell size={18} color={colors.lime[500]} strokeWidth={1.25} />
          <Text className="typo-caption text-zinc-300">{plan?.exercise_ids.length} תרגילים</Text>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-4">
          <CalendarClock size={18} color={colors.lime[500]} strokeWidth={1.25} />
          {plan?.days_per_week.map((day) => (
            <View key={day} className="bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
              <Text className="typo-caption text-zinc-300">{daysInHebrew[day]}</Text>
            </View>
          ))}
        </View>

        {/* 4. חלק תחתון - כפתור ונתונים */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-4 px-1">
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons name="clock-fast" size={16} color={colors.lime[500]} />
              <Text className="typo-caption-bold text-white mr-1">{plan.time} דק׳</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons name="trending-up" size={16} color={colors.lime[500]} />
              <Text className="typo-caption-bold text-white mr-1">{plan.difficulty}</Text>
            </View>
          </View>
          <View className="flex-row items-center justify-center gap-4">
            <View className="flex-1">
              <AppButton
                haptic="medium"
                animationType="opacity"
                className="bg-lime-500 px-3 py-2 rounded-2xl items-center"
                accessibilityLabel={`הצג אימון: ${plan.title}`}
                onPress={handleViewWorkout}
              >
                <Text className="typo-btn-cta text-background-850">הצג אימון</Text>
              </AppButton>
            </View>
            <View className="flex-col items-center gap-1">
              <AppButton
                haptic="medium"
                animationType="opacity"
                hitSlop={6}
                className="items-center justify-center border border-lime-500 rounded-full p-1"
                accessibilityLabel="אפשרויות"
                onPress={handleOptions}
              >
                <SimpleLineIcons name="options" size={24} color={colors.lime[500]} />
              </AppButton>
              {/* <Text className='text-lime-500 text-xs'>אפשרויות</Text> */}
            </View>
          </View>
        </View>
      </View>

      {isActive && isShowButtons && <Buttons plan={plan} />}
    </Animated.View>
  );
};

export default CardPlan;
