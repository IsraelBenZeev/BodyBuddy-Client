import { useFavoriteIds, useGetExercisesByIds, useToggleFavorite } from '@/src/hooks/useEcercises';
import { useAuthStore } from '@/src/store/useAuthStore';
import BackGround from '@/src/ui/BackGround';
import Loading from '@/src/ui/Loading';
import { FlashList } from '@shopify/flash-list';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import CardExercise from './CardExercise';

const FavoritesScreen = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const { data: favoriteIds = [], isLoading } = useFavoriteIds(user?.id);
  const { data: exercises = [], isLoading: isExercisesLoading } = useGetExercisesByIds(favoriteIds);
  const { mutate: toggleFavMutate } = useToggleFavorite(user?.id);

  const toggleFavorite = useCallback(
    (id: string) => {
      toggleFavMutate({ exerciseId: id, isFav: favoriteIds.includes(id) });
    },
    [favoriteIds, toggleFavMutate]
  );

  const handleBack = useCallback(() => router.back(), [router]);
  const handleNavigateHome = useCallback(() => router.replace('/(tabs)/'), [router]);
  const renderItem = useCallback(({ item }: { item: any }) => (
    <CardExercise item={item} favorites={favoriteIds} toggleFavorite={toggleFavorite} mode="view" />
  ), [favoriteIds, toggleFavorite]);

  const isEmpty = !isLoading && !isExercisesLoading && exercises.length === 0;

  return (
    <BackGround>
      {/* Header */}
      <View className="px-6 pt-12 pb-4 flex-row-reverse items-center gap-3">
        <Pressable onPress={handleBack} className="bg-zinc-800 p-3 rounded-xl" accessibilityRole="button" accessibilityLabel="חזרה">
          <Entypo name="chevron-right" size={22} color="white" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-white font-black text-3xl text-right">מועדפים</Text>
          <Text className="text-zinc-500 text-sm text-right mt-0.5">
            {favoriteIds.length} תרגילים שמורים
          </Text>
        </View>
      </View>

      {isLoading || isExercisesLoading ? (
        <Loading />
      ) : isEmpty ? (
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <Entypo name="star-outlined" size={48} color="#52525b" />
          <Text className="text-zinc-500 text-base font-medium">עדיין לא נוספו תרגילים מועדפים</Text>
          <Text className="text-zinc-600 text-sm text-center">
            גלה תרגילים לפי אזור גוף והוסף אותם למועדפים
          </Text>
          <Pressable
            onPress={handleNavigateHome}
            className="mt-2 bg-lime-500 px-6 py-3 rounded-2xl"
            accessibilityRole="button"
            accessibilityLabel="בחר אזור גוף"
          >
            <Text className="text-background-900 font-bold text-base">בחר אזור גוף</Text>
          </Pressable>
        </View>
      ) : (
        <View className="flex-1 px-2">
          <FlashList
            data={exercises}
            renderItem={renderItem}
            keyExtractor={(item) => item.exerciseId}
            estimatedItemSize={110}
            ListFooterComponent={<View className="h-20" />}
          />
        </View>
      )}
    </BackGround>
  );
};

export default FavoritesScreen;
