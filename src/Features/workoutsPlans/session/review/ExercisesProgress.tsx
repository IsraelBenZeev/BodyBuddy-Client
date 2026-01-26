import { Text, View } from "react-native";
interface Props {
    workoutPlanId: string;
}
const ExercisesProgress = ({workoutPlanId}: Props) => {
    
    return (
        <View className="bd">
            <Text>ExercisesProgress</Text>
        </View>
    );
};
export default ExercisesProgress;