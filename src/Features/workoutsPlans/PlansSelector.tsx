import { colors } from '@/colors';
import { useAddExerciseToPlan, useWorkoutsPlans } from '@/src/hooks/useWorkout';
import { useAuthStore } from '@/src/store/useAuthStore';
import { WorkoutPlan } from '@/src/types/workout';
import Success from '@/src/ui/Animations/Success';
import { IconAddToList, IconsFitnessTools } from '@/src/ui/IconsSVG';
import Loading from '@/src/ui/Loading';
import AppButton from '@/src/ui/PressableOpacity';
import { useRouter } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Card from './Card';

interface PlansSelectorProps {
    idExercise: string;
    setIsShowListWorkoutsPlans: (value: boolean) => void;
}

const PlanSelector = ({ idExercise, setIsShowListWorkoutsPlans }: PlansSelectorProps) => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const userId = user?.id as string;
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { data: plansData, isLoading: isLoadingPlans } = useWorkoutsPlans(userId);
    const { mutateAsync: addExerciseToPlan, isPending: isPendingAddExerciseToPlan, isSuccess: isSuccessAddExerciseToPlan } = useAddExerciseToPlan(userId);

    const handleAnimationFinish = useCallback(() => {
        setIsShowListWorkoutsPlans(false);
        setSelectedIds([]);
    }, [setIsShowListWorkoutsPlans]);

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }, []);

    const handleSave = useCallback(() => {
        if (selectedIds.length === 0) return;
        addExerciseToPlan({ idExercise, planIds: selectedIds });
    }, [selectedIds, addExerciseToPlan, idExercise]);

    const handleClose = useCallback(() => {
        setIsShowListWorkoutsPlans(false);
    }, [setIsShowListWorkoutsPlans]);

    const handleGoToCreate = useCallback(() => {
        router.replace('/(tabs)/workouts');
        setIsShowListWorkoutsPlans(false);
    }, [router, setIsShowListWorkoutsPlans]);

    if (isLoadingPlans) {
        return (
            <View className="flex-1 bg-background-900 rounded-t-[28px] items-center justify-center">
                <Loading />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background-900 rounded-t-[28px] overflow-hidden">
            {/* Handle indicator */}
            <View className="items-center pt-3 pb-1">
                <View className="w-10 h-1 rounded-full bg-zinc-700" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pb-4 pt-2">
                <AppButton
                    onPress={handleClose}
                    haptic="light"
                    animationType="both"
                    className="w-9 h-9 rounded-full bg-background-800 items-center justify-center border border-zinc-800"
                >
                    <X color={colors.background[300]} strokeWidth={2.5} size={16} />
                </AppButton>

                {!!plansData?.length && (
                    <View className="items-end">
                        <Text className="text-zinc-500 text-[10px] font-bold tracking-[2px] uppercase">
                            Add to plan
                        </Text>
                        <Text className="text-white text-xl font-black">
                            בחר תוכנית
                        </Text>
                    </View>
                )}
            </View>

            {/* Divider */}
            <View className="h-[0.5px] bg-zinc-800/60 mx-6" />

            {/* Content */}
            <View className="flex-1 mt-2">
                {plansData?.length ? (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingTop: 12,
                            paddingBottom: 100,
                            gap: 10,
                        }}
                        className="flex-1"
                    >
                        {(plansData as WorkoutPlan[]).map((plan) => (
                            <Card
                                key={plan.id}
                                plan={plan}
                                selectedIds={selectedIds}
                                toggleSelection={toggleSelection}
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <View className="flex-1 items-center justify-center px-8">
                        <View className="bg-background-800 p-7 rounded-full mb-5 opacity-80">
                            <IconsFitnessTools size={36} color={colors.lime[500]} />
                        </View>
                        <Text className="text-white text-lg font-semibold text-center mb-2">
                            עדיין אין לך תוכניות אימון
                        </Text>
                        <Text className="text-zinc-500 text-center mb-8 text-sm leading-5">
                            {`זה הזמן ליצור את האימון הראשון שלך\nולהתחיל להתקדם למטרה!`}
                        </Text>
                        <AppButton
                            animationType="both"
                            haptic="light"
                            onPress={handleGoToCreate}
                            className="bg-lime-500 flex-row items-center px-7 py-3.5 rounded-2xl"
                        >
                            <Text className="text-background-900 font-bold text-base mr-2">
                                עבור ליצירת תוכנית
                            </Text>
                            <IconAddToList color={colors.background[900]} size={20} />
                        </AppButton>
                    </View>
                )}
            </View>

            {/* Floating Save Button */}
            {!!plansData?.length && (
                <View
                    className="absolute bottom-6 self-center"
                    style={{ elevation: 10 }}
                >
                    <View className="flex-row items-center gap-3">
                        {selectedIds.length > 0 && (
                            <View className="bg-background-800/90 px-4 py-2.5 rounded-2xl border border-zinc-800">
                                <Text className="text-zinc-400 text-xs font-bold">
                                    נבחרו: <Text className="text-lime-500">{selectedIds.length}</Text>
                                </Text>
                            </View>
                        )}
                        <Success
                            onPress={handleSave}
                            isLoading={isPendingAddExerciseToPlan}
                            isSuccess={isSuccessAddExerciseToPlan}
                            onDone={handleAnimationFinish}
                            size={44}
                            icon={<Check size={22} color={colors.background[850]} strokeWidth={3} />}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

export default PlanSelector;