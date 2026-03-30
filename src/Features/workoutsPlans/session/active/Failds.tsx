import { useWorkoutStore } from '@/src/store/workoutsStore';
import AppButton from '@/src/ui/PressableOpacity';
import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Text, View } from 'react-native';
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import PremiumCheck from './PremiumCheck';
import RestTimer from './RestTimer';
import StepInput from './StepInput';

const EMPTY_TIMES: (number | null)[] = [];

const Failds = ({ control, item, onScrollBottom }: any) => {
    const completedTimes = useWorkoutStore((state) => state.completedTimes[item.exerciseId] ?? EMPTY_TIMES);
    const setSetDone = useWorkoutStore((state) => state.setSetDone);
    const addSetTime = useWorkoutStore((state) => state.addSetTime);
    const removeSetTime = useWorkoutStore((state) => state.removeSetTime);

    const { fields, append, remove } = useFieldArray({
        control,
        name: `exercises.${item.exerciseId}.sets`,
    });

    const handleAddSet = () => {
        const currentExercises = control._formValues.exercises?.[item.exerciseId]?.sets;
        const lastSetValues = currentExercises?.[fields.length - 1];
        append({
            weight: lastSetValues?.weight || 0,
            reps: lastSetValues?.reps || 0,
        });
        addSetTime(item.exerciseId);
    };

    const handleRemoveSet = (index: number) => {
        remove(index);
        removeSetTime(item.exerciseId, index);
    };

    useEffect(() => {
        if (fields.length > 0) {
            onScrollBottom();
        }
    }, [fields.length]);

    useEffect(() => {
        if (fields.length === 0) {
            append({ weight: 0, reps: 0 });
            addSetTime(item.exerciseId);
        }
    }, []);

    return (
        <View className="w-full gap-4">
            {fields.map((field, index) => {
                const isLast = index === fields.length - 1;
                const isDone = (completedTimes[index] ?? null) != null;

                return (
                    <View key={field.id}>
                        <View
                            className={`flex-1 gap-2 w-full py-3 px-4 rounded-2xl border ${
                                isDone
                                    ? 'bg-background-800/80 border-lime-500/20 opacity-70'
                                    : isLast
                                    ? 'bg-background-700 border-lime-500/30'
                                    : 'bg-background-800/80 border-white/5 opacity-80'
                            }`}
                        >
                            <View className="flex-row items-center justify-between mr-2">
                                <Text className="typo-caption-bold text-white">סט {index + 1}</Text>
                                <PremiumCheck
                                    checked={isDone}
                                    onPress={() => setSetDone(item.exerciseId, index)}
                                />
                            </View>
                            <Animated.View
                                className="gap-3"
                                entering={SlideInUp.duration(300)}
                                exiting={SlideOutUp.duration(300)}
                            >
                                <View className="w-full flex-row gap-2">
                                    <View className="flex-1">
                                        <StepInput
                                            control={control}
                                            name={`exercises.${item.exerciseId}.sets.${index}.weight`}
                                            label="משקל"
                                            step={1}
                                            disabled={false}
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <StepInput
                                            control={control}
                                            name={`exercises.${item.exerciseId}.sets.${index}.reps`}
                                            label="חזרות"
                                            step={1}
                                            disabled={false}
                                        />
                                    </View>
                                </View>
                                <View className="justify-end items-center">
                                    <AppButton
                                        onPress={() => handleRemoveSet(index)}
                                        className="bg-red-500/10 py-1 px-2 w-full rounded-2xl flex-row justify-center items-center"
                                        haptic="medium"
                                        animationType="both"
                                        accessibilityLabel={`מחק סט ${index + 1}`}
                                    >
                                        <Text className="typo-body-primary text-red-500 ml-2">מחק</Text>
                                    </AppButton>
                                </View>
                            </Animated.View>
                        </View>

                        {completedTimes[index] != null && !isLast && (
                            <RestTimer
                                startTime={completedTimes[index] as number}
                                endTime={completedTimes[index + 1] ?? null}
                            />
                        )}
                    </View>
                );
            })}
            <AppButton
                onPress={handleAddSet}
                className="bg-lime-500/10 border border-lime-500/50 py-3 rounded-2xl flex-row justify-center items-center"
                haptic="medium"
                animationType="both"
                accessibilityLabel="הוסף סט"
            >
                <Text className="typo-body-primary text-lime-500 ml-2">הוסף סט</Text>
            </AppButton>
        </View>
    );
};

export default Failds;
