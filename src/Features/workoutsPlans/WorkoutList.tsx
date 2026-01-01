import { colors } from '@/colors';
import { useCreateWorkoutPlan, useWorkoutsPlans } from '@/src/hooks/useWorkout';
import { WorkoutPlan } from '@/src/types/workout';
import BackGround from '@/src/ui/BackGround';
import { IconAddToList } from '@/src/ui/IconsSVG';
import Loading from '@/src/ui/Loading';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import CustomCarousel from '../../ui/CustomCarousel';
import CardPlan from './CardPlan';
const idsExercises = [
  '01qpYSe',
  '03lzqwk',
  '05Cf2v8',
  '0br45wL',
  '0CXGHya',
  '0dCyly0',
  '0I5fUyn',
  '0IgNjSM',
  '0jp9Rlz',
  '0JtKWum',
  '0L2KwtI',
];
const userID = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';
const planExample: WorkoutPlan = {
  user_id: userID,
  title: 'תכנית ABC - גוף מלא למתחילים',
  description: 'תכנית אימון לגוף מלא עם דגש על טכניקה נכונה',
  time: 60,
  difficulty: 2,
  days_per_week: [1, 3, 5],
  exercise_ids: idsExercises,
};

const WorkoutList = () => {
  const { data: plansData, isLoading: isLoadingPlans } = useWorkoutsPlans(userID);
  const { mutate: createWorkoutPlan, isPending } = useCreateWorkoutPlan(userID);
  const router = useRouter();
  return (
    <BackGround>
      <View className=" h-full items-center justify-center">
        <View className="h-flex-1 ">
          <Text className="text-white text-2xl font-bold">האימונים שלי</Text>
        </View>
        {isLoadingPlans ? (
          <Loading />
        ) : (
          <View className="w-full ">
            <CustomCarousel
              data={plansData || []}
              renderItem={(item: any) => <CardPlan plan={item} />}
              widthCard={280}
            />
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/form_create_Workout/[params]',
              params: { params: 'a' },
            });
          }}
          className="bg-lime-500 absolute -bottom-4 left-10 items-center justify-center rounded-full p-3"
        >
          <IconAddToList color={colors.background[900]} size={30} />
          <Text className="text-background-900 font-bold text-[0.0rem] text-center">
            {isPending ? 'יוצר...' : 'צור אימון חדש'}
          </Text>
        </TouchableOpacity>
      </View>
    </BackGround>
  );
};

export default WorkoutList;
