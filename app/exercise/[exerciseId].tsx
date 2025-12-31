import ExerciseScreen from '@/src/Features/exercises/ExerciseScreen';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { exerciseId } = useLocalSearchParams(); // מקבל את הפרמטר מהכתובת

  return <ExerciseScreen exerciseId={exerciseId as string} />; // מציג את מסך הרשימה
}
