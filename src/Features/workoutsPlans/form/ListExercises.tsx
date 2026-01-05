// import { Exercise } from '@/src/types/exercise';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { Image } from 'expo-image';
// import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
// interface CardExerciseProps {
//   selectedExercisesData: Exercise[];
//   toggleExercise: (id: string) => void;
// }
// const ListExercise = ({ selectedExercisesData, toggleExercise }: CardExerciseProps) => {
//   return (
//     <ScrollView className="" style={{ flexGrow: 0,flex:1 }}>
//       {selectedExercisesData.length === 0 ? (
//         <View className="items-center justify-center py-10 border border-dashed border-zinc-800 rounded-2xl">
//           <MaterialCommunityIcons name="dumbbell" size={40} color="#3f3f46" />
//           <Text className="text-zinc-500 mt-2">טרם נבחרו תרגילים</Text>
//         </View>
//       ) : (
//         selectedExercisesData.map((exercise) => (
//           <View
//             key={exercise.exerciseId}
//             className="flex-row items-center bg-zinc-900/50 p-3 mb-3 rounded-2xl border border-zinc-800 mt-2 gap-4"
//           >
//             {/* תמונה / GIF */}
//             <View className="bg-white/5 rounded-xl overflow-hidden ">
//               <Image
//                 source={{ uri: exercise.gifUrl }}
//                 style={{ width: 64, height: 64, borderRadius: 10 }}
//                 contentFit="cover"
//                 transition={200}
//                 cachePolicy="disk"
//               />
//             </View>

//             <View className="flex-1 ml-4 mr-2">
//               <Text className="text-white font-semibold text-base leading-tight" numberOfLines={1}>
//                 {exercise.name_he || exercise.name}
//               </Text>
//               <View className="flex-row items-center mt-1">
//                 <MaterialCommunityIcons name="arm-flex" size={12} color="#a1a1aa" />
//                 <Text className="text-zinc-400 text-xs ml-1 capitalize">
//                   {exercise.targetMuscles_he?.[0] || exercise.targetMuscles?.[0]}
//                 </Text>
//               </View>
//             </View>

//             {/* כפתור הסרה */}
//             <TouchableOpacity
//               onPress={() => toggleExercise(exercise.exerciseId)}
//               className="w-10 h-10 items-center justify-center rounded-full bg-red-500/10"
//             >
//               <MaterialCommunityIcons name="close" size={20} color="#f87171" />
//             </TouchableOpacity>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// export default ListExercise;
import { Exercise } from '@/src/types/exercise';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text, TouchableOpacity, View } from 'react-native';

interface CardExerciseProps {
  selectedExercisesData: Exercise[];
  toggleExercise: (id: string) => void;
  navigateToPicker: () => void;
  selectedIds: string[];
}

const ListExercise = ({
  selectedExercisesData,
  toggleExercise,
  navigateToPicker,
  selectedIds,
}: CardExerciseProps) => {
  return (
    <View className="w-full">
      {selectedExercisesData.length === 0 ? (
        <View className="items-center justify-center py-10 border border-dashed border-background-600 rounded-3xl bg-background-900/30">
          <View className="bg-background-800 p-4 rounded-full mb-3">
            <MaterialCommunityIcons name="dumbbell" size={32} color="#71717a" />
          </View>
          <Text className="text-background-300 font-medium text-base">טרם נבחרו תרגילים</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={navigateToPicker}
            className="mt-5 bg-lime-500 h-14 px-6 rounded-2xl flex-row items-center justify-center shadow-lg shadow-lime-500/20"
          >
            <MaterialCommunityIcons name="plus" size={24} color="#1a2e05" />
            <Text className="text-background-950 font-bold ml-2 text-lg">הוסף תרגיל ראשון</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="gap-3">
          {selectedExercisesData.map((exercise) => (
            <View
              key={exercise.exerciseId}
              className="flex-row items-center bg-background-800 p-3 rounded-2xl border border-background-700/50 shadow-sm"
            >
              {/* תמונה / GIF */}
              <View className="bg-background-700/50 rounded-xl overflow-hidden shadow-inner">
                <Image
                  source={{ uri: exercise.gifUrl }}
                  style={{ width: 64, height: 64 }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="disk"
                />
              </View>

              {/* פרטי התרגיל */}
              <View className="flex-1 ml-4 mr-2 justify-center">
                <Text className="text-background-50 font-bold text-lg text-right" numberOfLines={1}>
                  {exercise.name_he || exercise.name}
                </Text>
                <View className="flex-row items-center justify-end mt-1">
                  <Text className="text-lime-500 text-xs font-medium capitalize mr-1">
                    {exercise.targetMuscles_he?.[0] || exercise.targetMuscles?.[0]}
                  </Text>
                  <MaterialCommunityIcons name="arm-flex" size={14} color="#84cc16" />
                </View>
              </View>

              {/* כפתור הסרה */}
              <TouchableOpacity
                onPress={() => toggleExercise(exercise.exerciseId)}
                className="w-10 h-10 items-center justify-center rounded-xl bg-background-700 active:bg-red-500/20"
              >
                <MaterialCommunityIcons name="close" size={20} color="#a1a1aa" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* כפתור הוספה מתחת לרשימה אם יש פריטים */}
      {selectedIds.length > 0 && (
        <TouchableOpacity
          onPress={navigateToPicker}
          activeOpacity={0.8}
          className="bg-background-800/80 py-4 rounded-2xl mt-4 border border-dashed border-background-600 flex-row justify-center items-center"
        >
          <MaterialCommunityIcons name="plus" size={20} color="#a1a1aa" />
          <Text className="text-background-300 ml-2 font-medium">הוסף תרגיל נוסף</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ListExercise;
