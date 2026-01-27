import { useGetSessions } from "@/src/hooks/useSession";
import ModalBottom from "@/src/ui/ModalButtom";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SessionInformation from "./SessionInformation";
import SessionReviewCard from "./SessionReviewCard";
const user_id = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';
interface Props {
    selectedSession: string;
    setSelectedSession: Dispatch<SetStateAction<string>>;
    workoutPlanId: string;
    sheetRef: any;
}

const History = ({ selectedSession, setSelectedSession, workoutPlanId, sheetRef }: Props) => {
    // const sheetRef = useRef<any>(null);
    const { data: sessionsData, isLoading: isLoadingSessions } = useGetSessions(user_id, workoutPlanId);
    console.log("workoutPlanId: ", workoutPlanId);

    // useEffect(() => {
    //     if (selectedSession && selectedSession !== "") {
    //         setTimeout(() => {
    //             sheetRef.current?.snapToIndex(1);
    //         }, 50);
    //     }
    // }, [selectedSession]);
    const sessionsCount = sessionsData?.length || 0;

    if (isLoadingSessions) return <Text>Loading...</Text>;
    return (
        <View className="pb-24 flex-1">
            {sessionsCount > 0 ? (
                <ScrollView className="">
                    {sessionsData?.map((session) => (
                        <SessionReviewCard key={session.id} session={session} setSelectedSession={setSelectedSession} sheetRef={sheetRef} />
                    ))}
                </ScrollView>
            ) : (
                <Text className="text-white text-2xl font-black text-right">אין אימונים עדיין</Text>
            )}
        </View>
    );
};

export default History;