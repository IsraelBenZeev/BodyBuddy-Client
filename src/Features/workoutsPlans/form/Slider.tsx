import React from 'react';
import { View, Text } from 'react-native';
import { Slider as CustomSlider } from '@miblanchard/react-native-slider';
import { colors } from "@/colors";
import * as Haptics from 'expo-haptics';
import { Controller, Control } from 'react-hook-form';

// הגדרת הטיפוסים ל-Props
interface Props {
    control: Control<any>;
    name: string;
}

const IntensitySlider = ({ control, name }: Props) => {
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={5}
            rules={{
                required: 'חובה להזין רמת קושי',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View className="mb-8 p-6 bg-background-800 rounded-3xl border border-background-700 shadow-xl">
                    <View className="flex-row-reverse justify-between items-center mb-6">
                        <Text className="text-gray-400 font-bold text-lg">רמת קושי</Text>
                        <View className="bg-lime-500 px-4 py-1 rounded-2xl shadow-lg shadow-lime-500/40">
                            <Text className="text-background-900 font-black text-xl">
                                {Math.round(value)}
                            </Text>
                        </View>
                    </View>

                    <CustomSlider
                        value={value}
                        onValueChange={(val) => {
                            const newValue = Array.isArray(val) ? val[0] : val;
                            onChange(newValue);
                            Haptics.selectionAsync(); // רטט בכל שינוי
                        }}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        minimumTrackTintColor={colors.lime[500]}
                        maximumTrackTintColor={colors.background[600]}
                        thumbTintColor={colors.lime[500]}
                        trackStyle={{ height: 8, borderRadius: 4 }}
                        thumbStyle={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: colors.lime[500],
                            borderWidth: 2,
                            borderColor: 'white'
                        }}
                    />

                    <View className="flex-row justify-between mt-2 px-1">
                        <Text className="text-gray-500 text-xs font-bold">קל</Text>
                        <Text className="text-gray-400 text-xs font-bold">בינוני</Text>
                        <Text className="text-gray-300 text-xs font-bold">קשה</Text>
                    </View>
                    {error && <Text className="text-red-500">{error.message}</Text>}
                </View>
            )}
        />
    );
};

export default IntensitySlider;