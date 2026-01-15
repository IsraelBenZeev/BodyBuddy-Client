import { Exercise } from "@/src/types/exercise";
import { IconSecondaryMuscle, IconsFitnessTools, IconTargetMuscle } from "@/src/ui/IconsSVG";
import { Text, View } from "react-native";
interface InformationProps {
    exercise: Exercise;
}
const Information = ({ exercise }: InformationProps) => {
    return (
        <View className="px-5 w-full space-y-3 mt-4 gap-3">
            {/* כרטיס שריר עיקרי */}
            <View className="flex-row-reverse items-center bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl">
                <View className="bg-[#D7FF00] w-12 h-12 rounded-2xl items-center justify-center shadow-lg shadow-lime-500/20">
                    <IconTargetMuscle size={24} color="black" />
                </View>
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
