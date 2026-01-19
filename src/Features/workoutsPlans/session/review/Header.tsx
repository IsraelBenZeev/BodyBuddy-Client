import { colors } from "@/colors";
import { WorkoutPlan } from "@/src/types/workout";
import PressableOpacity from "@/src/ui/PressableOpacity";
import { useRouter } from "expo-router";
import { CircleX } from "lucide-react-native";
import { Text, View } from "react-native-animatable";
interface Props {
    workoutPlan: WorkoutPlan;
}
const Header = ({ workoutPlan, }: Props) => {
    const router = useRouter();
    const handleClose = () => {
        router.back();
    };
    return (
        <View className="flex-row items-center px-4 py-4 bg-background border-b border-secondary border-b-background-1200">
            <View className="flex-1" />
            <View className="flex-[4] items-center justify-center">
                <Text className="text-xl font-bold text-center text-lime-500" numberOfLines={1}>
                    {workoutPlan?.title}
                </Text>
            </View>
            <View className="flex-1 items-end">
                <PressableOpacity onPress={handleClose} className="p-2">
                    <CircleX size={24} color={colors.lime[500]} strokeWidth={2} />
                </PressableOpacity>
            </View>

        </View>
    );
};

export default Header;