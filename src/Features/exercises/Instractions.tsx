import { View, Text } from 'react-native';

interface InstractionsProps {
    instructions: string[];
}

const Instractions = ({ instructions }: InstractionsProps) => {
    return (
        <View className="px-5 py-4">
            {/* כותרת הטאב */}
            <View className="flex-row-reverse items-center mb-6">
                <View className="h-6 w-1 bg-lime-500 rounded-full ml-3" />
                <Text className="text-white text-xl font-black text-right">שלבי ביצוע</Text>
            </View>

            {/* רשימת ההוראות */}
            {instructions.map((step, index) => (
                <View key={index} className="flex-row-reverse mb-6">
                    
                    {/* ציר זמן ומספר */}
                    <View className="items-center ml-4">
                        <View className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center z-10">
                            <Text className="text-lime-500 font-black text-lg">{index + 1}</Text>
                        </View>
                        {/* קו מחבר בין העיגולים (לא מופיע בפריט האחרון) */}
                        {index !== instructions.length - 1 && (
                            <View className="absolute top-10 w-[1px] h-full bg-zinc-800" />
                        )}
                    </View>

                    {/* תוכן ההוראה */}
                    <View className="flex-1 bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl shadow-sm self-start">
                        <Text className="text-gray-200 text-right text-base leading-6 font-medium">
                            {step}
                        </Text>
                    </View>
                </View>
            ))}

            {/* טיפ בטיחות בתחתית */}
            <View className="mt-4 bg-lime-500/10 border border-lime-500/20 p-4 rounded-2xl flex-row-reverse items-center">
                <Text className="text-lime-500 text-right text-sm font-bold flex-1">
                    שימו לב לשמור על טכניקה נכונה לאורך כל הסט. במידה ואתם מרגישים כאב חד - הפסיקו מיד.
                </Text>
            </View>
        </View>
    );
};

export default Instractions;