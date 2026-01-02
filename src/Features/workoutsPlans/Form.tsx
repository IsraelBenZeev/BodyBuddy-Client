import { useGetExercisesFromCache } from '@/src/hooks/useCash';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import ListExercise from './ListExercises';
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
  const queryClient = useQueryClient();
  const selectedIds = useWorkoutStore((state) => state.selectedExerciseIds);
  const toggleExercise = useWorkoutStore((state) => state.toggleExercise);
  const selectedExercisesData = useGetExercisesFromCache(selectedIds);

  const router = useRouter();
  return (
    <View className="flex-1 px-4">
      {/* כותרת וכפתור הוספה */}
      <View className="flex-row justify-between items-center mb-6 mt-4 ">
        <View>
          <Text className="text-white text-2xl font-bold tracking-tight">תרגילים באימון</Text>
          <Text className="text-zinc-500 text-sm">
            {selectedExercisesData.length} תרגילים נבחרו
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.push({
              pathname: '/exercises/[parts]',
              params: { parts: JSON.stringify(bodyParts), mode: 'picker' },
            });
          }}
          className="bg-lime-400 h-12 w-12 rounded-full items-center justify-center shadow-lg shadow-lime-400/20"
        >
          <MaterialCommunityIcons name="plus" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* רשימת תרגילים */}
      <ListExercise selectedExercisesData={selectedExercisesData} toggleExercise={toggleExercise} />
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: '/exercises/[parts]',
            params: { parts: JSON.stringify(bodyParts), mode: 'picker' },
          });
        }}
        className="bg-lime-500 h-16 w-32 rounded-lg"
      >
        <Text>
          {selectedIds.length > 0 ? 'הוסף עוד תרגילים לאימון שלך' : 'הוסף תרגילים לאימון שלך'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Form;
