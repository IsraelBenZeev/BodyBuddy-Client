import { useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Text, View } from 'react-native';
import StepInput from './StepInput';
import PremiumCheck from './PremiumCheck';
import AppButton from '@/src/ui/PressableOpacity';

const Failds = ({ control, item, onScrollBottom }: any) => {
    const [isCompleted, setIsCompleted] = useState(false);
    const { fields, append } = useFieldArray({
        control,
        name: `exercises.${item.exerciseId}.sets`
    });

    const handleAddSet = () => {
        const currentExercises = control._formValues.exercises?.[item.exerciseId]?.sets;
        const lastSetValues = currentExercises?.[fields.length - 1];
        append({
            weight: lastSetValues?.weight || 0,
            reps: lastSetValues?.reps || 0
        });
    };
    useEffect(() => {
        if (fields.length > 0) {
            onScrollBottom(); 
        }
    }, [fields.length]);

    useEffect(() => {
        if (fields.length === 0) {
            append({ weight: 0, reps: 0 });
        }
    }, []); 

    return (
        <View className="w-full gap-4">
            {fields.map((field, index) => {
                const isLast = index === fields.length - 1;

                return (
                    <View
                        key={field.id}
                        className={`flex-1 gap-2 w-full py-3 px-4 rounded-2xl border ${isLast
                            ? "bg-background-700 border-lime-500/30"
                            : "bg-background-800/50 border-white/5 opacity-50"
                            }`}
                    >
                        <View className="justify-center mr-2 self-end">
                            <Text className="text-white font-bold text-xs">סט {index + 1}</Text>
                        </View>

                        <View className="w-full flex-row gap-2">


                            <View className="flex-1">
                                <StepInput
                                    control={control}
                                    name={`exercises.${item.exerciseId}.sets.${index}.weight`}
                                    label="משקל"
                                    step={1}
                                    disabled={index === fields.length - 1}
                                />
                            </View>

                            <View className="flex-1">
                                <StepInput
                                    control={control}
                                    name={`exercises.${item.exerciseId}.sets.${index}.reps`}
                                    label="חזרות"
                                    step={1}
                                    disabled={index === fields.length - 1}
                                />
                            </View>
                        </View>
                    </View>
                );
            })}
            <AppButton
                onPress={handleAddSet}
                className="bg-lime-500/10 border border-lime-500/50 py-3 rounded-2xl flex-row justify-center items-center"
                haptic="medium"
                animationType="both"
            >
                {/* <MaterialCommunityIcons name="plus" size={20} color="#bef264" /> */}
                <Text className="text-lime-500 font-bold ml-2">הוסף סט</Text>
            </AppButton>
            <View className="w-full flex-row justify-end bd">                <PremiumCheck checked={isCompleted} onPress={() => setIsCompleted(!isCompleted)} />
            </View> 
        </View>
    );
};

export default Failds;