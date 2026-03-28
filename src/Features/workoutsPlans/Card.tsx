import { colors } from "@/colors";
import { WorkoutPlan } from "@/src/types/workout";
import { Check, Clock, Dumbbell } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface Props {
    plan: WorkoutPlan;
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    isAlreadyAdded?: boolean;
}

const Card = ({ plan, selectedIds, toggleSelection, isAlreadyAdded }: Props) => {
    const isSelected = plan.id ? selectedIds.includes(plan.id) : false;

    return (
        <Pressable
            onPress={() => !isAlreadyAdded && plan.id && toggleSelection(plan.id)}
            accessibilityRole="button"
            accessibilityLabel={isAlreadyAdded ? `${plan.title} - כבר קיים` : plan.title}
            accessibilityState={{ selected: isSelected, disabled: !!isAlreadyAdded }}
            style={{
                opacity: isAlreadyAdded ? 0.4 : 1,
                shadowColor: isSelected ? colors.lime[500] : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isSelected ? 0.12 : 0,
                shadowRadius: 10,
                elevation: isSelected ? 4 : 0,
            }}
            className={`flex-row items-center px-4 py-4 rounded-2xl border ${
                isSelected
                    ? 'bg-background-800 border-lime-500/30'
                    : 'bg-background-800/60 border-zinc-800/50'
            }`}
        >
            {/* Selection indicator / already added badge */}
            {isAlreadyAdded ? (
                <View className="bg-lime-500/20 px-2 py-0.5 rounded-full border border-lime-500/40">
                    <Text className="text-lime-400 text-xs font-bold">קיים</Text>
                </View>
            ) : (
                <View
                    className={`w-[22px] h-[22px] rounded-full items-center justify-center ${
                        isSelected ? 'bg-lime-500' : 'border-2 border-zinc-700'
                    }`}
                >
                    {isSelected && <Check size={13} color={colors.background[900]} strokeWidth={3.5} />}
                </View>
            )}

            {/* Content */}
            <View className="flex-1 ml-3">
                <Text
                    numberOfLines={1}
                    className={`text-base font-bold text-right ${
                        isSelected ? 'text-white' : 'text-zinc-300'
                    }`}
                >
                    {plan.title}
                </Text>

                {/* Meta info */}
                <View className="flex-row items-center gap-2.5 mt-1.5 justify-end">
                    <View className="flex-row items-center gap-1">
                        <Text className="text-zinc-500 text-xs font-medium">
                            {plan.exercise_ids?.length || 0} תרגילים
                        </Text>
                        <Dumbbell size={11} color={isSelected ? colors.lime[500] : colors.background[400]} strokeWidth={2} />
                    </View>

                    <View className="w-[3px] h-[3px] rounded-full bg-zinc-700" />

                    <View className="flex-row items-center gap-1">
                        <Text className="text-zinc-500 text-xs font-medium">
                            {plan.time} דק׳
                        </Text>
                        <Clock size={11} color={isSelected ? colors.lime[500] : colors.background[400]} strokeWidth={2} />
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

export default Card;