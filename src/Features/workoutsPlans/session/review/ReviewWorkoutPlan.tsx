import { WorkoutPlan } from "@/src/types/workout";
import PressableOpacity from "@/src/ui/PressableOpacity";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Dispatch, SetStateAction } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { View as AnimatedView } from "react-native-animatable";
import ListExercise from "../../form/ListExercises";
import CardWorkouPlan from "./CardWorkouPlan";
import Header from "./Header";

interface Props {
    workoutPlan: WorkoutPlan;
    setIsStart: Dispatch<SetStateAction<boolean>>;
}
const ReviewWorkoutPlan = ({ workoutPlan, setIsStart }: Props) => {
    const { height } = useWindowDimensions();
    return (
        <View className="flex-1">
            <AnimatedView
                animation="fadeInUp"
                duration={800}
                className="px-4 mt-4"
                style={{ maxHeight: height * 0.45 }}
            >
                <Text className="text-zinc-400 text-right mb-2 font-bold mr-2">תרגילים באימון</Text>
                <ListExercise
                    key={workoutPlan?.exercise_ids?.join(',')}
                    mode="preview"
                    selectExercisesIds={workoutPlan?.exercise_ids}
                />
            </AnimatedView>
            <CardWorkouPlan workoutPlan={workoutPlan} />
            <View className="absolute bottom-10 left-0 right-0 px-10">
                <PressableOpacity
                    onPress={() => setIsStart(true)}
                    className="w-full py-4 rounded-2xl flex-row justify-center items-center shadow-2xl"
                    bgColor="lime-500"
                    activeOpacity="0.8"
                    style={{ elevation: 10 }}
                >
                    <Text className="text-black font-black text-xl mr-2">התחל אימון</Text>
                    <MaterialCommunityIcons name="play" size={28} color="black" />
                </PressableOpacity>
            </View>
        </View>
    );
};

export default ReviewWorkoutPlan;