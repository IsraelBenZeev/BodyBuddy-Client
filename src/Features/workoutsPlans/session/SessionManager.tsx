import { useWorkoutPlan } from '@/src/hooks/useWorkout';
import BackGround from '@/src/ui/BackGround';
import Loading from '@/src/ui/Loading';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Header from '../review/Header';
import ReviewWorkoutPlan from '../review/ReviewWorkoutPlan';
import Session from './active/Session';

interface Props {
  id: string;
}

const user_id = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';

const SessionManager = ({ id }: Props) => {
  const { height } = useWindowDimensions();
  const { data: workoutPlan, isLoading: workoutPlanLoading } = useWorkoutPlan(id, user_id);
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
