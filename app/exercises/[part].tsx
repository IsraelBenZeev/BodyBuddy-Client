import ExercisesScreen from '@/src/Features/exercises/ExercisesScreen';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { part, page } = useLocalSearchParams(); // מקבל את הפרמטר מהכתובת

  return <ExercisesScreen bodyPart={part} page={page} />; // מציג את מסך הרשימה
}
