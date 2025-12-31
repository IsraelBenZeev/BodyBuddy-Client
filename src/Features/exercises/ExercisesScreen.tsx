import { colors } from '@/colors';
import { useExercises } from '@/src/hooks/useEcercises';
import { partsBodyHebrew } from '@/src/types';
import BackGround from '@/src/ui/BackGround';
import ButtonBack from '@/src/ui/ButtonBack';
import { ButtonAddFavorit, ButtonRemoveFavorit } from '@/src/ui/ButtonsFavorit';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ExercisesScreenProps {
  bodyPart: string | string[] | undefined;
  page?: string | string[] | undefined;
}
const ExercisesScreen = ({ bodyPart, page }: ExercisesScreenProps) => {
  const { data, isLoading } = useExercises(bodyPart as string, parseInt(page as string, 10));
  const [favorites, setFavorites] = useState<string[]>([]);
  const router = useRouter();
  return (
    <BackGround>
      <View className="flex-row items-center justify-between w-full  px-2">
        <Image
          style={{ width: 40, height: 40, borderRadius: 20 }}
          source={require('../../../assets/images/user.png')}
          contentFit="cover"
          className=""
        />
        <ButtonBack />
      </View>
      <Text className="text-white font-bold text-5xl mb-6 text-center">
        {typeof bodyPart === 'string'
          ? partsBodyHebrew[bodyPart as keyof typeof partsBodyHebrew]
          : ''}
      </Text>

      <FlatList
        // numColumns={2}
        // columnWrapperStyle={{ justifyContent: 'space-around', gap: 0 }}
        data={data?.exercises || []}
        renderItem={({ item }) => (
          <View
            style={styles.callomnWrapper}
            className="flex-row gap-4 mb-3 items-center justify-center"
          >
            <View className="items-center justify-center">
              <Text className="text-white text-lg mb-2 w-52 text-center" style={styles.textBig}>
                {item.name_he}
              </Text>
              <Text className="text-white text-lg mb-2 w-52 text-center" style={styles.textSmall}>
                {/* {item.bodyParts_he.map((muscle) => muscle).join(', ')}
                {', '} */}
                {item.targetMuscles_he.map((muscle) => muscle).join(', ')}
                {/* {item.targetMuscles_he[0]} */}
              </Text>
            </View>
            <View className="w-32 h-32 rounded-md overflow-hidden ">
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: '/exercise/[exerciseId]',
                    params: { exerciseId: item.exerciseId },
                  });
                }}
              >
                <Image
                  source={item.gifUrl}
                  style={styles.image}
                  contentFit="contain"
                  transition={500}
                  cachePolicy={'disk'}
                  className=""
                />
              </TouchableOpacity>
            </View>
            <Pressable
              className="absolute top-0 left-0"
              onPress={() => {
                console.log(item.exerciseId, item.name_he, 'presessed favorite');
                if (favorites.includes(item.exerciseId)) {
                  setFavorites(favorites.filter((id) => id !== item.exerciseId));
                } else {
                  setFavorites([...favorites, item.exerciseId]);
                }
              }}
            >
              {favorites.includes(item.exerciseId) ? <ButtonRemoveFavorit /> : <ButtonAddFavorit />}
            </Pressable>
          </View>
        )}
        keyExtractor={(item) => item.exerciseId.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </BackGround>
  );
};
export default ExercisesScreen;
const styles = StyleSheet.create({
  callomnWrapper: {
    justifyContent: 'space-around',
    width: '99%',
    borderWidth: 2,
    borderColor: colors.lime[500],
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    // borderRadius: 8,
    // borderRightWidth: 4,
    // borderColor: 'red',
  },
  textBig: {
    textAlign: 'center',
    backgroundColor: colors.lime[500],
    borderRadius: 8,
    // paddingVertical: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  textSmall: {
    textAlign: 'center',
    // backgroundColor: colors.lime[300],
    borderRadius: 8,
    // paddingVertical: 4,
    fontSize: 12,
    // fontWeight: '600',
  },
});
