// import { WorkoutPlan } from "@/src/types/workout";
// import { Text, View } from "react-native";
// interface Props {
//     plan: WorkoutPlan;
//     isActive?: boolean;
// }
// const Card = ({ plan, isActive }: Props) => {
//     return (
//         <View>
//             <Text className="text-white font-bold">{plan.title}</Text>
//             {isActive && <Text className="text-white text-xs">נבחר</Text>}
//         </View>
//     )
// }
// export default Card
import { WorkoutPlan } from "@/src/types/workout";
import { Text, View, StyleSheet } from "react-native";

interface Props {
    plan: WorkoutPlan;
    isActive?: boolean;
}

const Card = ({ plan, isActive }: Props) => {
    return (
        <View 
            className={`p-4 h-32 rounded-3xl border-2 flex flex-col justify-between
            ${isActive ? 'bg-blue-600 border-blue-400' : 'bg-slate-900 border-slate-800'}`}
            style={isActive ? styles.activeShadow : null}
        >
            <View>
                <Text numberOfLines={1} className="text-lg font-bold text-white">
                    {plan.title}
                </Text>
                <Text className={`text-xs ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    רמה: {plan.difficulty}/5
                </Text>
            </View>

            <View className="flex-row items-center justify-between mt-2">
                <Text className="text-white text-xs font-medium">
                    ⏱️ {plan.time} דק׳
                </Text>
                <Text className="text-white text-xs font-medium">
                    🏋️ {plan.exercise_ids.length} תרגילים
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    activeShadow: {
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
    },
});

export default Card;