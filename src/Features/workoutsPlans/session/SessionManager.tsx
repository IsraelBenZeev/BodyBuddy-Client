import { useWorkoutPlan } from "@/src/hooks/useWorkout";
import SuccessAnimation from "@/src/ui/Animations/Success";
import BackGround from "@/src/ui/BackGround";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { View } from "react-native-animatable";
import ListExercise from "../form/ListExercises";
import CardWorkouPlan from "./CardWorkouPlan";
import Header from "./Header";

interface Props {
    id: string;
}

const user_id = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';

const SessionManager = ({ id }: Props) => {
    const { height } = useWindowDimensions();
    const { data: workoutPlan, isLoading: workoutPlanLoading } = useWorkoutPlan(id, user_id);
    const [isStart, setIsStart] = useState(false);

    if (workoutPlanLoading) return null; // או Loading component

    return (
        <BackGround>
            <Header workoutPlan={workoutPlan} />
            <View
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
            </View>
            <CardWorkouPlan workoutPlan={workoutPlan} />
            <View className="absolute bottom-10 left-0 right-0 items-center px-10">
                <TouchableOpacity
                    onPress={() => setIsStart(true)}
                    activeOpacity={0.8}
                    className="bg-lime-500 w-full py-4 rounded-2xl flex-row justify-center items-center shadow-2xl shadow-lime-500/40"
                    style={{ elevation: 10 }}
                >
                    <Text className="text-black font-black text-xl mr-2">התחל אימון</Text>
                    <MaterialCommunityIcons name="play" size={28} color="black" />
                </TouchableOpacity>
            </View>
            <SuccessAnimation />
        </BackGround>
    );
};

export default SessionManager;