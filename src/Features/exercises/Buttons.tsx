import { colors } from "@/colors";
import { useWorkoutsPlans } from "@/src/hooks/useWorkout";
import IconButton from "@/src/ui/IconButton";
import { IconAddToListFitness, IconDislikeBG, IconlikeBG, IconSearchGoogle, IconShare } from "@/src/ui/IconsSVG";
import { StyleSheet, View } from "react-native";
interface ButtonsProps {
    exerciseId: string;
    sheetRefAddToList: any;
}
const user_id = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';
const Buttons = ({ exerciseId, sheetRefAddToList }: ButtonsProps) => {
    const { data: plansData } = useWorkoutsPlans(user_id)
    const handleAdd = () => {
        console.log('Added: ', exerciseId)
        console.log("plansData", plansData)
        sheetRefAddToList.current?.snapToIndex(0);
    }
    return (
        <View>
            <View className="flex-row justify-center gap-4 px-4 my-8 w-full">
                {[
                    { icon: <IconlikeBG size={20} color={colors.lime[500]} />, text: 'אהבתי', onPress: () => console.log('Liked') },
                    { icon: <IconDislikeBG size={20} color={colors.lime[500]} />, text: 'לא אהבתי', onPress: () => console.log('Disliked') },
                    { icon: <IconShare size={20} color={colors.lime[500]} />, text: 'שתף', onPress: () => console.log('Shared') },
                    { icon: <IconAddToListFitness size={20} color={colors.lime[500]} />, text: 'הוסף', onPress: handleAdd },
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

            {/* <View className="bd ">
                <ModalBottom ref={sheetRef} title="hello" initialIndex={0} minHeight="1%" maxHeight="60%">
                    <View style={{ padding: 0 }}>
                        <Text>hello</Text>
                    </View>
                </ModalBottom>
            </View> */}
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
