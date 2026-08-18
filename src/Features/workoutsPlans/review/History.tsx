import { useGetSessions } from "@/src/hooks/useSession";
import { SessionDBType } from "@/src/types/session";
import { Dispatch, SetStateAction, memo, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import SessionReviewCard from "./SessionReviewCard";
import { useAuthStore } from '@/src/store/useAuthStore';
interface Props {
    selectedSession: SessionDBType | null;
    setSelectedSession: Dispatch<SetStateAction<SessionDBType | null>>;
    workoutPlanId: string;
    sheetRef: any;
}

const History = ({ selectedSession, setSelectedSession, workoutPlanId, sheetRef }: Props) => {
    // const sheetRef = useRef<any>(null);
    const user = useAuthStore((state) => state.user);
    const { data: sessionsData, isLoading: isLoadingSessions } = useGetSessions(user?.id as string, workoutPlanId);

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
        <View className="pb-24">
            <Text className="typo-body-primary text-white text-left mb-3">
                {`סה"כ ${sessionsCount} אימונים בוצעו`}
            </Text>
            {sessionsCount > 0 ? (
                <View>
                    {sessionsData?.map((session) => (
                        <SessionReviewCard key={session.id} session={session} setSelectedSession={setSelectedSession} sheetRef={sheetRef} />
                    ))}
                </View>
            ) : (
                <Text className="typo-h2 text-white text-left">אין אימונים עדיין</Text>
            )}
        </View>
    );
};

export default memo(History);