import { colors } from '@/colors';
import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import BackGround from '@/src/ui/BackGround';
import Handle from '@/src/ui/Handle';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Buttons from './Buttons';
import Information from './Information';
import TabsMenager from './TabsMenager';

const ExerciseScreen = ({ exerciseId }: { exerciseId: string }) => {

  const { data: exercises, isLoading: isExerciseLoading } = useGetExercisesByIds([exerciseId]);
  const exerciseData = exercises?.[0];

  useEffect(() => {
    if (!exerciseData) return;
    console.log("exercise", exerciseData)

  }, [exerciseData, isExerciseLoading])

  if (isExerciseLoading || !exerciseData) {
    return (
      <BackGround>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">טוען נתונים...</Text>
        </View>
      </BackGround>
    );
  }

  return (
    <BackGround><View></View>
      <View className='items-center mt-3'>
        <Handle />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} // שימוש ב-flexGrow חשוב כאן
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 mb-8 w-full mt-5">
          <Text className="text-white text-4xl font-black text-right leading-tight">
            {exerciseData?.name_he}
          </Text>
          <View className="h-1 w-20 bg-lime-500 rounded-full self-end mt-2" />
        </View>
        <View style={styles.imageWrapper} className="self-center">
          <Image
            style={styles.mainImage}
            source={exerciseData?.gifUrl}
            contentFit="contain"
            transition={500}
            cachePolicy={'disk'}
          />
        </View>
        <View className="w-full mt-6" style={{ minHeight: 600 }}>
          <Buttons exerciseId={exerciseData?.exerciseId} />
          <Information exercise={exerciseData} />
          <TabsMenager instructions={exerciseData?.instructions_he} />
        </View>
      </ScrollView>
    </BackGround>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: '90%',
    height: 320,
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 15,
    shadowColor: colors.lime[500],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
});

export default ExerciseScreen;
