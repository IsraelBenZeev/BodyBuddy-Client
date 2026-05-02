import { colors } from "@/colors";
import { useDeleteWorkoutPlan, useDuplicateWorkoutPlan } from "@/src/hooks/useWorkout";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useWorkoutStore } from "@/src/store/workoutsStore";
import { WorkoutPlan } from "@/src/types/workout";
import Loading from "@/src/ui/Loading";
import AppButton from "@/src/ui/PressableOpacity";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Share, Text, View } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';

const Button = React.memo(({ text, onPress, icon }: { text: string, onPress: () => void, icon: ReactNode }) => {
    return (
        <View className="flex-col items-center" >
            <AppButton
                animationType="scale"
                haptic="medium"
                onPress={onPress}
                className="p-3 rounded-full bg-background-900"
                accessibilityLabel={text}
            >
                {icon}
            </AppButton>
            <Text className="typo-caption text-lime-500">{text}</Text>
        </View >
    )
});
const Buttons = ({ plan }: { plan: WorkoutPlan }) => {
    const user = useAuthStore((state) => state.user);
    const router = useRouter();
    const clearAllExercises = useWorkoutStore((state) => state.clearAllExercises);
    const toggleExercise = useWorkoutStore((state) => state.toggleExercise);
    const { mutateAsync: deleteWorkoutPlanMutation, isPending: deletePending, isSuccess: deleteSuccess } = useDeleteWorkoutPlan(user?.id as string)
    const { mutate: duplicatePlan, isPending: duplicatePending } = useDuplicateWorkoutPlan(user?.id as string)
    const [isShowButtonOkDelete, setIsShowButtonOkDelete] = useState<boolean>(false)
    const onDelete = useCallback((id: string) => {
        setIsShowButtonOkDelete(prev => !prev)
        // deleteWorkoutPlanMutation(id);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        deleteWorkoutPlanMutation(plan?.id as string);
    }, [deleteWorkoutPlanMutation, plan?.id]);

    const handleCancelDelete = useCallback(() => setIsShowButtonOkDelete(false), []);

    const handleEdit = useCallback(() => {
        clearAllExercises();
        toggleExercise(plan?.exercise_ids as string[]);
        router.navigate({
            pathname: '/form_create_Workout/[mode]',
            params: { mode: 'edit', workout_plan_id: plan?.id },
        });
    }, [clearAllExercises, toggleExercise, plan?.exercise_ids, plan?.id]);

    const handleShare = useCallback(async () => {
        const days = plan.days_per_week?.join(', ') ?? '';
        await Share.share({
            message:
                `🏋️ תוכנית אימון: ${plan.title}\n` +
                `⏱ זמן: ${plan.time} דקות\n` +
                `💪 רמת קושי: ${plan.difficulty}/5\n` +
                `📅 ימים: ${days}\n` +
                `🔢 תרגילים: ${plan.exercise_ids?.length ?? 0}`,
        });
    }, [plan]);

    const handleDuplicate = useCallback(() => duplicatePlan(plan), [duplicatePlan, plan]);
    useEffect(() => {
        if (deleteSuccess) {
            setIsShowButtonOkDelete(false)
            // router.reload()
        }
    }, [deleteSuccess])
    if (isShowButtonOkDelete) {
        return (
            <Animated.View
                entering={SlideInRight.duration(700).springify()}
                exiting={SlideOutRight.duration(700).springify()}
                style={{
                    position: 'absolute',
                    bottom: -80,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 20,
                    borderRadius: 20,
                }}
                className="flex-row w-full"
            >
                <View className="flex-row items-center gap-6">
                    <AppButton
                        animationType="opacity"
                        haptic="medium"
                        accessibilityLabel="אשר מחיקה"
                        hitSlop={4}
                        onPress={handleConfirmDelete}>
                        <View className={`flex-row items-center order  rounded-full p-3 ${deletePending ? 'opacity-50 ' : 'border border-lime-500'}`}>
                            {deletePending ? <Loading size="small" /> : <AntDesign name="check" size={16} color={colors.lime[500]} />}
                        </View>
                    </AppButton>
                    <AppButton
                        animationType="opacity"
                        haptic="medium"
                        accessibilityLabel="בטל מחיקה"
                        hitSlop={4}
                        onPress={handleCancelDelete}>
                        <View className="flex-row items-center  rounded-full p-3 border border-red-500">
                            <AntDesign name="close" size={16} color="red" />
                        </View>
                    </AppButton>
                </View>
                <Text className="typo-h3 text-lime-500">האם למחוק?</Text>
            </Animated.View>
        )
    }
    return (
        <View
            style={{
                position: 'absolute',
                bottom: -80,
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 25,
                borderRadius: 20,
            }}
            className="flex-row"
        >
            <Button
                text="שכפל"
                onPress={handleDuplicate}
                icon={duplicatePending
                    ? <Loading size="small" />
                    : <Ionicons name="duplicate-outline" size={26} color={colors.lime[500]} />}
            />
            <Button
                text="שתף"
                onPress={handleShare}
                icon={<Feather name="share" size={26} color={colors.lime[500]} />}
            />
            <Button
                text="ערוך"
                onPress={handleEdit}
                icon={<MaterialCommunityIcons name="pencil-outline" size={26} color={colors.lime[500]} />}
            />
            <Button
                text="מחק"
                onPress={() => onDelete(plan?.id as string)}
                icon={<MaterialCommunityIcons name="trash-can-outline" size={26} color={colors.lime[500]} />}
            />

        </View>
    )
}
export default Buttons