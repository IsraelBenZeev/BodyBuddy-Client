// import { colors } from '@/colors';
// import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
// import { useWorkoutStore } from '@/src/store/workoutsStore';
// import Loading from '@/src/ui/Loading';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { Image } from 'expo-image';
// import { useRouter } from 'expo-router';
// import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
// import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from 'react-native-reanimated';
// interface CardExerciseProps {
//   // selectedExercisesData: Exercise[];
//   mode: 'edit' | 'preview';
//   toggleExercise?: (id: string) => void;
//   navigateToPicker?: () => void;
//   isPendingCreate?: boolean;
//   selectExercisesIds?: string[];
// }
// const ListExercise = ({ toggleExercise, navigateToPicker, isPendingCreate, mode, selectExercisesIds }: CardExerciseProps) => {
//   const selectedIds = useWorkoutStore((state) => state.selectedExerciseIds);
//   const router = useRouter();
//   const { data: selectedExercisesData = [], isLoading: isLoadingExercises } = useGetExercisesByIds(selectExercisesIds || []);
//   if (isLoadingExercises) {
//     return <Loading />;
//   }
//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       nestedScrollEnabled={true}
//       contentContainerStyle={{ flexGrow: 0 }}
//     >
//       {selectedExercisesData.length === 0 ? (
//         <View className='items-center py-10'>
//           <MaterialCommunityIcons name="dumbbell" size={40} color={colors.background[50]} />
//           <Text className="text-zinc-500 mt-2">טרם נבחרו תרגילים</Text>
//           {mode === 'edit' && (
//             <TouchableOpacity
//               activeOpacity={0.7}
//               disabled={isPendingCreate}
//               onPress={navigateToPicker}
//               className="bg-lime-400 h-12 w-12 rounded-full items-center justify-center mt-4"
//             >
//               <MaterialCommunityIcons name="plus" size={28} color="black" />
//             </TouchableOpacity>
//           )}
//         </View>
//       ) : (
//         selectedExercisesData?.map((exercise, index) => (
//           <Pressable
//             onPress={() => {
//               console.log("exerciseId", exercise?.exerciseId);
//               router.push({
//                 pathname: '/exercise/[exerciseId]',
//                 params: { exerciseId: exercise?.exerciseId },
//               })
//             }}

//             key={exercise.exerciseId}
//           >

//             <Animated.View
//               entering={FadeInDown.delay(index * 100).duration(500).springify()}
//               exiting={FadeOutLeft.duration(300)}
//               layout={LinearTransition.springify()}
//               key={exercise.exerciseId}
//               className="flex-row-reverse items-center bg-zinc-900/50 p-3 mb-3 rounded-2xl border border-zinc-800"
//             >
//               {mode === 'edit' && (
//                 <TouchableOpacity
//                   onPress={() => toggleExercise && toggleExercise(exercise.exerciseId)}
//                   className="w-10 h-10 items-center justify-center rounded-full bg-red-500/10 mr-2"
//                 >
//                   <MaterialCommunityIcons name="close" size={20} color="#f87171" />
//                 </TouchableOpacity>
//               )}
//               <View className="bg-white/5 rounded-xl overflow-hidden">
//                 <Image
//                   source={{ uri: exercise.gifUrl }}
//                   style={{ width: 56, height: 56 }}
//                   contentFit="cover"
//                   transition={200}
//                   cachePolicy="disk"
//                 />
//               </View>
//               <View className="flex-1 mr-4 items-end">
//                 <Text className="text-white font-semibold text-base text-right" numberOfLines={1}>
//                   {exercise.name_he || exercise.name}
//                 </Text>
//                 <View className="flex-row items-center mt-1">
//                   <Text className="text-zinc-400 text-xs mr-1 capitalize text-right">
//                     {exercise.targetMuscles_he?.[0] || exercise.targetMuscles?.[0]}
//                   </Text>
//                   <MaterialCommunityIcons name="arm-flex" size={12} color="#a1a1aa" />
//                 </View>
//               </View>
//             </Animated.View>
//           </Pressable>
//         ))
//       )}

//       {
//         (selectedIds.length > 0 && mode === 'edit') && (
//           <TouchableOpacity
//             onPress={navigateToPicker}
//             className="bg-zinc-900 py-3 rounded-xl mt-2 mb-4 border border-zinc-800"
//             disabled={isPendingCreate}
//           >
//             <Text className="text-lime-400 text-center font-bold">הוסף תרגילים נוספים +</Text>
//           </TouchableOpacity>
//         )
//       }
//     </ScrollView >
//   );
// }


// export default ListExercise;


import { colors } from '@/colors';
import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import Loading from '@/src/ui/Loading';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from 'react-native-reanimated';

// הפיכת ה-Pressable לרכיב אנימטיבי
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardExerciseProps {
  mode: 'edit' | 'preview';
  toggleExercise?: (id: string) => void;
  navigateToPicker?: () => void;
  isPendingCreate?: boolean;
  selectExercisesIds?: string[];
}

const ListExercise = ({ toggleExercise, navigateToPicker, isPendingCreate, mode, selectExercisesIds }: CardExerciseProps) => {
  const router = useRouter();
  const { data: selectedExercisesData = [], isLoading: isLoadingExercises } = useGetExercisesByIds(selectExercisesIds || []);

  if (isLoadingExercises) return <Loading />;

  return (
    <ScrollView
      // ה-Key כאן מבטיח שהאנימציה תרוץ ברגע שהנתונים נטענים
      key={selectedExercisesData.length > 0 ? 'loaded' : 'empty'}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      {selectedExercisesData.length === 0 ? (
        <View className='items-center py-10'>
          <MaterialCommunityIcons name="dumbbell" size={40} color={colors.background[50]} />
          <Text className="text-zinc-500 mt-2">טרם נבחרו תרגילים</Text>
        </View>
      ) : (
        selectedExercisesData.map((exercise, index) => (
          <AnimatedPressable
            key={exercise.exerciseId}
            // אנימציית כניסה ב"מפל" (Stagger)
            entering={FadeInDown.delay(index * 100).springify()}
            exiting={FadeOutLeft.duration(400)}
            layout={LinearTransition.springify()}
            onPress={() => router.push({
              pathname: '/exercise/[exerciseId]',
              params: { exerciseId: exercise.exerciseId },
            })}
            className="flex-row-reverse items-center bg-zinc-900/50 p-3 mb-3 rounded-2xl border border-zinc-800"
          >
            {/* כפתור מחיקה רק במצב עריכה */}
            {mode === 'edit' && (
              <TouchableOpacity
                onPress={() => toggleExercise?.(exercise.exerciseId)}
                className="w-10 h-10 items-center justify-center rounded-full bg-red-500/10 mr-2"
              >
                <MaterialCommunityIcons name="close" size={20} color="#f87171" />
              </TouchableOpacity>
            )}

            {/* תמונת התרגיל */}
            <View className="bg-white/5 rounded-xl overflow-hidden">
              <Image
                source={{ uri: exercise.gifUrl }}
                style={{ width: 56, height: 56 }}
                contentFit="cover"
              />
            </View>

            {/* פרטי התרגיל */}
            <View className="flex-1 mr-4 items-end">
              <Text className="text-white font-semibold text-base text-right" numberOfLines={1}>
                {exercise.name_he || exercise.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-zinc-400 text-xs mr-1 text-right">
                  {exercise.targetMuscles_he?.[0] || exercise.targetMuscles?.[0]}
                </Text>
                <MaterialCommunityIcons name="arm-flex" size={12} color="#a1a1aa" />
              </View>
            </View>
          </AnimatedPressable>
        ))
      )}

      {/* כפתור הוספה במצב עריכה */}
      {mode === 'edit' && (
        <TouchableOpacity
          onPress={navigateToPicker}
          className="bg-zinc-900 py-3 rounded-xl mt-2 mb-4 border border-zinc-800"
          disabled={isPendingCreate}
        >
          <Text className="text-lime-400 text-center font-bold">הוסף תרגילים נוספים +</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default ListExercise;