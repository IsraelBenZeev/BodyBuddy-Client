import { colors } from "@/colors";
import { Slider as CustomSlider } from '@miblanchard/react-native-slider';
import * as Haptics from 'expo-haptics';
import { Control, Controller } from 'react-hook-form';
import { Text, View } from 'react-native';

// הגדרת הטיפוסים ל-Props
interface Props {
    control: Control<any>;
    name: string;
    isPendingCreate: boolean;
}

const IntensitySlider = ({ control, name, isPendingCreate }: Props) => {
    return (
        <Controller
            control={control}
            name={name}
            disabled={isPendingCreate}
            defaultValue={5}
            rules={{
                required: 'חובה להזין רמת קושי',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View className="mb-6">
                    <View className="flex-row-reverse justify-between items-center mb-3">
                        <Text className="text-background-400 font-bold text-sm">רמת קושי</Text>
                        <Text className="text-lime-500 font-black text-lg">
                            {Math.round(value)}/10
                        </Text>
                    </View>

                    <View className="p-4 bg-background-800 rounded-2xl border border-background-700/50">
                        <CustomSlider
                            disabled={isPendingCreate}
                            value={value}
                            onValueChange={(val) => {
                                if (isPendingCreate) return;
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
                            trackStyle={{ height: 6, borderRadius: 3, backgroundColor: colors.background[600] }}
                            thumbStyle={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                backgroundColor: colors.lime[500],
                                borderWidth: 3,
                                borderColor: colors.background[800],
                                shadowColor: colors.lime[500],
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.5,
                                shadowRadius: 5
                            }}
                        />

                        <View className="flex-row justify-between mt-2 px-1">
                            <Text className="text-background-500 text-xs font-bold">קל מאוד</Text>
                            <Text className="text-lime-500/50 text-xs font-bold">בינוני</Text>
                            <Text className="text-red-400/70 text-xs font-bold">אינטנסיבי</Text>
                        </View>
                    </View>
                    {error && <Text className="text-red-500 text-right mt-1">{error.message}</Text>}
                </View>
            )}
        />
    );
};

export default IntensitySlider;