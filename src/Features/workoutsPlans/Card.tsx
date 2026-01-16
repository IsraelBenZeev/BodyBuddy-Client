import { colors } from "@/colors";
import { WorkoutPlan } from "@/src/types/workout";
import { CheckCircle2, Circle, Clock, Dumbbell } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface Props {
    plan: WorkoutPlan;
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    isActive?: boolean;
}

const Card = ({ plan, selectedIds, toggleSelection }: Props) => {
    const isSelected = plan.id ? selectedIds.includes(plan.id) : false;

    return (
        <Pressable
            onPress={() => plan.id && toggleSelection(plan.id)}
            // שימוש ב-Zinc-950 למראה עמוק ויוקרתי
            className={`p-5 h-32 rounded-[30px] border-2 flex flex-col justify-between relative 
        ${isSelected ? 'bg-zinc-900 border-lime-500' : 'bg-background-800 border-zinc-800'}`}
        >

            {/* שורה עליונה: שם האימון וסימון הבחירה */}
            <View className="flex-row justify-between items-center">
                <View className="flex-1 pr-4">
                    <Text
                        numberOfLines={1}
                        className="text-xl font-bold text-white tracking-tight leading-tight"
                    >
                        {plan.title}
                    </Text>
                </View>

                {/* Radio Button מלוטש */}
                <View>
                    {isSelected ? (
                        <CheckCircle2 size={22} color={colors.lime[500]} strokeWidth={2.5} />
                    ) : (
                        <Circle size={22} color={colors.background[1200]} strokeWidth={1.5} />
                    )}
                </View>
            </View>

            {/* שורה תחתונה: נתונים תמציתיים (זמן וכמות) */}
            <View className="flex-row items-center space-x-4">
                {/* זמן אימון */}
                <View className="flex-row items-center">
                    <Clock size={14} color="#71717a" />
                    <Text className="text-zinc-400 text-xs font-semibold ml-1.5">
                        {plan.time} דק׳
                    </Text>
                </View>

                {/* מפריד נקודה עדין */}
                <View className="w-1 h-1 rounded-full bg-zinc-700" />

                {/* כמות תרגילים */}
                <View className="flex-row items-center">
                    <Dumbbell size={14} color="#71717a" />
                    <Text className="text-zinc-400 text-xs font-semibold ml-1.5">
                        {plan.exercise_ids.length} תרגילים
                    </Text>
                </View>
            </View>

            {/* שכבת צבע עדינה מאוד בבחירה */}
            {isSelected && (
                <View className="absolute inset-0 bg-emerald-500/5 rounded-[28px]" pointerEvents="none" />
            )}
        </Pressable>
    );
};

export default Card;