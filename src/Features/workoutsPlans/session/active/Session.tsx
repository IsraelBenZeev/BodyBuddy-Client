import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import { useSessionCreateExerciseLog, useSessionCreateWorkout } from '@/src/hooks/useSession';
import { ExerciseSetDBType, SessionFormData } from '@/src/types/session';
import { WorkoutPlan } from '@/src/types/workout';
import CustomCarousel from '@/src/ui/CustomCarousel';
import ActionButton from '@/src/ui/ActionButton';
import * as Crypto from 'expo-crypto';
import { createVideoPlayer } from 'expo-video';
import type { VideoPlayer } from 'expo-video';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dimensions, Text, View } from 'react-native';
import Card from './Card';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import { useWorkoutStore } from '@/src/store/workoutsStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    const [activeIndex, setActiveIndex] = useState(0);
    const activeExercise = exercises?.[activeIndex];
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

    const { mutateAsync: createSession, isPending: isPendingCreateSession } = useSessionCreateWorkout(user_id, workoutPlan.id as string);
    const { mutateAsync: createExerciseLog, isPending: isPendingCreateExerciseLog } = useSessionCreateExerciseLog(user_id, workoutPlan.id as string);

    useEffect(() => {
        if (!exercises?.length) {
            setActiveVideoPlayer(null);
            return;
        }

        const desiredIndexes = [activeIndex, activeIndex + 1, activeIndex - 1]
            .filter((index) => index >= 0 && index < exercises.length);
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

    const saveSession = async (data: SessionFormData, idSession: string) => {
        const completedAt = new Date().toISOString();
        const startTime = new Date(data.started_at).getTime();
        const endTime = new Date(completedAt).getTime();
        const durationInSeconds = Math.floor((endTime - startTime) / 1000);
        const finalData = {
            user_id: user_id,
            workout_plan_id: workoutPlan.id as string,
            started_at: data.started_at,
            completed_at: completedAt,
            total_time: durationInSeconds,
            notes: data.notes || "",
            id: idSession
        };

        await createSession({
            session: finalData,
        });
    }

    const saveExerciseLog = async (data: SessionFormData, idSession: string) => {
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
        await createExerciseLog({
            exerciseLog: allSets,
        });
    }

    const onSubmit = useCallback(async (data: SessionFormData) => {
        try {
            const idSession = Crypto.randomUUID();
            await saveSession(data, idSession);
            await saveExerciseLog(data, idSession);
            useWorkoutStore.getState().clearCompletedTimes();
            setIsStart(false);
            triggerSuccess('האימון נשמר!', 'success');
        } catch (error) {
            console.error("שגיאה בתהליך השמירה:", error);
            triggerSuccess('שגיאה בשמירת האימון', 'failed');
        }
    }, [createSession, createExerciseLog, triggerSuccess]);

    const handleIndexChange = useCallback((index: number) => setActiveIndex(index), []);
    const renderItem = useCallback((item: any, isActive: boolean) => (
        <Card
            item={item}
            isActive={isActive}
            videoPlayer={
                isActive && activeVideoPlayer && item.exerciseId === activeVideoPlayer.exerciseId
                    ? activeVideoPlayer.player
                    : null
            }
            control={control}
        />
    ), [activeVideoPlayer, control]);

    if (isLoading)
        return (
            <View className="flex-1 bg-background-900 justify-center items-center">
                <Text className="typo-body text-white">טוען...</Text>
            </View>
        );

    return (
        <Animated.View className="flex-1 bg-background-900"
            entering={FadeIn.duration(600)}
            exiting={FadeOut.duration(400)}
        >
            <View className="px-6 flex-row justify-between items-center py-4 gap-3 ">
                <Text className="typo-h2 text-white flex-1 text-left" numberOfLines={1}>{workoutPlan.title}</Text>
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
            <View className="flex-1" style={{ height: SCREEN_HEIGHT * 0.85 }}>
                <CustomCarousel
                    data={exercises || []}
                    widthCard={SCREEN_WIDTH * 0.95}
                    variant="center"
                    keyField="exerciseId"
                    onIndexChange={handleIndexChange}
                    renderItem={renderItem}
                    showNavArrows
                />
            </View>

            <View className="px-6 pb-8 pt-2">
                <View className="mb-4">
                    {/* <MyInput control={control} name="note" label="הערה לאימון" /> */}
                </View>

                <ActionButton
                    onPress={handleSubmit(onSubmit, (errors) => console.log('Validation Errors:', errors))}
                    label="סיים אימון"
                    variant="outline"
                    size="md"
                    fullWidth
                    disabled={isPendingCreateSession || isPendingCreateExerciseLog}
                    loading={isPendingCreateSession || isPendingCreateExerciseLog}
                    accessibilityLabel="סיים אימון"
                />
            </View>
        </Animated.View>
    );
};
export default Session;
