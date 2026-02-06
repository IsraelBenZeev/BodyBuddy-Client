import { useWorkoutPlan } from '@/src/hooks/useWorkout';
import BackGround from '@/src/ui/BackGround';
import Loading from '@/src/ui/Loading';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Header from '../review/Header';
import ReviewWorkoutPlan from '../review/ReviewWorkoutPlan';
import Session from './active/Session';
import { useAuthStore } from '@/src/store/useAuthStore';

interface Props {
  id: string;
}


const SessionManager = ({ id }: Props) => {
  const user = useAuthStore((state) => state.user);
  const { height } = useWindowDimensions();
  const { data: workoutPlan, isLoading: workoutPlanLoading } = useWorkoutPlan(id, user?.id as string);
  const [isStart, setIsStart] = useState(false);
  const [startSession, setStartSession] = useState<Date>();

  if (workoutPlanLoading)
    return (
      <BackGround>
        <Loading size="large" />
      </BackGround>
    );

  return (
    <View className="flex-1 bg-background-900">
      <Header workoutPlan={workoutPlan} />

      {!isStart && <ReviewWorkoutPlan workoutPlan={workoutPlan} setIsStart={setIsStart} />}
      {isStart && <Session setIsStart={setIsStart} workoutPlan={workoutPlan} />}
    </View>
  );
};

export default SessionManager;
