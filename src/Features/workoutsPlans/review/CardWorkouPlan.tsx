import { colors } from "@/colors"
import { WorkoutPlan } from "@/src/types/workout";
import { CalendarDays, Clock, Zap } from "lucide-react-native"
import { Text } from "react-native"
import { View } from "react-native-animatable"
interface Props {
    workoutPlan: WorkoutPlan;
}
const CardWorkouPlan = ({workoutPlan}: Props) => {
    return(
          <View animation="fadeInUp" delay={200} className="px-5 mt-6">
                    <View className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 flex-row-reverse justify-around">
                        
                        {/* זמן */}
                        <View className="items-center">
                            <Clock size={24} color={colors.lime[400]} />
                            <Text className="text-white font-bold mt-1">{workoutPlan?.time} דק׳</Text>
                            <Text className="text-zinc-500 text-xs">זמן משוער</Text>
                        </View>

                        {/* קושי */}
                        <View className="items-center border-x border-zinc-800 px-8">
                            <Zap size={24} color={colors.lime[400]} />
                            <Text className="text-white font-bold mt-1">{workoutPlan?.difficulty}/10</Text>
                            <Text className="text-zinc-500 text-xs">רמת קושי</Text>
                        </View>

                        {/* ימים */}
                        <View className="items-center">
                            <CalendarDays size={24} color={colors.lime[400]} />
                            <Text className="text-white font-bold mt-1">{workoutPlan?.days_per_week?.length}</Text>
                            <Text className="text-zinc-500 text-xs">ימים בשבוע</Text>
                        </View>
                    </View>

                    {/* תיאור (אם קיים) */}
                    {workoutPlan?.description && (
                        <View className="mt-6 bg-zinc-900/40 p-4 rounded-2xl border-r-4 border-lime-500">
                            <Text className="text-zinc-300 text-right leading-6">
                                {workoutPlan.description}
                            </Text>
                        </View>
                    )}
                </View>
    )
}
export default CardWorkouPlan