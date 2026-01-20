import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Control, Controller } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

interface Props {
    control: Control<any>;
    name: string;
    label: string;
    step?: number; // בכמה להעלות/להוריד בכל לחיצה
    disabled?: boolean;
}

const StepInput = ({ control, name, label, step = 1, disabled = false }: Props) => {
    return (
        <View className="flex-1  items-center justify-center gap-2 ">
            <View className="flex-1">
                <Text className="text-zinc-400 text-xs font-bold uppercase">{label}</Text>
            </View>
            <View className="flex-1">
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, value = 0 } }) => (
                        <View className="flex-row items-center bg-zinc-900 rounded-2xl border border-white/5">
                            {/* כפתור מינוס */}
                            <Pressable
                                disabled={!disabled}
                                onPress={() => onChange(Math.max(0, (Number(value) || 0) - step))}
                                className={!disabled ? "w-8 h-8 items-center justify-center bg-zinc-800 rounded-xl active:bg-zinc-700 opacity-50" : "w-8 h-8 items-center justify-center bg-zinc-800 rounded-xl active:bg-zinc-700"}
                            >
                                <MaterialCommunityIcons name="minus" size={24} color="white" />
                            </Pressable>

                            {/* תצוגת המספר */}
                            <View className="px-4 min-w-[30px] items-center">
                                <Text className="text-white text-2xl font-black">{value}</Text>
                            </View>

                            {/* כפתור פלוס */}
                            <Pressable
                                disabled={!disabled}
                                onPress={() => onChange((Number(value) || 0) + step)}
                                className={!disabled ? "w-8 h-8 items-center justify-center bg-lime-500 rounded-xl active:bg-lime-400 opacity-50" : "w-8 h-8 items-center justify-center bg-lime-500 rounded-xl active:bg-lime-400"}
                            >
                                <MaterialCommunityIcons name="plus" size={24} color="black" />
                            </Pressable>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

export default StepInput;
