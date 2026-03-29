import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import { useSessionCreateExerciseLog, useSessionCreateWorkout } from '@/src/hooks/useSession';
import { ExerciseLogDBType, SessionFormData } from '@/src/types/session';
import { WorkoutPlan } from '@/src/types/workout';
import CustomCarousel from '@/src/ui/CustomCarousel';
import Loading from '@/src/ui/Loading';
import AppButton from '@/src/ui/PressableOpacity';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Crypto from 'expo-crypto';
import { memo, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dimensions, Text, View } from 'react-native';
import Card from './Card';
import { colors } from '@/colors';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';

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
    const { control, handleSubmit } = useForm<SessionFormData>({
        defaultValues: {
            notes: '',
            started_at: new Date().toISOString(),
        },
    });

    const { mutateAsync: createSession, isPending: isPendingCreateSession } = useSessionCreateWorkout(user_id, workoutPlan.id as string);
    const { mutateAsync: createExerciseLog, isPending: isPendingCreateExerciseLog } = useSessionCreateExerciseLog(user_id, workoutPlan.id as string);

    const saveSession = async (data: SessionFormData, idSession: string) => {
        const completedAt = new Date().toISOString();
        const startTime = new Date(data.started_at).getTime();
        const endTime = new Date(completedAt).getTime();
        const durationInMinutes = Math.floor((endTime - startTime) / 60000);
        const finalData = {
            user_id: user_id,
            workout_plan_id: workoutPlan.id as string,
            started_at: data.started_at,
            completed_at: completedAt,
            total_time: durationInMinutes,
            notes: data.notes || "",
            id: idSession
        };

        await createSession({
            session: finalData,
        });
    }

    const saveExerciseLog = async (data: SessionFormData, idSession: string) => {
        const allSets: ExerciseLogDBType[] = [];
        Object.entries(data.exercises).forEach(([exerciseId, exerciseDetails]: [string, any]) => {
            exerciseDetails.sets.forEach((set: any, index: number) => {
                allSets.push({
                    user_id: user_id,
                    session_id: idSession,
                    exercise_id: exerciseId,
                    set_number: index + 1,
                    reps: Number(set.reps),
                    weight: Number(set.weight),
                    workout_plan_id: workoutPlan.id as string,
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
            setIsStart(false);
            triggerSuccess('האימון נשמר!', 'success');
        } catch (error) {
            console.error("שגיאה בתהליך השמירה:", error);
            triggerSuccess('שגיאה בשמירת האימון', 'failed');
        }
    }, [createSession, createExerciseLog, triggerSuccess]);

    const handleIndexChange = useCallback((index: number) => setActiveIndex(index), []);
    const renderItem = useCallback((item: any, isActive: boolean, _isSwiped: boolean, activeId: string) => (
        <Card item={item} isActive={isActive} activeId={activeId} control={control} />
    ), [control]);

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
            <View className="px-6 flex-row justify-between items-center py-4">
                <Text className="typo-h2 text-white">{workoutPlan.title}</Text>
                <View className="bg-background-800 px-4 py-2 rounded-2xl border border-white/5">
                    <TimerDisplay />
                </View>
            </View>

            <View className="px-6">
                <Text className="typo-h2 text-white">
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
                />
            </View>

            <View className="px-6 pb-8 pt-2">
                <View className="mb-4">
                    {/* <MyInput control={control} name="note" label="הערה לאימון" /> */}
                </View>

                <AppButton
                    onPress={handleSubmit(onSubmit, (errors) => console.log('Validation Errors:', errors))}
                    className={`bg-lime-500 w-full py-4 rounded-2xl flex-row justify-center items-center shadow-2xl shadow-lime-500/40 ${isPendingCreateSession || isPendingCreateExerciseLog ? 'opacity-50' : ''}`}
                    haptic="medium"
                    animationType="both"
                    disabled={isPendingCreateSession || isPendingCreateExerciseLog}
                    accessibilityLabel="סיים אימון"
                >
                    {isPendingCreateSession || isPendingCreateExerciseLog ? (
                        <Loading size="small" color={colors.background[900]}/>
                    ) : (
                        <>
                            <Text className="typo-btn-cta text-black mr-2">סיים אימון</Text>
                            <MaterialCommunityIcons name="flag-checkered" size={24} color="black" />
                        </>
                    )}
                </AppButton>
            </View>
        </Animated.View>
    );
};
export default Session;
