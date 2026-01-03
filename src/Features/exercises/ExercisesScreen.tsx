import { colors } from '@/colors';
import { useExercises } from '@/src/hooks/useEcercises';
import { BodyPart, partsBodyHebrew } from '@/src/types/bodtPart';
import { modeType } from '@/src/types/mode';
import BackGround from '@/src/ui/BackGround';
import ButtonBack from '@/src/ui/ButtonBack';
import Loading from '@/src/ui/Loading';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import CardExercise from './CardExercise';
import Filters from './Filters';

interface ExercisesScreenProps {
  bodyParts: string | string[] | undefined;
  mode: string | string[] | undefined;
}
const ExercisesScreen = ({ bodyParts, mode }: ExercisesScreenProps) => {
  console.log('mode: ', mode, 'bodyParts_4: ', bodyParts);

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
      {/* Header */}
      {mode === 'view' && (
        <View>
          <View className="flex-row items-center justify-between w-full px-6 pt-4 mb-4">
            <Image
              style={styles.avatar}
              source={require('../../../assets/images/user.png')}
              contentFit="cover"
            />
            <ButtonBack />
          </View>
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
        <View className="">
          <Filters
            uniqueBodyParts={uniqueBodyParts}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            mode={mode as modeType}
          />
          <FlatList
            data={filteredExercises}
            renderItem={({ item }) => (
              <CardExercise
                item={item}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                mode={mode as modeType}
              />
            )}
            keyExtractor={(item) => item.exerciseId}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
          />
        </View>
      )}
    </BackGround>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lime[500],
  },
  exerciseCard: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.background[800],
    borderRadius: 24,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.background[600],
    alignItems: 'center',
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: 'white',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.background[900],
    borderRadius: 10,
    padding: 2,
  },
  infoContainer: {
    flex: 1,
    paddingRight: 15,
    justifyContent: 'center',
  },
  exerciseTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
  },
  muscleText: {
    color: colors.lime[400],
    fontSize: 13,
    marginRight: 4,
    textAlign: 'right',
  },
  equipmentBadge: {
    backgroundColor: colors.lime[900], // Lime opacity
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.lime[800],
  },
  equipmentText: {
    color: colors.lime[400],
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ExercisesScreen;
