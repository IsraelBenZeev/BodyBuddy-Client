import { useExercises } from '@/src/hooks/useEcercises';
import { Exercise } from '@/src/types';
import BackGround from '@/src/ui/BackGround';
import ButtonBack from '@/src/ui/ButtonBack';
import { useRouter } from 'expo-router';
import { Text, View,ActivityIndicator } from 'react-native';

interface ExercisesScreenProps {
  bodyPart: string | string[] | undefined;
  page?: string | string[] | undefined;
}
const ExercisesScreen = ({ bodyPart, page }: ExercisesScreenProps) => {
  const router = useRouter();
  console.log('bodyPart:', bodyPart, 'page:', page);

  const { data, isLoading } = useExercises(bodyPart as string, 0);

  return (
    <BackGround>
      <View>
        {/* <>{true && <ActivityIndicator size="large" color="#00ff00" />}</> */}
        {/* <Text>{}</Text> */}
        {data.data?.map((exercise: Exercise, i: number) => (
          <View key={i}>
            <Text className='text-white'>{exercise.bodyParts.at(0) + exercise.name}</Text>
          </View>
        ))}
        <ButtonBack />
      </View>
    </BackGround>
  );
};

export default ExercisesScreen;
