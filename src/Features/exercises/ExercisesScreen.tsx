import { useExercises } from '@/src/hooks/useEcercises';
import { partsBodyHebrew } from '@/src/types';
import BackGround from '@/src/ui/BackGround';
import ButtonBack from '@/src/ui/ButtonBack';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface ExercisesScreenProps {
  bodyPart: string | string[] | undefined;
  page?: string | string[] | undefined;
}
const ExercisesScreen = ({ bodyPart, page }: ExercisesScreenProps) => {
  const router = useRouter();
  console.log('bodyPart:', bodyPart, 'page:', page);

  const { data, isLoading } = useExercises(bodyPart as string, parseInt(page as string, 10));

  useEffect(() => {
    console.log('data ExercisesScreenProps: ', data);
  }, [isLoading, data, bodyPart]);

  return (
    <BackGround>
      {/* <View className='bd flex-row items-center justify-between w-full'> */}
      <Text className="text-white font-bold text-5xl mb-6 text-center">
        {typeof bodyPart === 'string'
          ? partsBodyHebrew[bodyPart as keyof typeof partsBodyHebrew]
          : ''}
      </Text>
      <View className="absolute top-4 right-4">
        <ButtonBack />
      </View>
      {/* </View> */}
      <FlatList
        className="border-r-4 border-lime-400 rounded-md px-2 py-1 "
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-around', gap: 0 }}
        // contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 4 }}
        // 1. וודא ש-data.data אכן קיים (למנוע קריסה לפני שה-API חזר)
        data={data?.exercises || []}
        // 2. Destructuring נקי ל-item
        renderItem={({ item }) => (
          <View className="mb-4 items-center justify-center">
            <Image
              source={item.gifUrl} // ב-expo-image אפשר פשוט להעביר את ה-string
              style={styles.image}
              contentFit="contain"
              transition={500}
              cachePolicy={'disk'}
              className=""
            />
            <Text className="text-white text-lg mb-2 w-52 text-center">{item.name_he}</Text>
          </View>
        )}
        // 3. וודא שזה השם המדויק של ה-ID ב-API שלך
        keyExtractor={(item) => item.exerciseId.toString()}
        // 4. כדי שהכפתור לא יסתיר את האיבר האחרון ברשימה
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </BackGround>
  );
};
export default ExercisesScreen;
const styles = StyleSheet.create({
  image: {
    width: 130,
    height: 130,
    borderRadius: 8,
    // borderRightWidth: 4,
    // borderColor: 'red',
  },
});
