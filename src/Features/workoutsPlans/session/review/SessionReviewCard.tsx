import { colors } from '@/colors';
import { SessionDBType } from '@/src/types/session';
import AppButton from '@/src/ui/PressableOpacity';
import { format } from 'date-fns'; // ספרייה מומלצת לטיפול בתאריכים
import { he } from 'date-fns/locale';
import { Calendar, ChevronRight, Clock, NotepadText } from 'lucide-react-native';
import { Dispatch, SetStateAction } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from 'react-native-reanimated';

interface SessionCardProps {
    session: SessionDBType;
    onPress?: () => void;
    setSelectedSession: Dispatch<SetStateAction<string>>;
    sheetRef: any;
}

const SessionReviewCard = ({ session, onPress, setSelectedSession, sheetRef }: SessionCardProps) => {
    // פורמט תאריך: "יום שישי, 23 בינואר"
    const dateDisplay = format(new Date(session.started_at), "EEEE, d MMMM", { locale: he });
    const timeDisplay = format(new Date(session.started_at), "HH:mm");
    const getSessionTitle = (dateString: string) => {
        const hour = new Date(dateString).getHours();
        if (hour < 12) return "אימון בוקר";
        if (hour < 17) return "אימון צהריים";
        if (hour < 21) return "אימון ערב";
        return "אימון לילה";
    };
    return (
        <Animated.View
            entering={FadeInDown.duration(400).springify().damping(15)}
            // אם תמחק אימון, הוא יחליק שמאלה ויעלם
            exiting={FadeOutLeft}
            // גורם לכל הרשימה לזוז בצורה חלקה כשפריט נוסף/מוסר
            layout={LinearTransition.springify()}
            className="bg-background-850 border border-gray-800 rounded-2xl p-4 mb-3 flex-row items-center justify-between">
            <View className="flex-1">
                {/* תאריך ושעה */}
                <View className="flex-row items-center mb-1">
                    <Calendar size={14} color={colors.lime[500]} />
                    <Text className="text-gray-400 text-xs ml-2 font-medium">
                        {dateDisplay}
                    </Text>
                </View>

                {/* שם האימון (אפשר למשוך את שם התוכנית אם יש) */}
                <Text className="text-white text-lg font-bold mb-2 text-right">
                    {getSessionTitle(session.started_at)}
                </Text>

                {/* שורת נתונים: זמן והערות */}
                <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center">
                        <Clock size={14} color={colors.background[400]} />
                        <Text className="text-gray-400 text-xs ml-1">
                            {session.total_time} דקות
                        </Text>
                    </View>

                    {session.notes ? (
                        <View className="flex-row items-center">
                            <NotepadText size={14} color={colors.background[400]} />
                            <Text className="text-gray-400 text-xs ml-1" numberOfLines={1}>
                                יש הערות
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>

            {/* כפתור מעבר לפרטים */}
            <AppButton
                onPress={() => {
                    setSelectedSession(session?.id || "")
                    sheetRef.current?.snapToIndex(1);
                }}
                haptic="medium"
                animationType="both"
                className="bg-background-800 p-2 rounded-full ml-4">
                <ChevronRight size={20} color={colors.lime[500]} />
            </AppButton>
        </Animated.View>
    );
};
export default SessionReviewCard;