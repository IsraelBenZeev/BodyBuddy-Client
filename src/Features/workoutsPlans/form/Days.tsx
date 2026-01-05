import { colors } from "@/colors";
import { dayType } from "@/src/types/workout";
import { useState } from "react";
import { Control, Controller } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    control: Control<any>;
    name: string;
        isPendingCreate: boolean;
}

const Days = ({ control, name, isPendingCreate }: Props) => {
    const days = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
    // const [selectedDays, setSelectedDays] = useState<dayType[]>([]);

    // const toggleDay = (day: dayType) => {
    //     if (selectedDays.includes(day)) {
    //         setSelectedDays(selectedDays.filter((d) => d !== day));
    //     } else {
    //         setSelectedDays([...selectedDays, day]);
    //     }
    // };
    // console.log("selectedDays: ", selectedDays);


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
                                const containerStyle = {
                                    backgroundColor: isSelected ? colors.lime[500] : 'transparent',
                                    shadowColor: isSelected ? colors.lime[500] : 'transparent',
                                    shadowOpacity: isSelected ? 0.5 : 0,
                                    shadowRadius: isSelected ? 4 : 0,
                                    shadowOffset: { width: 0, height: 0 },
                                };
                                const textStyle = {
                                    color: isSelected ? colors.background[950] : colors.background[400],
                                    fontWeight: 'bold' as 'bold',
                                };
                                return (
                                    <TouchableOpacity
                                        disabled={isPendingCreate}
                                        key={index}
                                        activeOpacity={0.7}
                                        onPress={() => handleToggle(day)}
                                        style={[styles.baseDay, containerStyle]}
                                    >
                                        <Text style={textStyle}>
                                            {day}
                                        </Text>
                                    </TouchableOpacity>
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

const styles = StyleSheet.create({
    baseDay: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        width: 40,
        height: 40,
    }
});

export default Days;
