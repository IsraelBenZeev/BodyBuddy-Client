import { colors } from '@/colors';
import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import { useProfile } from '@/src/hooks/useProfile';
import { useAuthStore } from '@/src/store/useAuthStore';
import DumbbellAnimation from '@/src/ui/Animations/DumbbellAnimation';
import BackGround from '@/src/ui/BackGround';
import Handle from '@/src/ui/Handle';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Buttons from './Buttons';
import ExerciseHistory from './ExerciseHistory';
import Information from './Information';
import Instractions from './Instractions';
import TabsManager from './TabsMenager';

const ExerciseScreen = ({ exerciseId }: { exerciseId: string }) => {
  const [imgError, setImgError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();
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
  return (
    <BackGround>
      <View className="flex-row items-center px-8 mt-3">
        <View className="flex-1 items-center">
          <Handle />
        </View>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
          })}
          accessibilityLabel="סגור"
          accessibilityRole="button"
        >
          <X size={24} color={colors.lime[500]} strokeWidth={2} />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 mb-8 w-full mt-5">
          <Pressable
            onPress={() => setShowTooltip(true)}
            accessibilityLabel={exerciseData?.name_he}
            accessibilityRole="text"
            accessibilityHint="לחץ לצפייה בשם המלא"
          >
            <Text
              className="typo-h1 text-white leading-tight"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {exerciseData?.name_he}
            </Text>
          </Pressable>
          <View className="h-1 w-20 bg-lime-500 rounded-full mt-2" />
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
        <View className="w-full mt-3" style={{ minHeight: 600 }}>
          <Buttons
            exerciseId={exerciseData.exerciseId}
            exerciseName={exerciseData.name}
            exerciseName_he={exerciseData.name_he}
          />
          <Information
            exercise={exerciseData}
            gender={profile?.gender as 'male' | 'female' | undefined}
          />
          {/* <TabsMenager instructions={exerciseData?.instructions_he} /> */}
          <TabsManager
            initialTab={1}
            tabs={[
              {
                title: 'היסטוריה',
                Component: <ExerciseHistory exerciseId={exerciseData.exerciseId} />,
              },
              {
                title: 'הוראות',
                Component: <Instractions instructions={exerciseData?.instructions_he} />,
              },
            ]}
          />
        </View>
      </ScrollView>
      <Modal
        visible={showTooltip}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTooltip(false)}
      >
        <Pressable
          style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 120, paddingHorizontal: 24 }}
          onPress={() => setShowTooltip(false)}
          accessibilityLabel="סגור"
          accessibilityRole="button"
        >
          <View className="bg-zinc-900 rounded-2xl border border-lime-500 px-2 py-3">
            <View className="flex items-end pr-1">
              <Pressable
                onPress={() => setShowTooltip(false)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                hitSlop={8}
                accessibilityLabel="סגור"
                accessibilityRole="button"
              >
                <X size={18} color={colors.lime[500]} strokeWidth={2} />
              </Pressable>
            </View>
            <Text className="typo-h3 text-white">{exerciseData?.name_he}</Text>
          </View>
        </Pressable>
      </Modal>
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
