import { useFavoriteIds, useToggleFavorite, useExercises } from '@/src/hooks/useEcercises';
import { useProfile } from '@/src/hooks/useProfile';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import { BodyPart, partsBodyHebrew } from '@/src/types/bodtPart';
import { modeListExercises } from '@/src/types/mode';
import BackGround from '@/src/ui/BackGround';
import Handle from '@/src/ui/Handle';
import Loading from '@/src/ui/Loading';
import AppButton from '@/src/ui/PressableOpacity';
import MiniAvatar from './MiniAvatar';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useDeferredValue, useCallback, useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import CardExercise from './CardExercise';
import Filters from './Filters';
import MuscleFilters from './MuscleFilters';

interface ExercisesScreenProps {
  bodyParts: string | string[] | undefined;
  mode: string | string[] | undefined;
}

const ExercisesScreen = ({ bodyParts, mode }: ExercisesScreenProps) => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const selectedPartsArray = JSON.parse(bodyParts as string) as BodyPart[];
  const exerciseSelectedIds = useWorkoutStore((state) => state.selectedExerciseIds);
  const clearAllExercises = useWorkoutStore((state) => state.clearAllExercises);

  const { data: profile } = useProfile(user?.id);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useExercises(
    user?.id as string,
    selectedPartsArray
  );
  const [selectedFilter, setSelectedFilter] = useState<string | 'all'>('all');
  const [selectedMuscle, setSelectedMuscle] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: favorites = [] } = useFavoriteIds(user?.id);
  const { mutate: toggleFavMutate } = useToggleFavorite(user?.id);
  const allExercises = useMemo(() => {
    return data?.pages.flatMap((page) => page.exercises) ?? [];
  }, [data]);

  // if(mode === 'picker')
  // בונה אינדקס פעם אחת בטעינת עמוד — פילטור O(1) במקום O(n)
  const exerciseIndex = useMemo(() => {
    const index = new Map<string, typeof allExercises>();
    index.set('all', allExercises);
    for (const exercise of allExercises) {
      for (const part of exercise.bodyParts) {
        if (!index.has(part)) index.set(part, []);
        index.get(part)!.push(exercise);
      }
    }
    return index;
  }, [allExercises]);

  const uniqueBodyParts = useMemo(() => {
    return Array.from(exerciseIndex.keys()).filter((k) => k !== 'all') as BodyPart[];
  }, [exerciseIndex]);

  const handleSetSelectedFilter = useCallback((filter: string | 'all') => {
    setSelectedFilter(filter);
    setSelectedMuscle('all');
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    toggleFavMutate({ exerciseId: id, isFav: favorites.includes(id) });
  }, [favorites, toggleFavMutate]);

  const deferredFilter = useDeferredValue(selectedFilter);
  const deferredMuscle = useDeferredValue(selectedMuscle);
  const deferredSearch = useDeferredValue(searchQuery);

  const muscleIndex = useMemo(() => {
    const index = new Map<string, typeof allExercises>();
    const base = exerciseIndex.get(deferredFilter) ?? exerciseIndex.get('all') ?? [];
    index.set('all', base);
    for (const exercise of base) {
      for (const muscle of exercise.targetMuscles) {
        if (!index.has(muscle)) index.set(muscle, []);
        index.get(muscle)!.push(exercise);
      }
    }
    return index;
  }, [exerciseIndex, deferredFilter]);

  const uniqueMuscles = useMemo(
    () => Array.from(muscleIndex.keys()).filter((k) => k !== 'all'),
    [muscleIndex]
  );

  const filteredExercises = useMemo(() => {
    const byMuscle = muscleIndex.get(deferredMuscle) ?? muscleIndex.get('all') ?? [];
    if (!deferredSearch.trim()) return byMuscle;
    const q = deferredSearch.toLowerCase();
    return byMuscle.filter(
      (ex) => ex.name.toLowerCase().includes(q) || ex.name_he.includes(deferredSearch)
    );
  }, [muscleIndex, deferredMuscle, deferredSearch]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  return (
    <BackGround>
      {mode === 'view' && (
        <View className="pt-4">
          <View className="px-6 mb-6 flex-row items-center gap-4">
            {profile?.gender && (
              <MiniAvatar
                selectedParts={selectedPartsArray}
                gender={profile.gender as 'male' | 'female'}
              />
            )}
            <View className="flex-1">
              <Text className="typo-label text-lime-50 text-right uppercase tracking-widest">
                מתאמן על
              </Text>
              <Text className="typo-h1 text-white text-right" numberOfLines={2}>
                {selectedPartsArray.map((part) => partsBodyHebrew[part]).join(', ')}
              </Text>
            </View>
          </View>
        </View>
      )}

      {isLoading ? (
        <Loading />
      ) : (
        <View className="flex-1 pt-2 items-center px-1">
          {mode === 'picker' && <Handle />}
          <View className="w-full flex-1">
            {selectedPartsArray.length > 1 && (
              <Filters
                uniqueBodyParts={uniqueBodyParts}
                selectedFilter={selectedFilter}
                setSelectedFilter={handleSetSelectedFilter}
                mode={mode as modeListExercises}
              />
            )}
            {uniqueMuscles.length > 1 && (
              <MuscleFilters
                uniqueMuscles={uniqueMuscles}
                selectedMuscle={selectedMuscle}
                setSelectedMuscle={setSelectedMuscle}
              />
            )}
            <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-4 mx-2 mb-3 mt-2">
              <Ionicons name="search" size={18} color="#a3a3a3" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="חפש תרגיל..."
                placeholderTextColor="#525252"
                className="flex-1 typo-input text-white text-right py-3 px-2"
              />
              {searchQuery.length > 0 && (
                <AppButton
                  onPress={() => setSearchQuery('')}
                  haptic="light"
                  animationType="opacity"
                  accessibilityLabel="נקה חיפוש"
                >
                  <Ionicons name="close-circle" size={18} color="#a3a3a3" />
                </AppButton>
              )}
            </View>
            {mode === 'picker' && (
              <View className="flex-row items-center justify-between bg-zinc-900 border border-zinc-800/80 rounded-2xl px-4 py-3 mx-2 mb-3">
                <View className="flex-row items-center">
                  <View className={`rounded-full h-8 min-w-[32px] px-2 flex-row items-center justify-center ml-3 ${exerciseSelectedIds.size > 0 ? 'bg-lime-500' : 'bg-zinc-800'}`}>
                    <Text className={`typo-btn-cta ${exerciseSelectedIds.size > 0 ? 'text-zinc-950' : 'text-zinc-400'}`}>
                      {exerciseSelectedIds.size}
                    </Text>
                  </View>
                  <Text className="typo-body-primary text-zinc-300">
                    תרגילים נבחרו
                  </Text>
                </View>

                {exerciseSelectedIds.size > 0 && (
                  <AppButton
                    onPress={clearAllExercises}
                    haptic="medium"
                    animationType="scale"
                    className="bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20"
                    accessibilityLabel="נקה כל הבחירות"
                  >
                    <Text className="typo-label text-red-400">נקה הכל</Text>
                  </AppButton>
                )}
              </View>
            )}
            <FlashList
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
              estimatedItemSize={110}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <View className="py-6 items-center">
                    <Text className="typo-body text-lime-400">טוען תרגילים נוספים...</Text>
                  </View>
                ) : (
                  <View className="h-20" />
                )
              }
            />
          </View>
          {mode === 'picker' && (
            <View className="absolute bottom-10 left-0 right-0 items-center px-10">
              <AppButton
                animationType="scale"
                haptic="success"
                onPress={() => router.back()}
                className="bg-lime-500 w-full h-16 rounded-2xl items-center justify-center shadow-lime-500 shadow-offset-[0/10] shadow-opacity-30 shadow-radius-[20px] elevation-10"
                accessibilityLabel="שמור וסיים"
              >
                <Text className="typo-h4 text-zinc-950">שמור וסיים</Text>
              </AppButton>
            </View>
          )}
        </View>
      )}
    </BackGround>
  );
};

export default ExercisesScreen;
