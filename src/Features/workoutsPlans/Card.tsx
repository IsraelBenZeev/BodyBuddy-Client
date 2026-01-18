// import { colors } from "@/colors";
// import { WorkoutPlan } from "@/src/types/workout";
// import { CheckCircle2, Circle, Clock, Dumbbell } from "lucide-react-native";
// import { Pressable, Text, View } from "react-native";

// interface Props {
//     plan: WorkoutPlan;
//     selectedIds: string[];
//     toggleSelection: (id: string) => void;
//     isActive?: boolean;
// }

// const Card = ({ plan, selectedIds, toggleSelection }: Props) => {
//     const isSelected = plan.id ? selectedIds.includes(plan.id) : false;

//     return (
//         <Pressable
//             onPress={() => plan.id && toggleSelection(plan.id)}
//             // שימוש ב-Zinc-950 למראה עמוק ויוקרתי
//             className={`p-5 h-32 rounded-[30px] border-2 flex flex-col justify-between relative 
//         ${isSelected ? 'bg-zinc-900 border-lime-500' : 'bg-background-800 border-zinc-800'}`}
//         >

//             {/* שורה עליונה: שם האימון וסימון הבחירה */}
//             <View className="flex-row justify-between items-center">
//                 <View className="flex-1 pr-4">
//                     <Text
//                         numberOfLines={1}
//                         className="text-xl font-bold text-white tracking-tight leading-tight"
//                     >
//                         {plan.title}
//                     </Text>
//                 </View>

//                 {/* Radio Button מלוטש */}
//                 <View>
//                     {isSelected ? (
//                         <CheckCircle2 size={22} color={colors.lime[500]} strokeWidth={2.5} />
//                     ) : (
//                         <Circle size={22} color={colors.background[1200]} strokeWidth={1.5} />
//                     )}
//                 </View>
//             </View>

//             {/* שורה תחתונה: נתונים תמציתיים (זמן וכמות) */}
//             <View className="flex-row items-center space-x-4">
//                 {/* זמן אימון */}
//                 <View className="flex-row items-center">
//                     <Clock size={14} color="#71717a" />
//                     <Text className="text-zinc-400 text-xs font-semibold ml-1.5">
//                         {plan.time} דק׳
//                     </Text>
//                 </View>

//                 {/* מפריד נקודה עדין */}
//                 <View className="w-1 h-1 rounded-full bg-zinc-700" />

//                 {/* כמות תרגילים */}
//                 <View className="flex-row items-center">
//                     <Dumbbell size={14} color="#71717a" />
//                     <Text className="text-zinc-400 text-xs font-semibold ml-1.5">
//                         {plan.exercise_ids.length} תרגילים
//                     </Text>
//                 </View>
//             </View>

//             {/* שכבת צבע עדינה מאוד בבחירה */}
//             {isSelected && (
//                 <View className="absolute inset-0 bg-emerald-500/5 rounded-[28px]" pointerEvents="none" />
//             )}
//         </Pressable>
//     );
// };

// export default Card;




import { colors } from "@/colors";
import { WorkoutPlan } from "@/src/types/workout";
import { Check, Clock, Dumbbell, Trophy } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface Props {
    plan: WorkoutPlan;
    selectedIds: string[];
    toggleSelection: (id: string) => void;
}

const Card = ({ plan, selectedIds, toggleSelection }: Props) => {
    const isSelected = plan.id ? selectedIds.includes(plan.id) : false;

    return (
        <Pressable
            onPress={() => plan.id && toggleSelection(plan.id)}
            style={{
                backgroundColor: isSelected ? colors.background[800] : colors.background[900],
                borderColor: isSelected ? colors.lime[500] : colors.background[800],
                // הוספת צללית עדינה בבחירה
                shadowColor: colors.lime[500],
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: isSelected ? 0.15 : 0,
                shadowRadius: 12,
                elevation: isSelected ? 8 : 0,
            }}
            className="p-6 h-44 rounded-[40px] border-[1.5px] flex-col justify-between relative overflow-hidden"
        >
            {/* Background Decor - אלמנט קישוטי שקוף ברקע */}
            <View className="absolute -right-2 -bottom-2 opacity-[0.03]">
                <Trophy size={120} color="white" />
            </View>

            <View>
                <View className="flex-row justify-between items-start">
                    <View className="bg-lime-500/10 px-3 py-1.5 rounded-full flex-row items-center">
                        <Trophy size={10} color={colors.lime[500]} />
                        <Text className="text-lime-500 text-[8px] font-black uppercase tracking-[1px] ml-1">
                            Pro Plan
                        </Text>
                    </View>

                    {/* Circle Indicator */}
                    <View className={`w-6 h-6 rounded-full items-center justify-center ${isSelected ? 'bg-lime-500' : 'border border-background-700'}`}>
                        {isSelected && <Check size={14} color={colors.background[900]} strokeWidth={4} />}
                    </View>
                </View>

                <Text
                    numberOfLines={1}
                    className="text-2xl font-black text-white mt-4 italic tracking-tighter"
                >
                    {plan.title}
                </Text>
            </View>

            {/* נתוני אימון בעיצוב "קפסולה" */}
            <View className="flex-row items-center gap-4 bg-background-950/50 self-start px-4 py-2.5 rounded-2xl border border-white/5">
                <View className="flex-row items-center gap-2">
                    <Clock size={14} color={colors.lime[500]} strokeWidth={2.5} />
                    <Text className="text-zinc-300 text-xs font-bold">{plan.time}m</Text>
                </View>

                <View className="w-[1px] h-3 bg-zinc-800" />

                <View className="flex-row items-center gap-2">
                    <Dumbbell size={14} color={colors.lime[500]} strokeWidth={2.5} />
                    <Text className="text-zinc-300 text-xs font-bold">{plan.exercise_ids?.length || 0} EX</Text>
                </View>
            </View>
        </Pressable>
    );
};

export default Card;