import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import { useLatestWorkoutPlanExerciseSets, useSaveWorkoutSession } from '@/src/hooks/useSession';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import { Exercise } from '@/src/types/exercise';
import { ExerciseSetDBType, SessionFormData } from '@/src/types/session';
import { WorkoutPlan } from '@/src/types/workout';
import ActionButton from '@/src/ui/ActionButton';
import AppButton from '@/src/ui/PressableOpacity';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import type { VideoPlayer } from 'expo-video';
import { createVideoPlayer } from 'expo-video';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dimensions, FlatList, ListRenderItemInfo, Text, View, ViewToken } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Card from './Card';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const EXERCISE_CARD_WIDTH = SCREEN_WIDTH * 0.95;
const EXERCISE_CARD_GAP = 15;
const EXERCISE_CARD_SIZE = EXERCISE_CARD_WIDTH + EXERCISE_CARD_GAP;

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimerDisplay = memo(() => {
  const [totalTime, setTotalTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTotalTime((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  return <Text className="typo-h2 text-lime-500 font-mono">{formatTime(totalTime)}</Text>;
});
TimerDisplay.displayName = 'TimerDisplay';

const setupWorkoutVideoPlayer = (videoUrl: string) => {
  const player = createVideoPlayer({ uri: videoUrl, useCaching: true });
  player.loop = true;
  player.muted = true;
  player.audioMixingMode = 'mixWithOthers';
  return player;
};

interface Props {
  setIsStart: (value: boolean) => void;
  workoutPlan: WorkoutPlan;
}

const Session = ({ setIsStart, workoutPlan }: Props) => {
  const user = useAuthStore((state) => state.user);
  const triggerSuccess = useUIStore((state) => state.triggerSuccess);
  const user_id = user?.id as string;
  const { data: exercises, isLoading } = useGetExercisesByIds(workoutPlan.exercise_ids);
  const { data: exerciseHistoryDefaults = {}, isLoading: isHistoryLoading } =
    useLatestWorkoutPlanExerciseSets(user?.id, workoutPlan.id);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeExercise = exercises?.[activeIndex];
  const exerciseListRef = useRef<FlatList<Exercise>>(null);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<Exercise>[] }) => {
      const activeItem = viewableItems.find((item) => item.isViewable && item.index !== null);
      if (activeItem?.index !== null && activeItem?.index !== undefined) {
        setActiveIndex(activeItem.index);
      }
    }
  ).current;
  const [optionalFieldVisibility, setOptionalFieldVisibility] = useState<Record<string, boolean>>(
    {}
  );
  const [activeVideoPlayer, setActiveVideoPlayer] = useState<{
    exerciseId: string;
    player: VideoPlayer;
  } | null>(null);
  const videoPlayersRef = useRef<Map<string, VideoPlayer>>(new Map());
  const releaseTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { control, handleSubmit } = useForm<SessionFormData>({
    defaultValues: {
      notes: '',
      started_at: new Date().toISOString(),
    },
  });

  const { mutateAsync: saveWorkoutSession, isPending: isPendingSaveWorkoutSession } =
    useSaveWorkoutSession(user_id, workoutPlan.id as string);
  const hasHistoryDefaults = Object.values(exerciseHistoryDefaults).some((sets) => sets.length > 0);
  const [isHistoryNoticeVisible, setIsHistoryNoticeVisible] = useState(true);
  const [historyNoticeSeconds, setHistoryNoticeSeconds] = useState(5);

  useEffect(() => {
    if (!hasHistoryDefaults || !isHistoryNoticeVisible) return;

    setHistoryNoticeSeconds(5);
    const historyNoticeInterval = setInterval(() => {
      setHistoryNoticeSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    const historyNoticeTimer = setTimeout(() => {
      setIsHistoryNoticeVisible(false);
    }, 5000);

    return () => {
      clearInterval(historyNoticeInterval);
      clearTimeout(historyNoticeTimer);
    };
  }, [hasHistoryDefaults, isHistoryNoticeVisible]);

  useEffect(() => {
    if (!exercises?.length) {
      setActiveVideoPlayer(null);
      return;
    }

    const desiredIndexes = [activeIndex, activeIndex + 1, activeIndex - 1].filter(
      (index) => index >= 0 && index < exercises.length
    );
    const desiredIds = new Set<string>();

    desiredIndexes.forEach((index) => {
      const exercise = exercises[index];
      if (!exercise?.videoUrl) return;

      desiredIds.add(exercise.exerciseId);
      if (!videoPlayersRef.current.has(exercise.exerciseId)) {
        videoPlayersRef.current.set(
          exercise.exerciseId,
          setupWorkoutVideoPlayer(exercise.videoUrl)
        );
      }
    });

    const activeExercise = exercises[activeIndex];
    const nextActivePlayer = activeExercise?.videoUrl
      ? videoPlayersRef.current.get(activeExercise.exerciseId)
      : null;

    setActiveVideoPlayer(
      nextActivePlayer && activeExercise
        ? { exerciseId: activeExercise.exerciseId, player: nextActivePlayer }
        : null
    );

    videoPlayersRef.current.forEach((player, exerciseId) => {
      try {
        if (exerciseId === activeExercise?.exerciseId) {
          player.play();
        } else {
          player.pause();
        }
      } catch (error) {
        console.warn('Video player control failed:', error);
      }
    });

    videoPlayersRef.current.forEach((player, exerciseId) => {
      if (desiredIds.has(exerciseId)) return;

      videoPlayersRef.current.delete(exerciseId);
      const releaseTimer = setTimeout(() => {
        try {
          player.release();
        } catch (error) {
          console.warn('Video player release failed:', error);
        }
        const timerIndex = releaseTimersRef.current.indexOf(releaseTimer);
        if (timerIndex >= 0) releaseTimersRef.current.splice(timerIndex, 1);
      }, 300);
      releaseTimersRef.current.push(releaseTimer);
    });
  }, [activeIndex, exercises]);

  useEffect(() => {
    const releaseTimers = releaseTimersRef.current;
    const videoPlayers = videoPlayersRef.current;

    return () => {
      releaseTimers.forEach(clearTimeout);
      videoPlayers.forEach((player) => {
        try {
          player.release();
        } catch (error) {
          console.warn('Video player release failed:', error);
        }
      });
      videoPlayers.clear();
    };
  }, []);

  useEffect(() => {
    if (!activeVideoPlayer) return;

    try {
      activeVideoPlayer.player.play();
    } catch (error) {
      console.warn('Active video player failed to start:', error);
    }
  }, [activeVideoPlayer]);

  const buildExerciseSets = useCallback(
    (data: SessionFormData, idSession: string): ExerciseSetDBType[] => {
      const exerciseCompletedTimes = useWorkoutStore.getState().completedTimes;
      const allSets: ExerciseSetDBType[] = [];
      Object.entries(data.exercises).forEach(([exerciseId, exerciseDetails]) => {
        const times = exerciseCompletedTimes[exerciseId] ?? [];
        exerciseDetails.sets.forEach((set, index) => {
          const prevTime = times[index - 1] ?? null;
          const currTime = times[index] ?? null;
          const rest_seconds =
            index > 0 && prevTime != null && currTime != null
              ? Math.round((currTime - prevTime) / 1000)
              : null;
          const values = Object.fromEntries(
            Object.entries(set)
              .filter(([, v]) => v !== undefined && v !== null)
              .map(([key, v]) => [key, Number(v)])
          );
          allSets.push({
            user_id: user_id,
            session_id: idSession,
            exercise_id: exerciseId,
            set_number: index + 1,
            values,
            workout_plan_id: workoutPlan.id as string,
            rest_seconds,
          });
        });
      });
      return allSets;
    },
    [user_id, workoutPlan.id]
  );

  const onSubmit = useCallback(
    async (data: SessionFormData) => {
      try {
        const idSession = Crypto.randomUUID();
        const completedAt = new Date().toISOString();
        const startTime = new Date(data.started_at).getTime();
        const endTime = new Date(completedAt).getTime();
        const durationInSeconds = Math.floor((endTime - startTime) / 1000);
        const session: SessionDBType = {
          id: idSession,
          user_id,
          workout_plan_id: workoutPlan.id as string,
          started_at: data.started_at,
          completed_at: completedAt,
          total_time: durationInSeconds,
          notes: data.notes || '',
        };

        await saveWorkoutSession({
          session,
          exerciseSets: buildExerciseSets(data, idSession),
        });
        useWorkoutStore.getState().clearCompletedTimes();
        setIsStart(false);
      } catch (error) {
        console.error('שגיאה בתהליך השמירה:', error);
        triggerSuccess('שגיאה בשמירת האימון', 'failed');
      }
    },
    [buildExerciseSets, saveWorkoutSession, setIsStart, user_id, workoutPlan.id]
  );

  const handleOptionalFieldVisibilityChange = useCallback((fieldId: string, enabled: boolean) => {
    setOptionalFieldVisibility((currentVisibility) => ({
      ...currentVisibility,
      [fieldId]: enabled,
    }));
  }, []);

  const scrollToExercise = useCallback(
    (index: number) => {
      const exercisesCount = exercises?.length ?? 0;
      if (!exercisesCount) return;

      const nextIndex = Math.max(0, Math.min(exercisesCount - 1, index));
      exerciseListRef.current?.scrollToOffset({
        offset: nextIndex * EXERCISE_CARD_SIZE,
        animated: true,
      });
    },
    [exercises?.length]
  );

  const renderExerciseCard = useCallback(
    ({ item, index }: ListRenderItemInfo<Exercise>) => {
      const isActive = index === activeIndex;

      return (
        <View style={{ width: EXERCISE_CARD_WIDTH, marginRight: EXERCISE_CARD_GAP }}>
          <Card
            item={item}
            isActive={isActive}
            videoPlayer={
              isActive && activeVideoPlayer && item.exerciseId === activeVideoPlayer.exerciseId
                ? activeVideoPlayer.player
                : null
            }
            control={control}
            defaultSets={exerciseHistoryDefaults[item.exerciseId] ?? []}
            optionalFieldVisibility={optionalFieldVisibility}
            onOptionalFieldVisibilityChange={handleOptionalFieldVisibilityChange}
          />
        </View>
      );
    },
    [
      activeIndex,
      activeVideoPlayer,
      control,
      exerciseHistoryDefaults,
      handleOptionalFieldVisibilityChange,
      optionalFieldVisibility,
    ]
  );

  if (isLoading || isHistoryLoading)
    return (
      <View className="flex-1 bg-background-900 justify-center items-center">
        <Text className="typo-body text-white">טוען...</Text>
      </View>
    );

  return (
    <Animated.View
      className="flex-1 bg-background-900"
      entering={FadeIn.duration(600)}
      exiting={FadeOut.duration(400)}
    >
      <View className="px-6 flex-row justify-between items-center py-4 gap-3 ">
        <Text className="typo-h2 text-white flex-1 text-left" numberOfLines={1}>
          {workoutPlan.title}
        </Text>
        <View className="bg-background-800 px-4 py-2 rounded-2xl border border-white/5 shrink-0">
          <TimerDisplay />
        </View>
      </View>

      <View className="px-3 mb-3 flex-row items-center justify-between gap-4">
        <Text className="typo-h3 text-white flex-1 text-left" numberOfLines={1}>
          {activeExercise?.name_he || ''}
        </Text>
        <Text className="typo-body-small text-zinc-400 shrink-0" numberOfLines={1}>
          תרגיל {activeIndex + 1} מתוך {exercises?.length}
        </Text>
      </View>
      {hasHistoryDefaults && isHistoryNoticeVisible && (
        <View className="mx-3 mb-3 flex-row items-center gap-3 rounded-2xl border border-lime-500/30 bg-lime-500/10 px-4 py-3">
          <MaterialCommunityIcons name="history" size={20} color="rgb(213,255,95)" />
          <Text className="typo-caption text-lime-100 flex-1 text-left">
            ייבאנו את הסטים וערכי העבודה מהאימון הקודם שלך
          </Text>
          <Text className="typo-caption-bold text-lime-400 shrink-0">{historyNoticeSeconds}</Text>
          <AppButton
            onPress={() => setIsHistoryNoticeVisible(false)}
            className="p-1"
            haptic="light"
            animationType="both"
            accessibilityLabel="סגור הודעת ייבוא היסטוריה"
          >
            <MaterialCommunityIcons name="close" size={18} color="rgb(212,212,216)" />
          </AppButton>
        </View>
      )}
      <View className="" style={{ height: SCREEN_HEIGHT * 0.7 }}>
        <FlatList
          ref={exerciseListRef}
          data={exercises ?? []}
          renderItem={renderExerciseCard}
          keyExtractor={(exercise) => exercise.exerciseId}
          horizontal
          pagingEnabled={false}
          snapToInterval={EXERCISE_CARD_SIZE}
          decelerationRate="fast"
          disableIntervalMomentum
          showsHorizontalScrollIndicator={false}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={3}
          removeClippedSubviews
          extraData={activeIndex}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          getItemLayout={(_, index) => ({
            length: EXERCISE_CARD_SIZE,
            offset: EXERCISE_CARD_SIZE * index,
            index,
          })}
          style={{ direction: 'ltr' }}
          contentContainerStyle={{
            paddingHorizontal: (SCREEN_WIDTH - EXERCISE_CARD_WIDTH) / 2,
            direction: 'ltr',
          }}
        />
        <View
          className="absolute top-20 left-4 right-4 flex-row justify-between"
          pointerEvents="box-none"
        >
          <AppButton
            onPress={() => scrollToExercise(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="w-11 h-11 rounded-full bg-background-800 border border-white/10 items-center justify-center"
            haptic="light"
            animationType="opacity"
            accessibilityLabel="תרגיל קודם"
            accessibilityRole="button"
            accessibilityState={{ disabled: activeIndex === 0 }}
          >
            <MaterialCommunityIcons name="chevron-left" size={26} color="rgb(161,161,170)" />
          </AppButton>
          <AppButton
            onPress={() => scrollToExercise(activeIndex + 1)}
            disabled={activeIndex >= (exercises?.length ?? 0) - 1}
            className="w-11 h-11 rounded-full bg-background-800 border border-white/10 items-center justify-center"
            haptic="light"
            animationType="opacity"
            accessibilityLabel="תרגיל הבא"
            accessibilityRole="button"
            accessibilityState={{ disabled: activeIndex >= (exercises?.length ?? 0) - 1 }}
          >
            <MaterialCommunityIcons name="chevron-right" size={26} color="rgb(161,161,170)" />
          </AppButton>
        </View>
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-background-900/95 px-6 pb-2 pt-3">
        {/* <View className="mb-4">
                    <MyInput control={control} name="note" label="הערה לאימון" />
                </View> */}

        <ActionButton
          onPress={handleSubmit(onSubmit, (errors) => console.log('Validation Errors:', errors))}
          label="סיים אימון"
          variant="outline"
          size="md"
          fullWidth
          disabled={isPendingSaveWorkoutSession}
          loading={isPendingSaveWorkoutSession}
          accessibilityLabel="סיים אימון"
        />
      </View>
    </Animated.View>
  );
};
export default Session;
