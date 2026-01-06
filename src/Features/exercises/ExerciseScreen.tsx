import { colors } from '@/colors';
import { Exercise, FetchExercisesResponse } from '@/src/types/exercise';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BackGround from '@/src/ui/BackGround';
import ButtonBack from '@/src/ui/ButtonBack';
import IconButton from '@/src/ui/IconButton';
import ModalButtom from '@/src/ui/ModalButtom';
import {
  IconAddToListFitness,
  IconDislikeBG,
  IconlikeBG,
  IconSearchGoogle,
  IconSecondaryMuscle,
  IconsFitnessTools,
  IconShare,
  IconTargetMuscle,
} from '@/src/ui/IconsSVG';

const ExerciseScreen = ({ exerciseId }: { exerciseId: string }) => {
  const sheetRef = useRef<any>(null);
  const queryClient = useQueryClient();

  const findExerciseInCache = () => {
    const allQueries = queryClient.getQueriesData<FetchExercisesResponse>({
      queryKey: ['exercises'],
    });
    for (const [queryKey, queryData] of allQueries) {
      const found = queryData?.exercises?.find((ex: Exercise) => ex.exerciseId === exerciseId);
      if (found) return found;
    }
    return null;
  };

  const exercise = findExerciseInCache() as Exercise | null;

  return (
    <BackGround>
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - פרופיל וכפתור חזור */}
        <View className="flex-row items-center justify-between w-full px-6 mt-4 mb-6">
          <Image
            style={styles.userAvatar}
            source={require('../../../assets/images/user.png')}
            contentFit="cover"
          />
          <ButtonBack />
        </View>

        {/* שם התרגיל */}
        <View className="px-6 mb-8 w-full">
          <Text className="text-white text-4xl font-black text-right leading-tight">
            {exercise?.name_he}
          </Text>
          <View className="h-1 w-20 bg-lime-500 rounded-full self-end mt-2" />
        </View>

        {/* קונטיינר התמונה - מראה צף ונקי */}
        <View style={styles.imageWrapper}>
          <Image
            style={styles.mainImage}
            source={exercise?.gifUrl}
            contentFit="contain"
            transition={500}
            cachePolicy={'disk'}
          />
        </View>

        {/* שורת כפתורי פעולה */}
        <View className="flex-row justify-center gap-4 px-4 my-8 w-full">
          {[
            { icon: <IconlikeBG size={20} color={colors.lime[500]} />, text: 'אהבתי' },
            { icon: <IconDislikeBG size={20} color={colors.lime[500]} />, text: 'לא אהבתי' },
            { icon: <IconShare size={20} color={colors.lime[500]} />, text: 'שתף' },
            { icon: <IconAddToListFitness size={20} color={colors.lime[500]} />, text: 'הוסף' },
            { icon: <IconSearchGoogle size={20} color={colors.lime[500]} />, text: 'גוגל' },
          ].map((btn, i) => (
            <IconButton
              key={i}
              text={btn.text}
              classNameText="text-zinc-500 text-[10px] mt-1 font-medium"
            >
              <View style={styles.actionButtonInner}>{btn.icon}</View>
            </IconButton>
          ))}
        </View>

        {/* כרטיסיות מידע */}
        <View style={styles.infoSection}>
          {/* פריט מידע: שריר מטרה */}
          <View style={styles.infoRow}>
            <View className="flex-1 pr-4">
              <Text style={styles.infoLabel}>שריר עיקרי</Text>
              <Text style={styles.infoValue}>{exercise?.targetMuscles_he}</Text>
            </View>
            <View style={styles.iconCircle}>
              <IconTargetMuscle size={20} color="black" />
            </View>
          </View>

          {/* פריט מידע: שרירים מסייעים */}
          <View style={styles.infoRow}>
            <View className="flex-1 pr-4">
              <Text style={styles.infoLabel}>שרירים מסייעים</Text>
              <Text style={styles.infoValue}>{exercise?.secondaryMuscles_he.join(', ')}</Text>
            </View>
            <View style={styles.iconCircle}>
              <IconSecondaryMuscle size={20} color="black" />
            </View>
          </View>

          {/* פריט מידע: ציוד */}
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <View className="flex-1 pr-4">
              <Text style={styles.infoLabel}>ציוד נדרש</Text>
              <Text style={styles.infoValue}>{exercise?.equipments_he}</Text>
            </View>
            <View style={styles.iconCircle}>
              <IconsFitnessTools size={20} color="black" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* הוראות ב-Bottom Sheet */}
      <ModalButtom ref={sheetRef} InitialIndex={1} title="איך מבצעים?" initialView='6%'>
        <View className="px-5 py-4 w-full ">
          {exercise?.instructions_he.map((step, i) => (
            <View key={i} style={styles.instructionStep}>
              <View className="bg-lime-500 w-6 h-6 rounded-full items-center justify-center ml-3">
                <Text className="font-bold text-black text-xs">{i + 1}</Text>
              </View>
              <Text className="text-zinc-300 flex-1 text-right text-base leading-6">{step}</Text>
            </View>
          ))}
        </View>
      </ModalButtom>
    </BackGround>
  );
};

const styles = StyleSheet.create({
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.lime[500],
  },
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
  actionButtonInner: {
    backgroundColor: '#1f1f1f',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoSection: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconCircle: {
    backgroundColor: colors.lime[500],
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    color: '#71717a', // zinc-400
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 4,
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  instructionStep: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#18181b',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
});

export default ExerciseScreen;
