import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import { useSessionCreateExerciseLog, useSessionCreateWorkout } from '@/src/hooks/useSession';
import { ExerciseLogDBType, SessionFormData } from '@/src/types/session';
import { WorkoutPlan } from '@/src/types/workout';
import CustomCarousel from '@/src/ui/CustomCarousel';
import Loading from '@/src/ui/Loading';
import AppButton from '@/src/ui/PressableOpacity';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Crypto from 'expo-crypto';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dimensions, Text, View } from 'react-native';
import Card from './Card';
import { colors } from '@/colors';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const user_id = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';

interface Props {
    setIsStart: any;
    workoutPlan: WorkoutPlan;


}
const Session = ({ setIsStart, workoutPlan }: Props) => {
    const { data: exercises, isLoading } = useGetExercisesByIds(workoutPlan.exercise_ids);
    const [totalTime, setTotalTime] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const { control, handleSubmit } = useForm<SessionFormData>({
        defaultValues: {
            notes: '',
            started_at: new Date().toISOString(),
        },
    });

    const { mutateAsync: createSession, isPending: isPendingCreateSession } = useSessionCreateWorkout(user_id);
    const { mutateAsync: createExerciseLog, isPending: isPendingCreateExerciseLog } = useSessionCreateExerciseLog(user_id);
    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const paddedMinutes = minutes.toString().padStart(2, '0');
        const paddedSeconds = seconds.toString().padStart(2, '0');

        return `${paddedMinutes}:${paddedSeconds}`;
    };
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

        console.log('Final Data to Send: ', JSON.stringify(finalData, null, 2));
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
        console.log('Final sets array to send:', JSON.stringify(allSets, null, 2));
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
        } catch (error) {
            console.error("שגיאה בתהליך השמירה:", error);
        }
    }, [createSession, createExerciseLog]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTotalTime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading)
        return (
            <View className="flex-1 bg-background-900 justify-center items-center">
                <Text className="text-white">טוען...</Text>
            </View>
        );

    return (
        <Animated.View className="flex-1 bg-background-900"
            entering={FadeIn.duration(600)} // משך זמן הכניסה במילי-שניות
            exiting={FadeOut.duration(400)}  // משך זמן היציאה
        >
            <View className="px-6 flex-row justify-between items-center py-4">
                <Text className="text-white text-2xl font-black">{workoutPlan.title}</Text>
                <View className="bg-background-800 px-4 py-2 rounded-2xl border border-white/5">
                    <Text className="text-lime-500 font-mono text-xl">{formatTime(totalTime)}</Text>
                </View>
            </View>

            <View className="px-6">
                <Text className="text-white text-2xl font-black">
                    תרגיל {activeIndex + 1} מתוך {exercises?.length}
                </Text>
            </View>
            <View className="flex-1" style={{ height: SCREEN_HEIGHT * 0.85 }}>
                <CustomCarousel
                    data={exercises || []}
                    widthCard={SCREEN_WIDTH * 0.95}
                    variant="center"
                    keyField="exerciseId"
                    onIndexChange={(index) => setActiveIndex(index)} // המשתנה onIndexChange מקבל את ה-index
                    renderItem={(item, isActive, isSwiped, activeId) => (
                        <Card item={item} isActive={isActive} activeId={activeId} control={control} />
                    )}
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
                >
                    {isPendingCreateSession || isPendingCreateExerciseLog ? (
                        <Loading size="small" color={colors.background[900]}/>
                    ) : (
                        <>
                            <Text className="text-black font-black text-xl mr-2">סיים אימון</Text>
                            <MaterialCommunityIcons name="flag-checkered" size={24} color="black" />
                        </>
                    )}
                </AppButton>
            </View>
        </Animated.View>
    );
};
export default Session;
