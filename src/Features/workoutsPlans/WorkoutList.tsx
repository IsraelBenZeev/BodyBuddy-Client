import { colors } from '@/colors';
import { useWorkoutsPlans } from '@/src/hooks/useWorkout';
import BackGround from '@/src/ui/BackGround';
import { IconAddToList } from '@/src/ui/IconsSVG';
import Loading from '@/src/ui/Loading';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import CustomCarousel from '../../ui/CustomCarousel';
import CardPlan from './CardPlan';
const userID = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';

const WorkoutList = () => {
  const { data: plansData, isLoading: isLoadingPlans } = useWorkoutsPlans(userID);
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
              renderItem={(item: any, isActive: boolean) => <CardPlan plan={item} isActive={isActive} />}
              widthCard={280}
            />
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/form_create_Workout/[mode]',
              params: { mode: 'create' },
            });
          }}
          className="bg-lime-500 absolute -bottom-4 left-10 items-center justify-center rounded-full p-3 w-16 h-16 shadow-xl"
          style={{
            elevation: 8,
            shadowColor: colors.lime[500],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
          }}
        >
          <IconAddToList color={colors.background[900]} size={36} />
        </TouchableOpacity>
      </View>
    </BackGround>
  );
};

export default WorkoutList;
