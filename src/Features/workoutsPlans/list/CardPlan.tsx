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
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Buttons from './Buttons';
interface CardPlanProps {
  plan: WorkoutPlan;
  isActive: boolean;
  isSwiped: boolean;
  translateY: SharedValue<number>;
}
const user_id = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';
const CardPlan = ({ plan, isActive }: CardPlanProps) => {
  const [deleteId, setDeleteId] = useState<string>("");
  const { mutateAsync: deleteWorkoutPlanMutation, isPending: deletePending, isSuccess: deleteSuccess } = useDeleteWorkoutPlan(user_id)
  const toggleExercise = useWorkoutStore((state) => state.toggleExercise);
  const clearAllExercises = useWorkoutStore((state) => state.clearAllExercises);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);  // const handleDelete = (id: string) => {
  const [isShowButtons, setIsShowButtons] = useState<boolean>(false);


  useEffect(() => {
    if (deleteSuccess) {
      setDeleteId("")
    }
  }, [deletePending, deleteSuccess])
  const translateY = useSharedValue(0);
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
    <Animated.View style={[animatedStyle, { height: 470, width: 280, backgroundColor: '#18181b', borderWidth: 1, borderRadius: 40, marginTop: 30 }]}>
      <View className="h-40 w-full relative rounded-t-[40px]">
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400',
          }}
          className="w-full h-full opacity-60 rounded-t-[40px]"
        />
        <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-900" />
      </View>

      {/* 2. תוכן האימון */}
      <View className="p-5 flex-1 justify-between">
        {/* <View className="bd"> */}

        <Text className="text-lime-500 font-bold text-xs text-right mb-1 uppercase tracking-widest">
          Workout Plan
        </Text>
        <Text numberOfLines={2} className="text-white text-2xl font-bold text-right leading-7">
          {plan.title}
        </Text>

        <Text numberOfLines={3} className="text-zinc-400 text-sm text-right mt-3 leading-5">
          {plan?.description}
        </Text>
        <View className="flex-row items-center gap-2 self-end">
          <Text className="text-zinc-300 text-[10px]">{plan?.exercise_ids.length} תרגילים</Text>
          <Dumbbell size={18} color={colors.lime[500]} strokeWidth={1.25} />
        </View>

        <View className="flex-row-reverse flex-wrap gap-2 mt-4">
          <CalendarClock size={18} color={colors.lime[500]} strokeWidth={1.25} />
          {plan?.days_per_week.map((day, index) => (
            <View
              key={index}
              className="bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700"
            >
              <Text className="text-zinc-300 text-[10px]">{daysInHebrew[day]}</Text>
            </View>
          ))}
        </View>

        {/* 4. חלק תחתון - כפתור ונתונים */}
        <View className="mt-6">
          <View className="flex-row-reverse justify-between items-center mb-4 px-1">
            <View className="flex-row-reverse items-center">
              <MaterialCommunityIcons name="clock-fast" size={16} color={colors.lime[500]} />
              <Text className="text-white text-xs mr-1 font-bold">{plan.time} דק'</Text>
            </View>
            <View className="flex-row-reverse items-center">
              <MaterialCommunityIcons name="trending-up" size={16} color={colors.lime[500]} />
              <Text className="text-white text-xs mr-1 font-bold">{plan.difficulty}</Text>
            </View>
          </View>
          <View className="flex-row-reverse items-center justify-center gap-4">
            <View className='flex-1'>
              <AppButton
                haptic="medium"
                animationType="opacity"
                className='bg-lime-500 px-3 py-2 rounded-2xl items-center'
                onPress={() => {
                  router.push({
                    pathname: '/workout_plan/[paramse]',
                    params: {
                      paramse: plan.id || '',
                    },
                  });
                }} ><Text className='text-background-850 text-lg font-bold'>הצג אימון</Text>
              </AppButton>
            </View>
            <View className='flex-col items-center gap-1'>
              <AppButton
                haptic="medium"
                animationType="opacity"
                className='items-center justify-center border border-lime-500 rounded-full p-1'
                onPress={() => {
                  if (isActive) {
                    // קורא לפונקציה אחת בלבד שמנהלת הכל!
                    handlePress();
                  }
                }}>
                <SimpleLineIcons name="options" size={24} color={colors.lime[500]} />
              </AppButton>
              {/* <Text className='text-lime-500 text-xs'>אפשרויות</Text> */}
            </View>
          </View>
        </View>
      </View>

      {isActive && isShowButtons && (
        <Buttons plan={plan} />
      )}


    </Animated.View>
  );
};

export default CardPlan;
