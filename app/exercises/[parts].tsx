import ExercisesScreen from '@/src/Features/exercises/ExercisesScreen';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { parts, page, mode } = useLocalSearchParams(); // מקבל את הפרמטר מהכתובת
  return <ExercisesScreen bodyParts={parts} page={page} mode={mode} />; // מציג את מסך הרשימה
}
