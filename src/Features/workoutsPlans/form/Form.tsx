import { colors } from '@/colors';
import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import { useCreateWorkoutPlan } from '@/src/hooks/useWorkout';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import { modeAddWorkoutPlan } from '@/src/types/mode';
import { formFailds } from '@/src/types/workout';
import FormInput from '@/src/ui/FormInput';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Days from './Days';
import HeaderForm from './HeaderForm';
import ListExercise from './ListExercises';
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
  'chest',
];
interface FormProps {
  mode: modeAddWorkoutPlan;
  workout_plan_id?: string;
}
const user_id = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';
const Form = ({ mode, workout_plan_id }: FormProps) => {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const initialValues = useMemo(() => {
    if (mode !== "edit") return undefined;
    return {
      user_id: user_id,
      title: 'test',
      description: 'test',
      exercise_ids: [
        "gSw59a4",
        "RSOsp5d",
        "hoXt6wv"
      ],
      time: 90,
      difficulty: 3,
      days_per_week: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
      workout_plan_id: workout_plan_id,
    } as formFailds;
  }, [mode, workout_plan_id]);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<formFailds>({
    defaultValues: initialValues,
  });
  const selectedIds = useWorkoutStore((state) => state.selectedExerciseIds);
  const toggleExercise = useWorkoutStore((state) => state.toggleExercise);
  const { data: selectedExercisesData = [], isLoading } = useGetExercisesByIds(
    mode === "edit" ? (initialValues?.exercise_ids || []) : selectedIds
  );
  const router = useRouter();
  const { mutate: createWorkoutPlan, isPending: isPendingCreate, isSuccess: isSuccessCreate } = useCreateWorkoutPlan(user_id)
  const navigateToPicker = () => {
    router.push({
      pathname: '/exercises/[parts]',
      params: { parts: JSON.stringify(bodyParts), mode: 'picker' },
    });
  };
  const onSubmit = (data: formFailds) => {
    if (!data.description) {
      data.description = '';
    }
    data.user_id = user_id;
    data.exercise_ids = selectedIds;
    createWorkoutPlan(data)
  };

  useEffect(() => {
    if (isSuccessCreate) {
      router.replace('/workouts')
    }
  }, [isSuccessCreate])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-950"
    >
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <HeaderForm
          navigateToPicker={navigateToPicker}
          selectedExercisesData={selectedExercisesData}
        />

        <View className="mb-8" style={{ maxHeight: SCREEN_HEIGHT * 0.25 }}>
          <ListExercise
            selectedExercisesData={selectedExercisesData}
            toggleExercise={toggleExercise}
            navigateToPicker={navigateToPicker}
            selectedIds={selectedIds}
            isPendingCreate={isPendingCreate}
          />
        </View>

        <View className="gap-6">
          <View>
            <FormInput
              control={control}
              isPendingCreate={isPendingCreate}
              name="title"
              rules={{
                required: 'חובה להזין שם אימון',
              }}
              label="שם האימון"
              placeholder="לדוגמה: אימון כוח עליון A"
              inputStyle={styles.inputStyle}
              errorStyle={styles.errorStyle}
              labelStyle={styles.labelStyle}
              containerStyle={styles.containerStyle}
              placeholderTextColor={colors.background[500]}
            />
          </View>

          <View>
            <FormInput
              control={control}
              isPendingCreate={isPendingCreate}
              name="description"
              label="תיאור ודגשים"
              placeholder="הוסף הערות או דגשים לאימון..."
              multiline={true}
              inputStyle={[styles.inputStyle, styles.textAreaStyle]}
              errorStyle={styles.errorStyle}
              labelStyle={styles.labelStyle}
              containerStyle={styles.containerStyle}
              placeholderTextColor={colors.background[500]}
            />
          </View>
          <TimeInput control={control} name="time" isPendingCreate={isPendingCreate} />
          <Days control={control} name="days_per_week" isPendingCreate={isPendingCreate} />
          <Slider control={control} name="difficulty" isPendingCreate={isPendingCreate} />
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-5 bg-background-950/95 border-t border-background-800">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
          className="bg-lime-500 p-4 rounded-2xl items-center flex-row justify-center shadow-lg shadow-lime-500/20"
        >
          <Text className="font-bold text-background-950 text-xl tracking-wide">{isPendingCreate ?
            <View className='flex-row items-center gap-2'>
              <ActivityIndicator color={colors.background[950]} />
              <Text className="text-background-950">{mode === "create" ? "יוצר עבורך את האימון..." : "מעדכן את האימון..."}</Text>
            </View> : mode === "create" ? 'צור אימון חדש' : 'עדכן את האימון'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Form;

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 4,
  },
  labelStyle: {
    color: colors.background[400],
    marginBottom: 8,
    textAlign: 'right',
    fontWeight: '700',
    fontSize: 14,
  },
  inputStyle: {
    height: 56,
    backgroundColor: colors.background[800],
    borderColor: colors.background[700],
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    color: colors.lime[500],
    textAlign: "right",
    fontSize: 16,
    fontWeight: '500',
  },
  textAreaStyle: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  errorStyle: {
    color: '#ef4444',
    marginTop: 4,
    textAlign: 'right',
    fontSize: 12,
  },
});