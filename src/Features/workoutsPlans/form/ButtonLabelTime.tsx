import { colors } from "@/colors";
import { Pressable, Text, View } from "react-native";
interface ButtonLabelTimeProps {
    totalMinutes: number;
    setVisible: (visible: boolean) => void;
}
const ButtonLabelTime = ({ totalMinutes, setVisible }: ButtonLabelTimeProps) => {
    console.log("totalMinutes", totalMinutes);

    return (
        <View className="mb-6">
            <Text className="text-gray-400 text-right mb-2 text-sm font-medium mr-1">
                משך התרגיל
            </Text>
            <Pressable
                onPress={() => setVisible(true)}
                className="flex-row-reverse items-center justify-between p-4 bg-background-800 border border-background-700 rounded-2xl active:opacity-70"
                style={{ height: 56 }}
            >
                <Text className="text-white text-lg font-light">
                    {totalMinutes > 0
                        ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
                        : "00:00"}
                </Text>
                <View className="opacity-50">
                    <Text style={{ color: colors.lime[500] }}>🕒</Text>
                </View>
            </Pressable>
        </View>
    );
};
export default ButtonLabelTime;
