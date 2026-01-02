import ExercisesScreen from '@/src/Features/exercises/ExercisesScreen';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { parts, mode } = useLocalSearchParams(); // מקבל את הפרמטר מהכתובת
  return <ExercisesScreen bodyParts={parts} mode={mode} />; // מציג את מסך הרשימה
}
