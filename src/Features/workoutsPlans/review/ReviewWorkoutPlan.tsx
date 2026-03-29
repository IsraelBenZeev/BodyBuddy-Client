import { SessionDBType } from '@/src/types/session';
import { WorkoutPlan } from '@/src/types/workout';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { View as AnimatedView } from 'react-native-animatable';
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import HoldButton from '@/src/ui/HoldButton';
import ModalBottom from '@/src/ui/ModalButtom';
// import TabsManager from '../../exercises/TabsMenager';
// import ListExercise from '../form/ListExercises';
import CardWorkouPlan from './CardWorkouPlan';
import CountdownModal from './CountdownModal';
import ExercisesProgress from './ExercisesProgress';
import History from './History';
import SessionInformation from './SessionInformation';
import ListExercise from '../form/ListExercises';
import TabsManager from '@/src/Features/exercises/TabsMenager';
interface Props {
  workoutPlan: WorkoutPlan;
  setIsStart: Dispatch<SetStateAction<boolean>>;
}
const ReviewWorkoutPlan = ({ workoutPlan, setIsStart }: Props) => {
  const sheetRef = useRef<any>(null);

  const { height } = useWindowDimensions();
  const [selectedSession, setSelectedSession] = useState<SessionDBType | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const handleStartWorkout = useCallback(() => setShowCountdown(true), []);
  const handleCountdownStart = useCallback(() => { setShowCountdown(false); setIsStart(true); }, [setIsStart]);
  const handleCountdownCancel = useCallback(() => setShowCountdown(false), []);
  const handleCloseSession = useCallback(() => setSelectedSession(null), []);

  // Pulsing rings — מופיעים רק בזמן לחיצה
  const ring1Scale = useSharedValue(1);
  const ring1Opacity = useSharedValue(0);
  const ring2Scale = useSharedValue(1);
  const ring2Opacity = useSharedValue(0);

  useEffect(() => {
    if (isPressing) {
      const pulse = (scaleVal: typeof ring1Scale, opacityVal: typeof ring1Opacity, delay = 0) => {
        scaleVal.value = withDelay(delay, withRepeat(
          withSequence(
            withTiming(1.9, { duration: 1200, easing: Easing.out(Easing.ease) }),
            withTiming(1, { duration: 0 })
          ), -1
        ));
        opacityVal.value = withDelay(delay, withRepeat(
          withSequence(
            withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) }),
            withTiming(0.8, { duration: 0 })
          ), -1
        ));
      };
      pulse(ring1Scale, ring1Opacity, 0);
      pulse(ring2Scale, ring2Opacity, 600);
    } else {
      cancelAnimation(ring1Scale);
      cancelAnimation(ring1Opacity);
      cancelAnimation(ring2Scale);
      cancelAnimation(ring2Opacity);
      ring1Scale.value = withTiming(1, { duration: 250 });
      ring1Opacity.value = withTiming(0, { duration: 250 });
      ring2Scale.value = withTiming(1, { duration: 250 });
      ring2Opacity.value = withTiming(0, { duration: 250 });
    }
  }, [isPressing]);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Opacity.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Opacity.value,
  }));
  useEffect(() => {
    if (selectedSession?.id) {
      const timer = setTimeout(() => {
        sheetRef.current?.snapToIndex(1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedSession]);
  return (
    <Animated.View
      className="flex-1"
      entering={FadeIn.duration(600)} // משך זמן הכניסה במילי-שניות
      exiting={FadeOut.duration(400)} // משך זמן היציאה
    >
      <ScrollView className="">
        <AnimatedView
          animation="fadeInUp"
          duration={800}
          className="px-4 mt-4"
          style={{ maxHeight: height * 0.45 }}
        >
          <Text className="text-zinc-400 text-right mb-2 font-bold mr-2">תרגילים באימון</Text>
          <ListExercise
            key={workoutPlan?.exercise_ids?.join(',')}
            mode="preview"
            selectExercisesIds={workoutPlan?.exercise_ids}
          />
        </AnimatedView>
        <CardWorkouPlan workoutPlan={workoutPlan} />
        <TabsManager
          tabs={[
            {
              title: 'היסטוריה',
              Component: (
                <History
                  workoutPlanId={workoutPlan.id as string}
                  setSelectedSession={setSelectedSession}
                  selectedSession={selectedSession}
                  sheetRef={sheetRef}
                />
              ),
            },
            // { title: 'התקדמות', Component: <Graphs workoutPlanId={workoutPlan.id as string} /> },
            {
              title: 'התקדמות',
              Component: <ExercisesProgress workoutPlanId={workoutPlan.id as string} />,
            },
          ]}
        />
      </ScrollView>
      <View className="absolute bottom-10 left-0 right-0 items-center">
        {/* Tooltip — מופיע רק בזמן לחיצה */}
        {isPressing && (
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            className="mb-4 items-center"
          >
            <View className="bg-zinc-800 border border-zinc-600 px-4 py-2 rounded-full flex-row items-center gap-2">
              <MaterialCommunityIcons name="gesture-tap-hold" size={16} color="#a3e635" />
              <Text className="typo-caption text-zinc-300">המשך להחזיק להתחלת האימון</Text>
            </View>
            <View
              style={{ borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 7,
                borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#3f3f46' }}
            />
          </Animated.View>
        )}

        {/* Pulsing rings + FAB */}
        <View className="items-center justify-center" style={{ width: 96, height: 96 }}>
          <Animated.View
            style={[ring1Style, {
              position: 'absolute', width: 96, height: 96, borderRadius: 48,
              borderWidth: 2, borderColor: '#a3e635',
            }]}
          />
          <Animated.View
            style={[ring2Style, {
              position: 'absolute', width: 96, height: 96, borderRadius: 48,
              borderWidth: 2, borderColor: '#a3e635',
            }]}
          />
          <View style={{
            shadowColor: '#84cc16', shadowOpacity: 0.75,
            shadowRadius: 18, shadowOffset: { width: 0, height: 0 }, elevation: 18,
          }}>
            <HoldButton
              onPress={handleStartWorkout}
              onPressIn={() => setIsPressing(true)}
              onPressOut={() => setIsPressing(false)}
              className="bg-lime-500 w-24 h-24 rounded-full justify-center items-center"
              hapticOnComplete="success"
              holdDurationMs={1500}
              resetDurationMs={200}
              fillVariant="darken"
              fillColor="rgba(0,0,0,0.5)"
              accessibilityLabel="התחל אימון - החזק לאישור"
            >
              <MaterialCommunityIcons name="play" size={44} color="#14160a" />
            </HoldButton>
          </View>
        </View>
      </View>
      <CountdownModal
        visible={showCountdown}
        onCancel={handleCountdownCancel}
        onStart={handleCountdownStart}
      />
      <ModalBottom
        key={selectedSession?.id || ''}
        ref={sheetRef}
        title="פרטי האימון"
        initialIndex={-1}
        minHeight="50%"
        maxHeight="90%"
        enablePanDownToClose={true}
        onClose={handleCloseSession}
      >
        <SessionInformation sessionId={selectedSession?.id || ''} session={selectedSession} workoutPlanTitle={workoutPlan.title} />
      </ModalBottom>
    </Animated.View>
  );
};

export default ReviewWorkoutPlan;
