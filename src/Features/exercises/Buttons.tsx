import { colors } from "@/colors";
import IconButton from "@/src/ui/IconButton";
import { IconAddToListFitness, IconDislikeBG, IconlikeBG, IconSearchGoogle, IconShare } from "@/src/ui/IconsSVG";
import { useState } from "react";
import {  StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import PlanSelector from "../workoutsPlans/PlansSelector";
interface ButtonsProps {
    exerciseId: string;
}
const Buttons = ({ exerciseId }: ButtonsProps) => {
    const [isShowListWorkoutsPlans, setIsShowListWorkoutsPlans] = useState<boolean>(false);
    const {  height } = useWindowDimensions();

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
                <Animated.View 
                className="px-4 py-2"
                style={{ height: height * 0.5 }}
                
                entering={SlideInRight.duration(700).springify()}
                exiting={SlideOutRight.duration(700).springify()}
                >
                    <PlanSelector idExercise={exerciseId} setIsShowListWorkoutsPlans={setIsShowListWorkoutsPlans}/>
                </Animated.View>
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
