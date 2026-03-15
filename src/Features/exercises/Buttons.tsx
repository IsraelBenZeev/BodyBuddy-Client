import { colors } from "@/colors";
import { useFavoriteIds, useToggleFavorite } from "@/src/hooks/useEcercises";
import { useAuthStore } from "@/src/store/useAuthStore";
import AppButton from "@/src/ui/PressableOpacity";
import { IconAddToListFitness, IconSearchGoogle, IconShare } from "@/src/ui/IconsSVG";
import Entypo from "@expo/vector-icons/Entypo";
import { useCallback, useState } from "react";
import { Linking, Modal, Pressable, Share, StyleSheet, Text, View } from "react-native";
import PlanSelector from "../workoutsPlans/PlansSelector";

interface ButtonsProps {
    exerciseId: string;
    exerciseName: string;
    exerciseName_he: string;
}

const Buttons = ({ exerciseId, exerciseName, exerciseName_he }: ButtonsProps) => {
    const user = useAuthStore((state) => state.user);
    const { data: favorites = [] } = useFavoriteIds(user?.id);
    const { mutate: toggleFavMutate } = useToggleFavorite(user?.id);
    const isFav = favorites.includes(exerciseId);

    const [isShowListWorkoutsPlans, setIsShowListWorkoutsPlans] = useState<boolean>(false);

    const handleOpenPlans = useCallback(() => {
        setIsShowListWorkoutsPlans(true);
    }, []);

    const handleGoogle = useCallback(() => {
        Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(exerciseName + ' exercise')}`);
    }, [exerciseName]);

    const handleShare = useCallback(async () => {
        await Share.share({
            message: `בדוק את התרגיל: ${exerciseName_he}`,
            title: exerciseName_he,
        });
    }, [exerciseName_he]);

    const handleToggleFavorite = useCallback(() => {
        toggleFavMutate({ exerciseId, isFav });
    }, [exerciseId, isFav, toggleFavMutate]);

    return (
        <View>
            <View className="flex-row justify-between px-6 my-8 w-full">
                {[
                    {
                        icon: <Entypo name={isFav ? 'star' : 'star-outlined'} size={20} color={isFav ? colors.lime[400] : colors.lime[500]} />,
                        text: 'מועדף',
                        onPress: handleToggleFavorite,
                    },
                    { icon: <IconShare size={20} color={colors.lime[500]} />, text: 'שתף', onPress: handleShare },
                    {
                        icon: <IconAddToListFitness size={20} color={colors.lime[500]} />, text: 'הוסף', onPress: handleOpenPlans
                    },
                    { icon: <IconSearchGoogle size={20} color={colors.lime[500]} />, text: 'גוגל', onPress: handleGoogle },
                ].map((btn, i) => (
                    <AppButton
                        key={i}
                        animationType="opacity"
                        haptic="medium"
                        onPress={btn.onPress}
                        className="flex-1 items-center gap-1"
                    >
                        <View style={styles.actionButtonInner}>{btn.icon}</View>
                        <Text className="text-zinc-500 text-[10px] font-medium">{btn.text}</Text>
                    </AppButton>
                ))}
            </View>

            <Modal
                visible={isShowListWorkoutsPlans}
                transparent
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setIsShowListWorkoutsPlans(false)}
            >
                <View className="flex-1 justify-end">
                    {/* Backdrop - לחיצה סוגרת את המודל */}
                    <Pressable
                        className="flex-1"
                        onPress={() => setIsShowListWorkoutsPlans(false)}
                    />
                    {/* Content */}
                    <View style={styles.modalContent}>
                        <PlanSelector
                            idExercise={exerciseId}
                            setIsShowListWorkoutsPlans={setIsShowListWorkoutsPlans}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Buttons;

const styles = StyleSheet.create({
    actionButtonInner: {
        backgroundColor: '#1f1f1f',
        padding: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    modalContent: {
        height: '60%',
        shadowColor: colors.lime[500],
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 20,
    },
});
