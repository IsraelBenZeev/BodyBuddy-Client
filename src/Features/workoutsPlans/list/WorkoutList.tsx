import { colors } from '@/colors';
import { useWorkoutsPlans } from '@/src/hooks/useWorkout';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import BackGround from '@/src/ui/BackGround';
import EmptyState from '@/src/ui/EmptyState';
import { IconAddToList, IconsFitnessTools } from '@/src/ui/IconsSVG';
import Loading from '@/src/ui/Loading';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import CustomCarousel from '../../../ui/CustomCarousel';
import CardPlan from './CardPlan';
import AppButton from '@/src/ui/PressableOpacity';
import { useAuthStore } from '@/src/store/useAuthStore';


const WorkoutList = () => {
  const user = useAuthStore((state) => state.user);
  const { data: plansData, isLoading: isLoadingPlans } = useWorkoutsPlans(user?.id as string);
  
  const clearAllExercises = useWorkoutStore((state) => state.clearAllExercises);
  const router = useRouter();

  const handleNavigateToFavorites = useCallback(() => router.navigate('/favorites'), [router]);

  const handleCreateNew = useCallback(() => {
    clearAllExercises();
    router.navigate({
      pathname: '/form_create_Workout/[mode]',
      params: { mode: 'create' },
    });
  }, [clearAllExercises, router]);

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
        <View className="w-full px-6 mt-5 flex-row-reverse items-start justify-between">
          <View className="items-end">
            <Text className="typo-h1 text-white tracking-tight text-right">האימונים שלי</Text>
            <View style={{ height: 5, width: 60, backgroundColor: colors.lime[500], borderRadius: 10, marginTop: 8 }} />
          </View>
          <AppButton
            animationType="opacity"
            haptic="light"
            onPress={handleNavigateToFavorites}
            className="bg-zinc-800 w-12 h-12 rounded-2xl border border-zinc-700 items-center justify-center"
            accessibilityLabel="תרגילים מועדפים"
          >
            <Ionicons name="star-outline" size={22} color={colors.lime[500]} />
          </AppButton>
        </View>
        {plansData && plansData.length > 0 ? (
          <View className="w-full flex-1 justify-center">
            <CustomCarousel
              data={plansData}
              variant='center'
              renderItem={(item: any, isActive: boolean, isSwiped: boolean, activeId: string, translateY: SharedValue<number>) => (
                <CardPlan plan={item} isActive={isActive} isSwiped={isSwiped} />
              )}
              widthCard={280}
            />
          </View>
        ) : (
          <EmptyState
            icon={<IconsFitnessTools size={80} color={colors.lime[500]} />}
            title="עדיין אין לך תוכניות אימון"
            description="זה הזמן ליצור את האימון הראשון שלך ולהתחיל להתקדם למטרה!"
            action={{
              label: "צור אימון חדש",
              onPress: handleCreateNew,
              icon: <IconAddToList color={colors.background[900]} size={24} />,
            }}
          />
        )}

        {/* כפתור הוספה צף (רק כשיש אימונים) */}
        {plansData && plansData.length > 0 && (
          <View className="absolute bottom-24 left-10">
            <AppButton
              haptic="medium"
              animationType="opacity"
              onPress={handleCreateNew}
              className="bg-lime-500 items-center justify-center rounded-full w-16 h-16 shadow-2xl"
              accessibilityLabel="צור אימון חדש"
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