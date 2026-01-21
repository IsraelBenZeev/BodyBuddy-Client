import { useExercises } from '@/src/hooks/useEcercises';
import { BodyPart, partsBodyHebrew } from '@/src/types/bodtPart';
import { modeListExercises } from '@/src/types/mode';
import BackGround from '@/src/ui/BackGround';
import Handle from '@/src/ui/Handle';
import Loading from '@/src/ui/Loading';
import AppButton from '@/src/ui/PressableOpacity';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import CardExercise from './CardExercise';
import Filters from './Filters';

interface ExercisesScreenProps {
  bodyParts: string | string[] | undefined;
  mode: string | string[] | undefined;
}
const ExercisesScreen = ({ bodyParts, mode }: ExercisesScreenProps) => {

  const router = useRouter();
  const selectedPartsArray = JSON.parse(bodyParts as string) as BodyPart[];
  const [page, setPage] = useState<number>(1);
  const { data, isLoading } = useExercises(selectedPartsArray, page);
  const [selectedFilter, setSelectedFilter] = useState<string | 'all'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const uniqueBodyParts = useMemo(() => {
    if (!data?.exercises) return [];
    const partsSet = new Set(data.exercises.flatMap((ex) => ex.bodyParts || []));
    return Array.from(partsSet) as BodyPart[];
  }, [data?.exercises]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };
  const filteredExercises = useMemo(() => {
    if (!data?.exercises.length) return [];
    if (selectedFilter === 'all') return data.exercises;
    return data.exercises.filter((ex) => ex.bodyParts.includes(selectedFilter));
  }, [data?.exercises.length, selectedFilter]);
  return (
    <BackGround>
      {mode === 'view' && (
        <View className='pt-4'>
          <View className="px-6 mb-6">
            <Text className="text-lime-50 text-right text-sm font-bold uppercase tracking-widest">
              מתאמן על
            </Text>
            <Text className="text-white font-black text-3xl text-right">
              {selectedPartsArray.map((part) => partsBodyHebrew[part]).join(', ')}
            </Text>
          </View>
        </View>
      )}

      {isLoading ? (
        <Loading />
      ) : (
        <View className="flex-1 pt-2 items-center">
          {(mode === 'picker') && <Handle />}
          <View className="w-full">
            {selectedPartsArray.length > 1 && (
              <Filters
                uniqueBodyParts={uniqueBodyParts}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                mode={mode as modeListExercises}
              />
            )}
            <FlatList
              data={filteredExercises}
              renderItem={({ item }) => (
                <CardExercise
                  item={item}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  mode={mode as modeListExercises}
                />
              )}
              keyExtractor={(item) => item.exerciseId}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
            />
          </View>
          {mode === "picker" && (
            <View className="absolute bottom-10 left-0 right-0 items-center px-10">
              <AppButton
                animationType="scale"
                haptic="success"
                onPress={() => router.back()}
                // העברנו את כל העיצוב ל-ClassName אחד נקי
                className="bg-lime-500 w-full h-16 rounded-2xl items-center justify-center shadow-lime-500 shadow-offset-[0/10] shadow-opacity-30 shadow-radius-[20px] elevation-10"
              >
                <Text className="text-zinc-950 font-bold text-lg">שמור וסיים</Text>
              </AppButton>
            </View>
          )}
        </View>
      )}
    </BackGround>
  );
};


export default ExercisesScreen;
