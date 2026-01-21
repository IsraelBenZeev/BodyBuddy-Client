import { colors } from '@/colors';
import { useWorkoutsPlans } from '@/src/hooks/useWorkout';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import BackGround from '@/src/ui/BackGround';
import { IconAddToList, IconsFitnessTools } from '@/src/ui/IconsSVG';
import Loading from '@/src/ui/Loading';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import CustomCarousel from '../../../ui/CustomCarousel';
import CardPlan from './CardPlan';
import AppButton from '@/src/ui/PressableOpacity';

const userID = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';

const WorkoutList = () => {
  const { data: plansData, isLoading: isLoadingPlans } = useWorkoutsPlans(userID);
  const clearAllExercises = useWorkoutStore((state) => state.clearAllExercises);
  const router = useRouter();

  const handleCreateNew = () => {
    clearAllExercises();
    router.push({
      pathname: '/form_create_Workout/[mode]',
      params: { mode: 'create' },
    });
  };

  if (isLoadingPlans) {
    return (
      <BackGround>
        <Loading />
      </BackGround>
    );
  }

  return (
    <BackGround>
      <View className="flex-1 items-center justify-between py-10">
        <View className="mt-5">
          <Text className="text-white text-3xl font-bold tracking-tight">האימונים שלי</Text>
        </View>
        {plansData && plansData.length > 0 ? (
          <View className="w-full flex-1 justify-center">
            <CustomCarousel
              data={plansData}
              variant='center'
              renderItem={(item: any, isActive: boolean, isSwiped: boolean, translateY: SharedValue<number>) => (
                <CardPlan plan={item} isActive={isActive} isSwiped={isSwiped} translateY={translateY} />
              )}
              widthCard={280}
            />
          </View>
        ) : (
          <View className="items-center justify-center px-10 flex-1">
            <View className="bg-background-800 p-8 rounded-full mb-6 opacity-80">
              <IconsFitnessTools size={80} color={colors.lime[500]} />
            </View>
            <Text className="text-white text-xl font-semibold text-center mb-2">
              עדיין אין לך תוכניות אימון
            </Text>
            <Text className="text-gray-400 text-center mb-8">
              זה הזמן ליצור את האימון הראשון שלך ולהתחיל להתקדם למטרה!
            </Text>

            <AppButton
              haptic="medium"
              animationType="opacity"
              onPress={handleCreateNew}
              className="bg-lime-500 flex-row items-center px-8 py-4 rounded-2xl shadow-lg"
            >
              <Text className="text-background-900 font-bold text-lg mr-2">צור אימון חדש</Text>
              <IconAddToList color={colors.background[900]} size={24} />
            </AppButton>
          </View>
        )}

        {/* כפתור הוספה צף (רק כשיש אימונים) */}
        {plansData && plansData.length > 0 && (
          <View className="absolute -bottom-4 left-8">
            <AppButton
              haptic="medium"
              animationType="opacity"
              onPress={handleCreateNew}
              className="bg-lime-500 items-center justify-center rounded-full w-16 h-16 shadow-2xl"
              style={{
                elevation: 10,
                shadowColor: colors.lime[500],
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 15,
              }}
            >
              <IconAddToList color={colors.background[900]} size={36} />
            </AppButton>
          </View>
        )}
      </View>
    </BackGround>
  );
};

export default WorkoutList;