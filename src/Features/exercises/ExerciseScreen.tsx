import { colors } from '@/colors';
import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import { useProfile } from '@/src/hooks/useProfile';
import { useAuthStore } from '@/src/store/useAuthStore';
import BackGround from '@/src/ui/BackGround';
import Handle from '@/src/ui/Handle';
import DumbbellAnimation from '@/src/ui/Animations/DumbbellAnimation';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Buttons from './Buttons';
import ExerciseHistory from './ExerciseHistory';
import Information from './Information';
import Instractions from './Instractions';
import TabsManager from './TabsMenager';

const ExerciseScreen = ({ exerciseId }: { exerciseId: string }) => {
  const [imgError, setImgError] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useProfile(user?.id);
  const { data: exercises, isLoading: isExerciseLoading } = useGetExercisesByIds([exerciseId]);
  const exerciseData = exercises?.[0];
  if (isExerciseLoading || !exerciseData) {
    return (
      <BackGround>
        <View className="flex-1 items-center justify-center">
          <Text className="typo-h4 text-white">טוען נתונים...</Text>
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
          <Text className="typo-h1 text-white text-right leading-tight">
            {exerciseData?.name_he}
          </Text>
          <View className="h-1 w-20 bg-lime-500 rounded-full self-end mt-2" />
        </View>
        <View style={styles.imageWrapper} className="self-center">
          {exerciseData?.gif_available === false || imgError ? (
            <>
              <DumbbellAnimation size={200} />
              <Text className="typo-label text-zinc-400 mt-1">תרגיל זה אינו זמין כרגע</Text>
            </>
          ) : (
            <Image
              style={styles.mainImage}
              source={exerciseData?.gifUrl}
              contentFit="contain"
              transition={500}
              cachePolicy={'disk'}
              onError={() => setImgError(true)}
            />
          )}
        </View>
        <View className="w-full mt-6" style={{ minHeight: 600 }}>
          <Buttons
            exerciseId={exerciseData.exerciseId}
            exerciseName={exerciseData.name}
            exerciseName_he={exerciseData.name_he}
          />
          <Information exercise={exerciseData} gender={profile?.gender as 'male' | 'female' | undefined} />
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
