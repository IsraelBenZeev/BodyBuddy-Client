import { useGetExercisesByIds } from "@/src/hooks/useEcercises";
import { WorkoutPlan, } from "@/src/types/workout";
import CustomCarousel from "@/src/ui/CustomCarousel";
import AppButton from "@/src/ui/PressableOpacity";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dimensions, Text, View } from "react-native";
import Card from "./Card";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Session = ({ setIsStart, workoutPlan }: { setIsStart: any, workoutPlan: WorkoutPlan }) => {
    const { data: exercises, isLoading } = useGetExercisesByIds(workoutPlan.exercise_ids);
    const [totalTime, setTotalTime] = useState(0);
    const { control, handleSubmit } = useForm();
    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const paddedMinutes = minutes.toString().padStart(2, '0');
        const paddedSeconds = seconds.toString().padStart(2, '0');

        return `${paddedMinutes}:${paddedSeconds}`;
    };
    const onSubmit = (data: any) => {
        data.totalTime = totalTime;
        console.log("data from onSubmit: ", JSON.stringify(data, null, 2));
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setTotalTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    if (isLoading) return <View className="flex-1 bg-background-900 justify-center items-center"><Text className="text-white">טוען...</Text></View>;
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <View className="flex-1 bg-background-900">
            <View className="px-6 flex-row justify-between items-center py-4">
                <Text className="text-white text-2xl font-black">{workoutPlan.title}</Text>
                <View className="bg-background-800 px-4 py-2 rounded-2xl border border-white/5">
                    <Text className="text-lime-500 font-mono text-xl">{formatTime(totalTime)}</Text>
                </View>
            </View>

            {/* <View className="flex-1" style={{ height: SCREEN_HEIGHT * 0.85 }}>
                <CustomCarousel
                    data={exercises || []}
                    widthCard={SCREEN_WIDTH * 0.95}
                    variant="center"
                    keyField="exerciseId"
                    renderItem={(item, isActive, isSwiped, activeId) => (
                        <Card
                            item={item}
                            isActive={isActive}
                            activeId={activeId}
                            control={control}
                        />
                    )}
                />
            </View> */}
            <View className="px-6">
                <Text className="text-white text-2xl font-black">תרגיל {activeIndex + 1} מתוך {exercises?.length}</Text>
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
                    onPress={handleSubmit(onSubmit, (errors) => console.log("Validation Errors:", errors))}
                    className="bg-lime-500 w-full py-4 rounded-2xl flex-row justify-center items-center shadow-2xl shadow-lime-500/40"
                    haptic="medium"
                    animationType="both"
                >
                    <Text className="text-black font-black text-xl mr-2">סיים אימון</Text>
                    <MaterialCommunityIcons name="flag-checkered" size={24} color="black" />
                </AppButton>
            </View>
        </View>
    );
};
export default Session;