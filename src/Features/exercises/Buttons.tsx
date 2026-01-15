import { colors } from "@/colors";
import { useWorkoutsPlans } from "@/src/hooks/useWorkout";
import IconButton from "@/src/ui/IconButton";
import { IconAddToListFitness, IconDislikeBG, IconlikeBG, IconSearchGoogle, IconShare } from "@/src/ui/IconsSVG";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import PlanSelector from "../workoutsPlans/PlansSelector";
interface ButtonsProps {
    exerciseId: string;
}
const user_id = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';
const Buttons = ({ exerciseId }: ButtonsProps) => {
    const { data: plansData } = useWorkoutsPlans(user_id)
    const [isShowListWorkoutsPlans, setIsShowListWorkoutsPlans] = useState<boolean>(false);

    return (
        <View>
            <View className="flex-row justify-center gap-4 px-4 my-8 w-full">
                {[
                    { icon: <IconlikeBG size={20} color={colors.lime[500]} />, text: 'אהבתי', onPress: () => console.log('Liked') },
                    { icon: <IconDislikeBG size={20} color={colors.lime[500]} />, text: 'לא אהבתי', onPress: () => console.log('Disliked') },
                    { icon: <IconShare size={20} color={colors.lime[500]} />, text: 'שתף', onPress: () => console.log('Shared') },
                    {
                        icon: <IconAddToListFitness size={20} color={colors.lime[500]} />, text: 'הוסף', onPress: () => {
                            setIsShowListWorkoutsPlans(prev => !prev)
                        }
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
            {isShowListWorkoutsPlans && (
                <View className="bd p-1 h-48">
                    <PlanSelector idExercise={exerciseId} />
                </View>
            )}
        </View>
    )

}
export default Buttons

const styles = StyleSheet.create({
    actionButtonInner: {
        backgroundColor: '#1f1f1f',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
    },

})
