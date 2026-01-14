import { colors } from '@/colors';
import { Exercise, FetchExercisesResponse } from '@/src/types/exercise';
import BackGround from '@/src/ui/BackGround';
import {
  IconSecondaryMuscle,
  IconsFitnessTools,
  IconTargetMuscle
} from '@/src/ui/IconsSVG';
import Loading from '@/src/ui/Loading';
import ModalBottom from '@/src/ui/ModalButtom';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import PlanSelector from '../workoutsPlans/PlansSelector';
import Buttons from './Buttons';
import Handle from '@/src/ui/Handle';



const ExerciseScreen = ({ exerciseId }: { exerciseId: string }) => {
  const [isAnySheetOpen, setIsAnySheetOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const sheetRefModalInstractions = useRef<any>(null);
  const sheetRefAddToList = useRef<any>(null);
  const queryClient = useQueryClient();
  const navigation = useNavigation();
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

  const exercise = findExerciseInCache() as Exercise;

  const onClose = () => {
    setSelectedIds([]);
    sheetRefAddToList.current?.close();
  };
  useEffect(() => {
    console.log("isAnySheetOpen", isAnySheetOpen);
    
    navigation.setOptions({
      gestureEnabled: isAnySheetOpen,
      // gestureResponseDistance: isAnySheetOpen ? 0 : 50,
      // fullScreenGestureEnabled: false
    });
  }, [isAnySheetOpen, navigation]);
  const handleAddToListChange = (isOpen: boolean) => {
    // 1. מעדכן את מצב הגרירה של האפליקציה (מה שעשינו קודם)
    setIsAnySheetOpen(isOpen);

    // 2. אם המודל נסגר (isOpen הוא false), נאפס את הבחירה
    if (!isOpen) {
      setSelectedIds([]);
      console.log("הבחירה אופסה");
    }
  };
  return (
    <BackGround>
      <View className='items-center mt-3'>
        <Handle />
      </View>
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >

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
        <Buttons exerciseId={exercise?.exerciseId} sheetRefAddToList={sheetRefAddToList} />


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
      <ModalBottom
        title="איך מבצעים?"
        ref={sheetRefModalInstractions}
        initialIndex={0} minHeight="10%"
        maxHeight="80%"
        onChange={(isOpen) => setIsAnySheetOpen(isOpen)}>
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
      </ModalBottom>
      <ModalBottom
        ref={sheetRefAddToList}
        title=""
        initialIndex={-1}
        minHeight="40%"
        maxHeight="80%"
        enablePanDownToClose={true}
        useScrollView={false}
        onChange={handleAddToListChange}
      >
        <PlanSelector selectedIds={selectedIds} setSelectedIds={setSelectedIds} idExercise={exercise?.exerciseId} onClose={onClose} />
      </ModalBottom>

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
