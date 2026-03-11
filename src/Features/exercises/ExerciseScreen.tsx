import { colors } from '@/colors';
import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import BackGround from '@/src/ui/BackGround';
import Handle from '@/src/ui/Handle';
import DumbbellAnimation from '@/src/ui/Animations/DumbbellAnimation';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Buttons from './Buttons';
import ExerciseHistory from './ExerciseHistory';
import Information from './Information';
import Instractions from './Instractions';
import TabsManager from './TabsMenager';

const ExerciseScreen = ({ exerciseId }: { exerciseId: string }) => {
  const { data: exercises, isLoading: isExerciseLoading } = useGetExercisesByIds([exerciseId]);
  const exerciseData = exercises?.[0];
  if (isExerciseLoading || !exerciseData) {
    return (
      <BackGround>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">טוען נתונים...</Text>
        </View>
      </BackGround>
    );
  }
  // return <View className='bd h-full'></View>;
  return (
    <BackGround>
      <View className="items-center mt-3">
        <Handle />
      </View>
      <ScrollView
      className=''
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }} // שימוש ב-flexGrow חשוב כאן
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 mb-8 w-full mt-5">
          <Text className="text-white text-4xl font-black text-right leading-tight">
            {exerciseData?.name_he}
          </Text>
          <View className="h-1 w-20 bg-lime-500 rounded-full self-end mt-2" />
        </View>
        <View style={styles.imageWrapper} className="self-center">
          {exerciseData?.gif_available === false ? (
            <>
              <DumbbellAnimation size={200} />
              <Text className="text-zinc-400 text-sm font-medium mt-1">תרגיל זה אינו זמין כרגע</Text>
            </>
          ) : (
            <Image
              style={styles.mainImage}
              source={exerciseData?.gifUrl}
              contentFit="contain"
              transition={500}
              cachePolicy={'disk'}
            />
          )}
        </View>
        <View className="w-full mt-6" style={{ minHeight: 600 }}>
          <Buttons exerciseId={exerciseData?.exerciseId} />
          <Information exercise={exerciseData} />
          {/* <TabsMenager instructions={exerciseData?.instructions_he} /> */}
          <TabsManager
            tabs={[
              {
                title: 'הוראות',
                Component: <Instractions instructions={exerciseData?.instructions_he} />,
              },
              {
                title: 'היסטוריה',
                Component: <ExerciseHistory exerciseId={exerciseData.exerciseId} />,
              },
            ]}
          />
        </View>
      </ScrollView>
    </BackGround>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: '90%',
    height: 280,
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
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
