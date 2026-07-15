import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import { useGetExercisesIdsByWorkoutPlans } from '@/src/hooks/useWorkout';
import { useAuthStore } from '@/src/store/useAuthStore';
import DumbbellAnimation from '@/src/ui/Animations/DumbbellAnimation';
import Loading from '@/src/ui/Loading';
import { Image } from 'expo-image';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { CardExerciseProgress } from './CardExerciseProgress';

interface Props {
  workoutPlanId: string;
}

interface ExerciseChipProps {
  exerciseId: string;
  label: string;
  fullName: string;
  imageUrl?: string;
  isActive: boolean;
  hasData: boolean;
  onPress: (id: string) => void;
}

const ExerciseChip = React.memo(
  ({ exerciseId, label, fullName, imageUrl, isActive, hasData, onPress }: ExerciseChipProps) => (
    <Pressable
      onPress={() => onPress(exerciseId)}
      accessibilityRole="tab"
      accessibilityLabel={`בחר תרגיל ${fullName}`}
      accessibilityState={{ selected: isActive }}
      className={`items-center rounded-2xl border py-2 px-1 ${
        isActive
          ? 'bg-lime-500/15 border-lime-500/60'
          : hasData
          ? 'bg-zinc-800/80 border-zinc-700/50'
          : 'bg-zinc-900/50 border-zinc-800/40'
      }`}
      style={{ width: 72, minHeight: 80 }}
    >
      <View className="w-9 h-9 rounded-lg overflow-hidden bg-zinc-700/60 mb-1.5">
        {imageUrl ? (
          <Image source={imageUrl} style={{ width: 36, height: 36 }} contentFit="cover" cachePolicy="disk" transition={200} />
        ) : (
          <DumbbellAnimation size={36} />
        )}
      </View>

      <Text
        className={`typo-caption text-center ${
          isActive ? 'text-lime-400 font-semibold' : hasData ? 'text-zinc-200' : 'text-zinc-600'
        }`}
        numberOfLines={2}
        style={{ minHeight: 28 }}
      >
        {label}
      </Text>

      <View className={`w-1.5 h-1.5 rounded-full mt-1 ${isActive ? 'bg-lime-500' : 'bg-transparent'}`} />
    </Pressable>
  )
);

const ExercisesProgress = ({ workoutPlanId }: Props) => {
  const user = useAuthStore((state) => state.user);
  const { data: exercisesLog, isPending } = useGetExercisesIdsByWorkoutPlans(
    workoutPlanId,
    user?.id as string
  );
  const { data: exercisesDetails, isPending: isPendingDetails } = useGetExercisesByIds(
    exercisesLog?.map((log) => log.exercise_id) || []
  );

  const processedExercises = useMemo(() => {
    if (!exercisesLog) return [];
    const grouped: Record<string, any> = {};
    exercisesLog.forEach((log) => {
      const id = log.exercise_id;
      if (!grouped[id]) {
        grouped[id] = { id, maxWeight: 0, maxReps: 0, maxSetsInOneSession: {}, allLogs: [] };
      }
      if (log.weight > grouped[id].maxWeight) grouped[id].maxWeight = log.weight;
      if (log.reps > grouped[id].maxReps) grouped[id].maxReps = log.reps;
      grouped[id].maxSetsInOneSession[log.session_id] =
        (grouped[id].maxSetsInOneSession[log.session_id] || 0) + 1;
      grouped[id].allLogs.push(log);
    });
    return Object.values(grouped).map((ex) => ({
      ...ex,
      maxSetsRecord: Math.max(...(Object.values(ex.maxSetsInOneSession) as number[])),
    }));
  }, [exercisesLog]);

  const firstWithDataId = useMemo(
    () => processedExercises.find((ex) => ex.maxReps > 0)?.id ?? processedExercises[0]?.id ?? null,
    [processedExercises]
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeId = selectedId ?? firstWithDataId;

  const handleSelectChip = useCallback((id: string) => setSelectedId(id), []);

  if (isPending || (isPendingDetails && exercisesLog ? exercisesLog?.length > 0 : false))
    return <Loading />;

  if (!exercisesLog?.length) {
    return (
      <View className="px-4 py-12 items-center">
        <Text className="typo-h3 text-white text-center">לא בוצעו תרגילים עדיין</Text>
      </View>
    );
  }

  const selectedExercise = processedExercises.find((ex) => ex.id === activeId);
  const selectedDetails = exercisesDetails?.find(
    (d: any) => d.id === activeId || d.exerciseId === activeId
  );

  return (
    <View className="pb-20">
      {/* Horizontal chips selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2 px-4 py-3">
          {processedExercises.map((exercise) => {
            const details = exercisesDetails?.find(
              (d: any) => d.id === exercise.id || d.exerciseId === exercise.id
            );
            const name: string = details?.name_he ?? '';
            const label = name.length > 10 ? name.slice(0, 10) + '…' : name;
            return (
              <ExerciseChip
                key={exercise.id}
                exerciseId={exercise.id}
                label={label}
                fullName={name}
                imageUrl={details?.imageUrls?.[0]}
                isActive={exercise.id === activeId}
                hasData={exercise.maxReps > 0}
                onPress={handleSelectChip}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Selected exercise detail */}
      {selectedExercise && (
        <View className="px-4 mt-2">
          {/* Exercise header */}
          <View className="flex-row items-center gap-3 mb-5">
            <View className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
              {selectedDetails?.imageUrls?.[0] ? (
                <Image
                  source={selectedDetails.imageUrls[0]}
                  style={{ width: 48, height: 48 }}
                  contentFit="cover"
                  cachePolicy="disk"
                  transition={200}
                />
              ) : (
                <DumbbellAnimation size={48} />
              )}
            </View>
            <View className="flex-1 items-start">
              <Text className="typo-h4 text-white" numberOfLines={1} ellipsizeMode="tail">
                {selectedDetails?.name_he}
              </Text>
            </View>
          </View>

          {selectedExercise.maxReps > 0 ? (
            <CardExerciseProgress exercise={selectedExercise} />
          ) : (
            <View className="bg-zinc-700/30 border border-zinc-600/40 rounded-xl px-4 py-6 items-center">
              <Text className="typo-label text-zinc-400 text-center">
                על תרגיל זה טרם בוצעו חזרות — אין נתונים להצגה
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ExercisesProgress;
