import AddWorkoutPlan from '@/src/Features/workoutsPlans/form/AddWorkoutPlan';
import { modeAddWorkoutPlan } from '@/src/types/mode';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { mode, workout_plan_id } = useLocalSearchParams(); // מקבל את הפרמטר מהכתובת

  return <AddWorkoutPlan mode={mode as modeAddWorkoutPlan} workout_plan_id={workout_plan_id as string} />;
}
