import { Exercise } from '@/src/types/exercise';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
interface CardExerciseProps {
  selectedExercisesData: Exercise[];
  toggleExercise: (id: string) => void;
}
const ListExercise = ({ selectedExercisesData, toggleExercise }: CardExerciseProps) => {
  return (
    <ScrollView className=''>
      {selectedExercisesData.length === 0 ? (
        <View className="items-center justify-center py-10 border border-dashed border-zinc-800 rounded-2xl">
          <MaterialCommunityIcons name="dumbbell" size={40} color="#3f3f46" />
          <Text className="text-zinc-500 mt-2">טרם נבחרו תרגילים</Text>
        </View>
      ) : (
        selectedExercisesData.map((exercise) => (
          <View
            key={exercise.exerciseId}
            className="flex-row items-center bg-zinc-900/50 p-3 mb-3 rounded-2xl border border-zinc-800 mt-2 gap-4"
          >
            {/* תמונה / GIF */}
            <View className="bg-white/5 rounded-xl overflow-hidden ">
              <Image
                source={{ uri: exercise.gifUrl }}
                style={{ width: 64, height: 64, borderRadius: 10 }}
                contentFit="cover"
                transition={200}
                cachePolicy="disk"
              />
            </View>

            <View className="flex-1 ml-4 mr-2">
              <Text className="text-white font-semibold text-base leading-tight" numberOfLines={1}>
                {exercise.name_he || exercise.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <MaterialCommunityIcons name="arm-flex" size={12} color="#a1a1aa" />
                <Text className="text-zinc-400 text-xs ml-1 capitalize">
                  {exercise.targetMuscles_he?.[0] || exercise.targetMuscles?.[0]}
                </Text>
              </View>
            </View>

            {/* כפתור הסרה */}
            <TouchableOpacity
              onPress={() => toggleExercise(exercise.exerciseId)}
              className="w-10 h-10 items-center justify-center rounded-full bg-red-500/10"
            >
              <MaterialCommunityIcons name="close" size={20} color="#f87171" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default ListExercise
