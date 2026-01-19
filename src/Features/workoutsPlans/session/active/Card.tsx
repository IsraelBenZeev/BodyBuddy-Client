import { Exercise } from "@/src/types/exercise";
import { Image } from "expo-image";
import { Control } from "react-hook-form";
import { Text, useWindowDimensions, View } from "react-native";
import Failds from "./Failds";
import MyInput from "./MyInput";
import StepInput from "./StepInput";

interface CardProps {
    item: Exercise;
    isActive: boolean;
    activeId: string;
    control: Control<any>;
    // workoutData: any;
    // updateSet: (exerciseId: string, index: number, field: 'reps' | 'weight', value: string) => void;
    // toggleSetComplete: (exerciseId: string, index: number) => void;
}

const Card = ({ item, isActive, activeId, control }: CardProps) => {
    console.log("activeId", activeId);
    const { width, height } = useWindowDimensions();

    return (
        <View className="bg-background-850 border border-white/10 rounded-2xl px-4 py-2 bd gap-3"
        // style={{ width: width * 0.85,  height: "100%"}}
        >

            <View className="justify-center items-end">

                <Text className="text-lime-500 font-bold text-xs uppercase tracking-widest mb-2">
                    {item.bodyParts_he}
                </Text>
                <Text className="text-white text-3xl font-black mb-6 italic text-right">
                    {item.name_he}
                </Text>
            </View>
            <View className="bg-white items-center justify-center  rounded-2xl">
                <Image
                    source={{ uri: item.gifUrl }}
                    className="w-full h-full object-cover"
                    style={{ width: 200, height: 200 }}
                />
            </View>
            <Failds />

            <MyInput
                control={control}
                name={`exercises.${item.exerciseId}.note`}
                label="הערה לתרגיל"
                placeholder="הקלד כאן..."
                type="text"
            />
            <StepInput
                control={control}
                name={`exercises.${item.exerciseId}.reps`}
                label="מספר תרגילים"
                step={1}
            />

        </View>
    );
};

export default Card;