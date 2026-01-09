// import { colors } from '@/colors';
// import { useWorkoutsPlans } from '@/src/hooks/useWorkout';
// import BackGround from '@/src/ui/BackGround';
// import { IconAddToList } from '@/src/ui/IconsSVG';
// import Loading from '@/src/ui/Loading';
// import { useRouter } from 'expo-router';
// import { Text, TouchableOpacity, View } from 'react-native';
// import CustomCarousel from '../../ui/CustomCarousel';
// import CardPlan from './CardPlan';
// import { useWorkoutStore } from '@/src/store/workoutsStore';
// const userID = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';

// const WorkoutList = () => {
//   const { data: plansData, isLoading: isLoadingPlans } = useWorkoutsPlans(userID);
//   const clearAllExercises = useWorkoutStore((state) => state.clearAllExercises);
//   const router = useRouter();
//   return (
//     <BackGround>
//       <View className=" h-full items-center justify-center">
//         <View className="h-flex-1 ">
//           <Text className="text-white text-2xl font-bold">האימונים שלי</Text>
//         </View>
//         {isLoadingPlans ? (
//           <Loading />
//         ) : (
//           <View className="w-full ">
//             <CustomCarousel
//               data={plansData || []}
//               renderItem={(item: any, isActive: boolean) => <CardPlan plan={item} isActive={isActive} />}
//               widthCard={280}
//             />
//           </View>
//         )}
//         {!plansData?.length && (
//           <TouchableOpacity
//             onPress={() => {
//               clearAllExercises();
//               router.push({
//                 pathname: '/form_create_Workout/[mode]',
//                 params: { mode: 'create' },
//               });
//             }}
//             className="bg-lime-500  items-center justify-center rounded-full p-3 w-16 h-16 shadow-xl"
//             style={{
//               elevation: 8,
//               shadowColor: colors.lime[500],
//               shadowOffset: { width: 0, height: 4 },
//               shadowOpacity: 0.3,
//               shadowRadius: 10,
//             }}
//           >
//             <IconAddToList color={colors.background[900]} size={36} />
//           </TouchableOpacity>
//         )}
//         {plansData?.length && (
//           <TouchableOpacity
//             onPress={() => {
//               clearAllExercises();
//               router.push({
//                 pathname: '/form_create_Workout/[mode]',
//                 params: { mode: 'create' },
//               });
//             }}
//             className="bg-lime-500 absolute -bottom-4 left-10 items-center justify-center rounded-full p-3 w-16 h-16 shadow-xl"
//             style={{
//               elevation: 8,
//               shadowColor: colors.lime[500],
//               shadowOffset: { width: 0, height: 4 },
//               shadowOpacity: 0.3,
//               shadowRadius: 10,
//             }}
//           >
//             <IconAddToList color={colors.background[900]} size={36} />
//           </TouchableOpacity>
//         )}

//       </View>
//     </BackGround>
//   );
// };

// export default WorkoutList;
import { colors } from '@/colors';
import { useWorkoutsPlans } from '@/src/hooks/useWorkout';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import BackGround from '@/src/ui/BackGround';
import { IconAddToList, IconsFitnessTools } from '@/src/ui/IconsSVG';
import Loading from '@/src/ui/Loading';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import CustomCarousel from '../../ui/CustomCarousel';
import CardPlan from './CardPlan';

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

            <TouchableOpacity
              onPress={handleCreateNew}
              className="bg-lime-500 flex-row items-center px-8 py-4 rounded-2xl shadow-lg"
            >
              <Text className="text-background-900 font-bold text-lg mr-2">צור אימון חדש</Text>
              <IconAddToList color={colors.background[900]} size={24} />
            </TouchableOpacity>
          </View>
        )}

        {/* כפתור הוספה צף (רק כשיש אימונים) */}
        {plansData && plansData.length > 0 && (
          <View className="absolute -bottom-4 left-8">
            <TouchableOpacity
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
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BackGround>
  );
};

export default WorkoutList;