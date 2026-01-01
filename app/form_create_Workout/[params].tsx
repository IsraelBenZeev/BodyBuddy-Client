import AddWorkoutPlan from '@/src/Features/workoutsPlans/AddWorkoutPlan';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const {} = useLocalSearchParams(); // מקבל את הפרמטר מהכתובת

  return <AddWorkoutPlan />;
}
