import { Text, View } from "react-native";
import Sets from "./Sets";

const Failds = () => {
    return (
        <View className="bg-background-900 gap-2 bd">
            <View className="flex-row-reverse items-center justify-between gap-2">
                <Sets/>
                {/* <Text className="text-white">משקל (ק"ג)</Text>
                <Text className="text-white">חזרות</Text>
                <Text className="text-white">רמת קושי</Text>
                <Text className="text-white">הפסקה</Text>
                <Text className="text-white">הערה</Text> */}
            </View>
        </View>
    );
};

export default Failds;