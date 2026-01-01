import { colors } from '@/colors';
import { useExercises } from '@/src/hooks/useEcercises';
import { BodyPart, partsBodyHebrew } from '@/src/types/bodtPart';
import BackGround from '@/src/ui/BackGround';
import ButtonBack from '@/src/ui/ButtonBack';
import Loading from '@/src/ui/Loading';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CardExercise from './CardExercise';

interface ExercisesScreenProps {
  bodyParts: string | string[] | undefined;
  page?: string | string[] | undefined;
  mode: string | string[] | undefined;
}

const ExercisesScreen = ({ bodyParts, page, mode }: ExercisesScreenProps) => {
  const selectedPartsArray = JSON.parse(bodyParts as string) as BodyPart[];
  const { data, isLoading } = useExercises(selectedPartsArray, parseInt(page as string, 10));
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const router = useRouter();
  // 1. חילוץ כל חלקי הגוף הייחודיים מהתוצאות
  const uniqueBodyParts = useMemo(() => {
    if (!data?.exercises) return [];
    const partsSet = new Set(data.exercises.flatMap((ex) => ex.bodyParts || []));
    return Array.from(partsSet) as BodyPart[];
  }, [data?.exercises]);

  const bodyPartsCount = uniqueBodyParts.length;

  console.log('mode: ', mode);
  useEffect(() => {
    // console.log('bodyParts: ', bodyParts);
    // console.log('data: ', data?.exercises.at(0));
    data?.exercises.map((exercise) => {
      console.log('exercise.bodyParts: ', exercise.bodyParts[0]);
    });
    console.log('מספר חלקי גוף שונים בתוצאות:', bodyPartsCount);
    console.log('הרשימה:', uniqueBodyParts); // ידפיס למשל: ["waist", "back"]
  }, [isLoading]);
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };
  const [localFilter, setLocalFilter] = useState<BodyPart | 'all'>('all');
  return (
    <BackGround>
      {/* Header */}
      <View className="flex-row items-center justify-between w-full px-6 pt-4 mb-4">
        <Image
          style={styles.avatar}
          source={require('../../../assets/images/user.png')}
          contentFit="cover"
        />
        <ButtonBack />
      </View>

      {/* כותרת קטגוריה */}
      <View className="px-6 mb-6">
        <Text className="text-lime-50 text-right text-sm font-bold uppercase tracking-widest">
          מתאמן על
        </Text>
        <Text className="text-white font-black text-3xl text-right">
          {selectedPartsArray.map((part) => partsBodyHebrew[part]).join(', ')}
        </Text>
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <View className="bd">
          <View className='bd'>
            <TouchableOpacity>
              <Text className="text-white">הכל</Text>
            </TouchableOpacity>
            {uniqueBodyParts.map((part: BodyPart) => (
              <TouchableOpacity>
                <Text className="text-white" key={part}>
                  {partsBodyHebrew[part]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={data?.exercises || []}
            renderItem={({ item }) => (
              <CardExercise item={item} favorites={favorites} toggleFavorite={toggleFavorite} />
            )}
            keyExtractor={(item) => item.exerciseId}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            // אפקט כניסה נקי
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
