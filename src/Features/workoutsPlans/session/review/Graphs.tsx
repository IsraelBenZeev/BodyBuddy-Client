import { WorkoutPlan } from "@/src/types/workout";
import { Text, View } from "react-native";
import GraphData from "./GraphData";
import { useSessionExerciseLogs } from "@/src/hooks/useSession";
interface Props {
    workoutPlanId: string;
}
const Graphs = ({workoutPlanId}: Props) => {
    const {data, isLoading, error} = useSessionExerciseLogs(workoutPlanId);
    return (
        <View className="pb-24 gap-4">
            <View className=" justify-between">
                <Text className="text-zinc-400 text-right mb-2 font-bold mr-2">חזרות</Text>
           <GraphData/>
            </View>
            <View className=" justify-between">
                <Text className="text-zinc-400 text-right mb-2 font-bold mr-2">משקל</Text>
           <GraphData/>
            </View>
            <View className=" justify-between">
                <Text className="text-zinc-400 text-right mb-2 font-bold mr-2">סטים</Text>
           <GraphData/>
            </View>
        </View>
    );
};
export default Graphs;