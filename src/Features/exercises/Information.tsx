import { Exercise } from "@/src/types/exercise";
import { IconSecondaryMuscle, IconsFitnessTools } from "@/src/ui/IconsSVG";
import { BACK_BODY_MUSCLES, BodyPart, FRONT_BODY_MUSCLES, targetMuscleToBodyParts } from "@/src/types/bodtPart";
import MiniAvatar from "./MiniAvatar";
import { useMemo } from "react";
import { Text, View } from "react-native";
interface InformationProps {
    exercise: Exercise;
    gender?: 'male' | 'female';
}
const Information = ({ exercise, gender }: InformationProps) => {
    const targetParts = useMemo(() => {
        const parts = new Set<BodyPart>();
        for (const muscle of exercise.targetMuscles) {
            const mapped = targetMuscleToBodyParts[muscle] ?? [];
            mapped.forEach((p) => parts.add(p));
        }
        return Array.from(parts);
    }, [exercise.targetMuscles]);

    const preferBack = useMemo(() => {
        const hasBack = exercise.targetMuscles.some((m) => BACK_BODY_MUSCLES.has(m));
        const hasFront = exercise.targetMuscles.some((m) => FRONT_BODY_MUSCLES.has(m));
        return hasBack && !hasFront;
    }, [exercise.targetMuscles]);

    return (
        <View className="px-5 w-full space-y-3 mt-4 gap-3">
            {/* כרטיס שריר עיקרי */}
            <View className="flex-row-reverse items-center bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl">
                {gender && targetParts.length > 0 && (
                    <MiniAvatar
                        selectedParts={targetParts}
                        gender={gender}
                        preferBack={preferBack}
                    />
                )}
                <View className="flex-1 mr-4">
                    <Text className="text-zinc-500 text-xs font-bold text-right mb-1 uppercase tracking-tighter">שריר עיקרי</Text>
                    <Text className="text-white text-lg font-bold text-right">
                        {exercise?.targetMuscles_he}
                    </Text>
                </View>
            </View>

            {/* שורה כפולה לציוד ושרירים מסייעים */}
            <View className="flex-row-reverse space-x-3 gap-3">

                {/* ציוד - כרטיס חצי רוחב */}
                <View className="flex-1 bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl items-end">
                    <View className="bg-zinc-800 p-2 rounded-xl mb-3">
                        <IconsFitnessTools size={20} color="#D7FF00" />
                    </View>
                    <Text className="text-zinc-500 text-[10px] font-bold uppercase mb-1">ציוד</Text>
                    <Text className="text-white text-sm font-bold text-right" numberOfLines={1}>
                        {exercise?.equipments_he}
                    </Text>
                </View>

                {/* מסייעים - כרטיס חצי רוחב */}
                <View className="flex-1 bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl items-end">
                    <View className="bg-zinc-800 p-2 rounded-xl mb-3">
                        <IconSecondaryMuscle size={20} color="#D7FF00" />
                    </View>
                    <Text className="text-zinc-500 text-[10px] font-bold uppercase mb-1">מסייעים</Text>
                    <Text className="text-white text-sm font-bold text-right" numberOfLines={1}>
                        {exercise?.secondaryMuscles_he.join(', ')}
                    </Text>
                </View>

            </View>
        </View>
    );
};

export default Information;
