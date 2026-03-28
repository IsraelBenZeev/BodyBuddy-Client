import { colors } from "@/colors";
import { WorkoutPlan } from "@/src/types/workout";
import AppButton from "@/src/ui/PressableOpacity";
import { useRouter } from "expo-router";
import { CircleX } from "lucide-react-native";
import { useCallback } from "react";
import { Alert } from "react-native";
import { Text, View } from "react-native-animatable";
interface Props {
    workoutPlan: WorkoutPlan;
    isStart?: boolean;
}
const Header = ({ workoutPlan, isStart = false }: Props) => {
    const router = useRouter();
    const handleClose = useCallback(() => {
        if (isStart) {
            Alert.alert(
                'יציאה מהאימון',
                'האם אתה בטוח שברצונך לצאת? ההתקדמות לא תישמר.',
                [
                    { text: 'המשך אימון', style: 'cancel' },
                    { text: 'צא', style: 'destructive', onPress: () => router.back() },
                ],
                { cancelable: true }
            );
        } else {
            router.back();
        }
    }, [router, isStart]);
    return (
        <View className="flex-row items-center px-4 py-4 bg-background border-b border-secondary border-b-background-1200">
            <View className="flex-1" />
            <View className="flex-[4] items-center justify-center">
                <Text className="text-2xl font-bold text-center text-lime-500" numberOfLines={1}>
                    {workoutPlan?.title}
                </Text>
            </View>
            <View className="flex-1 items-end">
                <AppButton
                    haptic="light"
                    animationType="opacity"
                    onPress={handleClose}
                    accessibilityLabel="סגור"
                    className="p-2">
                    <CircleX size={24} color={colors.lime[500]} strokeWidth={2} />
                </AppButton>
            </View>

        </View>
    );
};

export default Header;