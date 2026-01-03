import { useGetExercisesFromCache } from '@/src/hooks/useCash';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import ListExercise from '../ListExercises';
import HeaderForm from './HeaderForm';
const bodyParts = [
  'neck',
  'lower arms',
  'shoulders',
  'cardio',
  'upper arms',
  'chest',
  'lower legs',
  'back',
  'upper legs',
  'waist',
];
const Form = () => {
  const queryClient = useQueryClient();
  const selectedIds = useWorkoutStore((state) => state.selectedExerciseIds);
  const toggleExercise = useWorkoutStore((state) => state.toggleExercise);
  const selectedExercisesData = useGetExercisesFromCache(selectedIds);
  const router = useRouter();
  const navigateToPicker = () => {
    router.push({
      pathname: '/exercises/[parts]',
      params: { parts: JSON.stringify(bodyParts), mode: 'picker' },
    });
  };

  return (
    <View className="flex-1 px-4">
      <HeaderForm
        navigateToPicker={navigateToPicker}
        selectedExercisesData={selectedExercisesData}
      />

      <ListExercise
        selectedExercisesData={selectedExercisesData}
        toggleExercise={toggleExercise}
        navigateToPicker={navigateToPicker}
        selectedIds={selectedIds}
      />
      <View className="flex-1 p-4">
        {/* <FormInput
          control={control}
          name="workoutName"
          rules={{
            required: 'חובה להזין שם אימון',
          }}
          label="שם האימון"
          placeholder="שם האימון..."
          style={errors.workoutName ? styles.errorStyle : styles.inputStyle}
        />
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-lime-500 p-4 rounded-2xl mt-auto items-center"
        >
          <Text className="font-bold text-lg">שמור אימון</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Form;
