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
    workoutPlanId:string;
}

const History = ({ selectedSession, setSelectedSession,workoutPlanId }: Props) => {
    const sheetRef = useRef<any>(null);
    const { data: sessionsData, isLoading: isLoadingSessions } = useGetSessions(user_id, workoutPlanId);
    useEffect(() => {
        if (selectedSession && selectedSession !== "") {
            setTimeout(() => {
                sheetRef.current?.snapToIndex(1);
            }, 50);
        }
    }, [selectedSession]);


    if (isLoadingSessions) return <Text>Loading...</Text>;
    return (
        <View className="pb-24">
            <Text>History</Text>
            <ScrollView className="">
                {sessionsData?.map((session) => (
                    <SessionReviewCard key={session.id} session={session} setSelectedSession={setSelectedSession} sheetRef={sheetRef} />
                ))}
            </ScrollView>
        
            <ModalBottom
                key={selectedSession} // <--- זה יפתור את רוב בעיות ה-Lifecycle
                ref={sheetRef}
                title="פרטי האימון"
                initialIndex={-1}
                minHeight="50%"
                maxHeight="90%"
                enablePanDownToClose={true}
                onClose={() => setSelectedSession("")}
            >
                <SessionInformation sessionId={selectedSession}/>
            </ModalBottom>
        </View>
    );
};

export default History;