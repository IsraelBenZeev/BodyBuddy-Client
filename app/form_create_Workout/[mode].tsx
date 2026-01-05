import AddWorkoutPlan from '@/src/Features/workoutsPlans/AddWorkoutPlan';
import { modeAddWorkoutPlan } from '@/src/types/mode';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { mode } = useLocalSearchParams(); // מקבל את הפרמטר מהכתובת

  return <AddWorkoutPlan mode={mode as modeAddWorkoutPlan} />;
}
