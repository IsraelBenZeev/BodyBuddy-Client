import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import { useGetExercisesIdsByWorkoutPlans } from '@/src/hooks/useWorkout';
import Accordion from '@/src/ui/Accordion';
import Loading from '@/src/ui/Loading';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { CardEmptyExercise, CardExerciseProgress, Title } from './CardExerciseProgress';
import { useAuthStore } from '@/src/store/useAuthStore';
interface Props {
  workoutPlanId: string;
}
const ExercisesProgress = ({ workoutPlanId }: Props) => {
  const user = useAuthStore((state) => state.user);
  const { data: exercisesLog, isPending } = useGetExercisesIdsByWorkoutPlans(
    workoutPlanId,
    user?.id as string
  );
  const { data: exercisesDetails, isPending: isPendingDetails } = useGetExercisesByIds(
    exercisesLog?.map((log) => log.exercise_id) || []
  );
  const processedExercises = useMemo(() => {
    if (!exercisesLog) return [];

    const grouped: Record<string, any> = {};

    exercisesLog.forEach((log) => {
      const id = log.exercise_id;
      if (!grouped[id]) {
        grouped[id] = {
          id: id,
          maxWeight: 0,
          maxReps: 0,
          maxSetsInOneSession: {},
          allLogs: [],
        };
      }

      if (log.weight > grouped[id].maxWeight) grouped[id].maxWeight = log.weight;
      if (log.reps > grouped[id].maxReps) grouped[id].maxReps = log.reps;

      const sessionId = log.session_id;
      grouped[id].maxSetsInOneSession[sessionId] =
        (grouped[id].maxSetsInOneSession[sessionId] || 0) + 1;
      grouped[id].allLogs.push(log);
    });

    return Object.values(grouped).map((ex) => ({
      ...ex,
      maxSetsRecord: Math.max(...(Object.values(ex.maxSetsInOneSession) as number[])),
    }));
  }, [exercisesLog]);

  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);



  if (isPending || (isPendingDetails && exercisesLog ? exercisesLog?.length > 0 : false))
    return <Loading />;

  return (
    <View className="pb-20 px-4">
      <Text className="text-white text-xl font-bold mb-6 text-right">
        {exercisesLog?.length ? `תרגילים באימון` : 'לא בוצעו תרגילים עדיין'}
      </Text>

      {processedExercises.map((exercise: any, index: number) => {
        const exerciseDetails = exercisesDetails?.find(
          (detail: any) => detail.id === exercise.id || detail.exerciseId === exercise.id
        );
        if (exercise.maxReps === 0) {
          return (
            <CardEmptyExercise key={exercise.id} exerciseDetails={exerciseDetails} />
          );
        }

        return (
          <Accordion
            key={exercise.id}
            isOpen={openAccordionId === exercise.id}
            onToggle={() => {
              setOpenAccordionId(openAccordionId === exercise.id ? null : exercise.id);
            }}
            title={
              <Title exerciseDetails={exerciseDetails} />
            }
          >
            <CardExerciseProgress exercise={exercise} />
          </Accordion>
        );
      })}
    </View>
  );
};
export default ExercisesProgress;
