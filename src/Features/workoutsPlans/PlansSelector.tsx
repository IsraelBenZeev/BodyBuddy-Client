import { colors } from '@/colors';
import { useAddExerciseToPlan, useWorkoutsPlans } from '@/src/hooks/useWorkout';
import { useAuthStore } from '@/src/store/useAuthStore';
import { WorkoutPlan } from '@/src/types/workout';
import Success from '@/src/ui/Animations/Success';
import { IconAddToList, IconsFitnessTools } from '@/src/ui/IconsSVG';
import ActionButton from '@/src/ui/ActionButton';
import CloseButton from '@/src/ui/CloseButton';
import Loading from '@/src/ui/Loading';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from './Card';

interface PlansSelectorProps {
    idExercise: string;
    setIsShowListWorkoutsPlans: (value: boolean) => void;
}

const PlanSelector = ({ idExercise, setIsShowListWorkoutsPlans }: PlansSelectorProps) => {
    const router = useRouter();
    const { bottom } = useSafeAreaInsets();
    const user = useAuthStore((state) => state.user);
    const userId = user?.id as string;
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { data: plansData, isLoading: isLoadingPlans } = useWorkoutsPlans(userId);
    const { mutateAsync: addExerciseToPlan, isPending: isPendingAddExerciseToPlan, isSuccess: isSuccessAddExerciseToPlan } = useAddExerciseToPlan(userId);

    const isAddedToAllPlans = !!plansData?.length &&
        (plansData as WorkoutPlan[]).every((plan) => plan.exercise_ids?.includes(idExercise));

    const handleAnimationFinish = useCallback(() => {
        setIsShowListWorkoutsPlans(false);
        setSelectedIds([]);
    }, [setIsShowListWorkoutsPlans]);

    useEffect(() => {
        if (isSuccessAddExerciseToPlan) {
            handleAnimationFinish();
        }
    }, [isSuccessAddExerciseToPlan, handleAnimationFinish]);

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
                


                {!!plansData?.length && (
                    <View className="items-start">
                        <Text className="typo-caption-bold text-zinc-500 tracking-[2px] uppercase">
                            Add to plan
                        </Text>
                        <Text className="typo-h3 text-white">
                            בחר תוכנית
                        </Text>
                    </View>
                )}
                <CloseButton onPress={handleClose} variant="gray" size={44} iconSize={16} accessibilityLabel="סגור" />
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
                            paddingBottom: 100 + bottom,
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
                                isAlreadyAdded={plan.exercise_ids?.includes(idExercise)}
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <View className="flex-1 items-center justify-center px-8">
                        <View className="bg-background-800 p-7 rounded-full mb-5 opacity-80">
                            <IconsFitnessTools size={36} color={colors.lime[500]} />
                        </View>
                        <Text className="typo-h4 text-white text-center mb-2">
                            {plansData?.length ? 'התרגיל כבר קיים בכל התוכניות' : 'עדיין אין לך תוכניות אימון'}
                        </Text>
                        <Text className="typo-label text-zinc-500 text-center mb-8 leading-5">
                            {plansData?.length
                                ? 'התרגיל הזה כבר נמצא בכל תוכניות האימון שלך'
                                : `זה הזמן ליצור את האימון הראשון שלך\nולהתחיל להתקדם למטרה!`}
                        </Text>
                        {!plansData?.length && (
                            <ActionButton
                                onPress={handleGoToCreate}
                                label="עבור ליצירת תוכנית"
                                variant="primary"
                                size="sm"
                                accessibilityLabel="עבור ליצירת תוכנית אימון"
                            >
                                <IconAddToList color={colors.lime[300]} size={18} />
                            </ActionButton>
                        )}
                    </View>
                )}
            </View>

            {/* Floating Save Button */}
            {!!plansData?.length && !isAddedToAllPlans && (
                <View
                    className="absolute self-center"
                    style={{ elevation: 10, bottom: 24 + bottom }}
                >
                    <View className="flex-row items-center gap-3">
                        {selectedIds.length > 0 && (
                            <View className="bg-background-800/90 px-4 py-2.5 rounded-2xl border border-zinc-800">
                                <Text className="typo-caption-bold text-zinc-400">
                                    נבחרו: <Text className="text-lime-500">{selectedIds.length}</Text>
                                </Text>
                            </View>
                        )}
                        <Success
                            onPress={handleSave}
                            isLoading={isPendingAddExerciseToPlan}
                            isSuccess={false}
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