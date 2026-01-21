import { colors } from "@/colors";
import AppButton from "@/src/ui/PressableOpacity";
import { Control, Controller } from 'react-hook-form';
import { Text, View } from "react-native";

interface Props {
    control: Control<any>;
    name: string;
    isPendingCreate: boolean;
}

const Days = ({ control, name, isPendingCreate }: Props) => {
    const days = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
    return (
        <Controller
            control={control}
            name={name}
            disabled={isPendingCreate}
            defaultValue={[]}
            rules={{
                validate: (value) => value.length > 0 || 'חובה לבחור לפחות יום אחד'
            }}

            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const handleToggle = (day: string) => {
                    const isSelected = value.includes(day);
                    let newValue;
                    if (isSelected) {
                        newValue = value.filter((d: string) => d !== day);
                    } else {
                        newValue = [...value, day];
                    }
                    onChange(newValue);
                };
                return (
                    <View className="mb-6">
                        <Text className="text-background-400 text-right mb-3 text-sm font-bold">ימי אימון</Text>
                        <View className="flex-row justify-between items-center bg-background-900/50 p-2 rounded-2xl border border-background-800">
                            {days.map((day, index) => {
                                const isSelected = value.includes(day);
                                const textStyle = {
                                    color: isSelected ? colors.background[950] : colors.background[400],
                                    fontWeight: 'bold' as 'bold',
                                };
                                return (
                                    <AppButton
                                        disabled={isPendingCreate}
                                        key={index}
                                        animationType="opacity"
                                        haptic="medium"
                                        activeOpacity={0.7}
                                        onPress={() => handleToggle(day)}
                                        className={`
                                        w-10 h-10 items-center justify-center rounded-full
                                        ${isSelected ? "bg-lime-500" : "bg-transparent"}
                                    `}
                                        style={isSelected ? {
                                            shadowColor: "#bef264",
                                            shadowOffset: { width: 0, height: 0 },
                                            shadowOpacity: 0.5,
                                            shadowRadius: 4,
                                            elevation: 4
                                        } : {}}
                                    >
                                        <Text className={`font-bold ${isSelected ? "text-zinc-950" : "text-zinc-400"}`}>
                                            {day}
                                        </Text>
                                    </AppButton>
                                )
                            })}
                        </View>
                        {error && <Text className="text-red-500 text-right mt-1">{error.message}</Text>}
                    </View>
                )
            }}
        />
    )
}
export default Days;
