import { colors } from '@/colors';
import { useGetExercisesFromCache } from '@/src/hooks/useCash';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import FormInput from '@/src/ui/FormInput';
import { Text } from '@react-navigation/elements';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ListExercise from '../ListExercises';
import HeaderForm from './HeaderForm';
import Slider from './Slider';
import TimeInput from './TimeInput';
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
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const queryClient = useQueryClient();
  const { control, handleSubmit, formState: { errors } } = useForm();
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
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <View style={{}} className="flex-1 px-4 py-2 gap-4 ">
      <HeaderForm
        navigateToPicker={navigateToPicker}
        selectedExercisesData={selectedExercisesData}
      />
      <View
        style={{ maxHeight: SCREEN_HEIGHT * 0.4 }}
        className="justify-center py-10 px-2 border-2 border-background-700 rounded-2xl"
      >
        <ListExercise
          selectedExercisesData={selectedExercisesData}
          toggleExercise={toggleExercise}
          navigateToPicker={navigateToPicker}
          selectedIds={selectedIds}
        />
      </View>
      {/* <ScrollView className="flex-1 p-4 border-2 border-background-700 rounded-2xl"> */}

      <ScrollView className='flex-1 p-4 border-2 border-background-700 rounded-2xl'>

        <FormInput
          control={control}
          name="workoutName"
          rules={{
            required: 'חובה להזין שם אימון',
          }}
          label="שם האימון"
          placeholder="שם האימון..."
          inputStyle={styles.inputStyle}
          errorStyle={styles.errorStyle}
          labelStyle={styles.labelStyle}
          containerStyle={styles.containerStyle}
          placeholderTextColor={colors.background[300]}
        />
        <FormInput
          control={control}
          name="description"
          label="תיאור"
          placeholder="תיאור..."
          multiline={true}
          inputStyle={[styles.inputStyle, { height: 100, }]}
          errorStyle={styles.errorStyle}
          labelStyle={styles.labelStyle}
          containerStyle={styles.containerStyle}
          placeholderTextColor={colors.background[300]}
        />
        <TimeInput control={control} name="time" />
        <Slider control={control} name="difficulty" />
      </ScrollView>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="bg-lime-500 p-4 rounded-2xl mt-auto items-center"
      >
        <Text className="font-bold text-lg">שמור אימון</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Form;
const styles = StyleSheet.create({
  containerStyle: {
    gap: 4,
    marginBottom: 8,

  },
  inputStyle: {
    height: 40,
    borderColor: colors.lime[500],
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: colors.lime[500],
    textAlign: "right"


  },
  errorStyle: {
    color: 'red',
    marginBottom: 12,
  },

  labelStyle: {
    color: colors.lime[500],
    // marginBottom: 8,
    textAlign: 'right',
    fontWeight: 'bold',
  },


});