import { colors } from '@/colors';
import { SessionDBType } from '@/src/types/session';
import AppButton from '@/src/ui/PressableOpacity';
import { format } from 'date-fns'; // ספרייה מומלצת לטיפול בתאריכים
import { he } from 'date-fns/locale';
import { Calendar, ChevronRight, Clock, NotepadText } from 'lucide-react-native';
import React, { useCallback, useMemo, Dispatch, SetStateAction } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from 'react-native-reanimated';

interface SessionCardProps {
    session: SessionDBType;
    onPress?: () => void;
    setSelectedSession: Dispatch<SetStateAction<SessionDBType | null>>;
    sheetRef: any;
}

const SessionReviewCard = ({ session, onPress, setSelectedSession, sheetRef }: SessionCardProps) => {
    // פורמט תאריך: "יום שישי, 23 בינואר"
    const dateDisplay = format(new Date(session.started_at), "EEEE, d MMMM", { locale: he });
    const timeDisplay = format(new Date(session.started_at), "HH:mm");
    const sessionTitle = useMemo(() => {
        const hour = new Date(session.started_at).getHours();
        if (hour < 12) return "אימון בוקר";
        if (hour < 17) return "אימון צהריים";
        if (hour < 21) return "אימון ערב";
        return "אימון לילה";
    }, [session.started_at]);

    const handlePress = useCallback(() => {
        setSelectedSession(session);
        sheetRef.current?.snapToIndex(1);
    }, [setSelectedSession, session, sheetRef]);

    return (
        <Animated.View
            // entering={FadeInDown.duration(400).springify().damping(15)}
            // אם תמחק אימון, הוא יחליק שמאלה ויעלם
            // exiting={FadeOutLeft}
            // גורם לכל הרשימה לזוז בצורה חלקה כשפריט נוסף/מוסר
            layout={LinearTransition.springify()}
            className="bg-background-850 border border-gray-800 rounded-2xl p-4 mb-3 flex-row items-center justify-between">
            <View className="flex-1">
                {/* תאריך ושעה */}
                <View className="flex-row items-center mb-1">
                    <Calendar size={14} color={colors.lime[500]} />
                    <Text className="typo-caption text-gray-400 ml-2">
                        {dateDisplay}
                    </Text>
                </View>

                {/* שם האימון (אפשר למשוך את שם התוכנית אם יש) */}
                <Text className="typo-h4 text-white mb-2 text-right">
                    {sessionTitle}
                </Text>

                {/* שורת נתונים: זמן והערות */}
                <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center">
                        <Clock size={14} color={colors.background[400]} />
                        <Text className="typo-caption text-gray-400 ml-1">
                            {session.total_time} דקות
                        </Text>
                    </View>

                    {session.notes ? (
                        <View className="flex-row items-center">
                            <NotepadText size={14} color={colors.background[400]} />
                            <Text className="typo-caption text-gray-400 ml-1" numberOfLines={1}>
                                יש הערות
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>

            {/* כפתור מעבר לפרטים */}
            <AppButton
                onPress={handlePress}
                haptic="medium"
                animationType="both"
                accessibilityLabel={`הצג פרטי ${sessionTitle}`}
                className="bg-background-800 p-3 rounded-full ml-4">
                <ChevronRight size={20} color={colors.lime[500]} />
            </AppButton>
        </Animated.View>
    );
};
export default React.memo(SessionReviewCard);