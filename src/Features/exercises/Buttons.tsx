import { colors } from "@/colors";
import IconButton from "@/src/ui/IconButton";
import { IconAddToListFitness, IconDislikeBG, IconlikeBG, IconSearchGoogle, IconShare } from "@/src/ui/IconsSVG";
import { useCallback, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import PlanSelector from "../workoutsPlans/PlansSelector";

interface ButtonsProps {
    exerciseId: string;
}

const Buttons = ({ exerciseId }: ButtonsProps) => {
    const [isShowListWorkoutsPlans, setIsShowListWorkoutsPlans] = useState<boolean>(false);

    const handleOpenPlans = useCallback(() => {
        setIsShowListWorkoutsPlans(true);
    }, []);

    return (
        <View>
            <View className="flex-row justify-center gap-4 px-4 my-8 w-full">
                {[
                    { icon: <IconlikeBG size={20} color={colors.lime[500]} />, text: 'אהבתי', onPress: () => console.log('Liked') },
                    { icon: <IconDislikeBG size={20} color={colors.lime[500]} />, text: 'לא אהבתי', onPress: () => console.log('Disliked') },
                    { icon: <IconShare size={20} color={colors.lime[500]} />, text: 'שתף', onPress: () => console.log('Shared') },
                    {
                        icon: <IconAddToListFitness size={20} color={colors.lime[500]} />, text: 'הוסף', onPress: handleOpenPlans
                    },
                    { icon: <IconSearchGoogle size={20} color={colors.lime[500]} />, text: 'גוגל', onPress: () => console.log('Google') },
                ].map((btn, i) => (
                    <IconButton
                        key={i}
                        text={btn.text}
                        classNameText="text-zinc-500 text-[10px] mt-1 font-medium"
                        onPress={btn.onPress}
                    >
                        <View style={styles.actionButtonInner}>{btn.icon}</View>
                    </IconButton>
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
        padding: 12,
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
