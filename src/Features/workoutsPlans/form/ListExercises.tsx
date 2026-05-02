import { colors } from '@/colors';
import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import DumbbellAnimation from '@/src/ui/Animations/DumbbellAnimation';
import Loading from '@/src/ui/Loading';
import AppButton from '@/src/ui/PressableOpacity';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from 'react-native-reanimated';

// הפיכת ה-Pressable לרכיב אנימטיבי
const AnimatedPressable = Animated.createAnimatedComponent(AppButton);

interface CardExerciseProps {
  mode: 'edit' | 'preview';
  toggleExercise?: (id: string) => void;
  navigateToPicker?: () => void;
  isPendingCreate?: boolean;
  selectExercisesIds?: string[];
}

const ListExercise = ({
  toggleExercise,
  navigateToPicker,
  isPendingCreate,
  mode,
  selectExercisesIds,
}: CardExerciseProps) => {
  const router = useRouter();
  const { data: selectedExercisesData = [], isLoading: isLoadingExercises } = useGetExercisesByIds(
    selectExercisesIds || []
  );

  if (isLoadingExercises) {
    return (
      <View className="flex flex-col items-center gap-6">
        <Text className="text-lime-500">טוען תרגילים...</Text>
        <Loading />
      </View>
    );
  }

  return (
    <ScrollView
      // ה-Key כאן מבטיח שהאנימציה תרוץ ברגע שהנתונים נטענים
      key={selectedExercisesData.length > 0 ? 'loaded' : 'empty'}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      {selectedExercisesData.length === 0 ? (
        <View className="items-center py-10">
          <MaterialCommunityIcons name="dumbbell" size={40} color={colors.background[50]} />
          <Text className="text-zinc-500 mt-2">טרם נבחרו תרגילים</Text>
        </View>
      ) : (
        selectedExercisesData.map((exercise, index) => (
          <ExerciseItem
            key={exercise.exerciseId}
            exercise={exercise}
            index={index}
            mode={mode}
            toggleExercise={toggleExercise}
          />
        ))
      )}
    </ScrollView>
  );
};

export default ListExercise;

const ExerciseItem = React.memo(function ExerciseItem({
  exercise,
  index,
  mode,
  toggleExercise,
}: {
  exercise: any;
  index: number;
  mode: 'edit' | 'preview';
  toggleExercise?: (id: string) => void;
}) {
  const router = useRouter();
  const handlePress = useCallback(() => {
    router.push({
      pathname: '/exercise/[exerciseId]',
      params: { exerciseId: exercise.exerciseId },
    });
  }, [router, exercise.exerciseId]);
  const handleRemove = useCallback(() => {
    toggleExercise?.(exercise.exerciseId);
  }, [toggleExercise, exercise.exerciseId]);

  return (
    <AnimatedPressable
      animationType="scale"
      haptic="medium"
      entering={FadeInDown.delay(index * 100).springify()}
      exiting={FadeOutLeft.duration(400)}
      layout={LinearTransition.springify()}
      onPress={handlePress}
      className="flex-row items-center bg-zinc-900/50 p-3 mb-3 rounded-2xl border border-zinc-800 gap-3"
      accessibilityLabel={`${exercise.name_he || exercise.name} - הצג פרטי תרגיל`}
    >
      {mode === 'edit' && (
        <AppButton
          animationType="scale"
          haptic="medium"
          onPress={handleRemove}
          className="w-10 h-10 items-center justify-center rounded-full bg-red-500/10 mr-2"
          accessibilityLabel={`הסר ${exercise.name_he || exercise.name}`}
        >
          <MaterialCommunityIcons name="close" size={20} color="#f87171" />
        </AppButton>
      )}
      <View className="bg-white/5 rounded-xl overflow-hidden">
        {exercise.gif_available === false ? (
          <DumbbellAnimation size={56} />
        ) : (
          <Image
            source={{ uri: exercise.gifUrl }}
            style={{ width: 56, height: 56 }}
            contentFit="cover"
            cachePolicy="disk"
          />
        )}
      </View>
      <View className="flex-1 mr-4">
        <Text className="typo-body-primary text-white" numberOfLines={1}>
          {exercise.name_he || exercise.name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="typo-caption text-zinc-400 mr-1 text-right">
            {exercise.targetMuscles_he?.[0] || exercise.targetMuscles?.[0]}
          </Text>
          <MaterialCommunityIcons name="arm-flex" size={12} color="#a1a1aa" />
        </View>
      </View>
    </AnimatedPressable>
  );
});
