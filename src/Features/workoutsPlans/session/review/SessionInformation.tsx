import { useGetExercisesByIds } from "@/src/hooks/useEcercises";
import { useSessionExerciseLogs } from "@/src/hooks/useSession";
import { Exercise } from "@/src/types/exercise";
import { ExerciseLogDBType } from "@/src/types/session";
import Loading from "@/src/ui/Loading";
import AppButton from "@/src/ui/PressableOpacity";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, View } from "react-native";

interface Props {
  sessionId: string;
}

interface GroupedExercise {
  exercise_id: string;
  sets: ExerciseLogDBType[];
}

const SessionInformation = ({ sessionId }: Props) => {
  const router = useRouter();
  const { data: exerciseLogsData, isLoading: isLoadingExerciseLogs } = useSessionExerciseLogs(sessionId);
  const uniqueExerciseIds = useMemo(() => {
    if (!exerciseLogsData) return [];
    return [...new Set(exerciseLogsData.map(log => log.exercise_id))];
  }, [exerciseLogsData]);
  const { data: exercisesData, isLoading: isLoadingExercises } = useGetExercisesByIds(uniqueExerciseIds);
  const groupedExercises = useMemo(() => {
    if (!exerciseLogsData) return [];

    const grouped = exerciseLogsData.reduce((acc: Record<string, GroupedExercise>, log) => {
      const exerciseId = log.exercise_id;

      if (!acc[exerciseId]) {
        acc[exerciseId] = {
          exercise_id: exerciseId,
          sets: []
        };
      }
      acc[exerciseId].sets.push(log);
      return acc;
    }, {});

    return Object.values(grouped);
  }, [exerciseLogsData]);
  
  if (isLoadingExerciseLogs) return <Loading />;

  return (
    <View className="mt-4 pb-10 px-2">
      <Text className="text-white text-xl font-bold mb-6 text-right">סיכום אימון</Text>

      {groupedExercises.map((group) => {
        const exerciseInfo = exercisesData?.find((ex: Exercise) => ex.exerciseId === group.exercise_id);
        const validSets = group.sets.filter(set => !(set.weight === 0 && set.reps === 0));
        const hasValidSets = validSets.length > 0;
        return (
          <View key={group.exercise_id} className="mb-6 bg-background-850 rounded-2xl border border-gray-800 overflow-hidden shadow-sm ">

            <AppButton
              onPress={() => router.push({
                pathname: '/exercise/[exerciseId]',
                params: { exerciseId: group.exercise_id },
              })}
              animationType="opacity"
              haptic="medium"
            >
              <View className="flex-row items-center justify-between bg-background-800 px-4 py-3 border-b border-gray-800">
                <View className="bg-white/10 rounded-lg overflow-hidden border border-gray-700">
                  {isLoadingExercises ? <Loading size="small" /> : exerciseInfo?.gifUrl ? (
                    <Image
                      source={{ uri: exerciseInfo.gifUrl }}
                      style={{ width: 48, height: 48 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={{ width: 48, height: 48 }} className="bg-gray-800" />
                  )}
                </View>
                <View className="flex-1 pr-3">
                  <Text className="text-gray-400 text-[10px] text-right font-bold uppercase tracking-widest">תרגיל</Text>
                  <Text className="text-lime-500 font-bold text-right text-lg leading-6">
                    {isLoadingExercises ? "טוען..." : exerciseInfo?.name_he}
                  </Text>
                </View>

              </View>
            </AppButton>
            {/* כותרות הטבלה */}
            {hasValidSets ? (
              <>
                <View className="flex-row justify-between px-4 py-2 bg-background-900/50">
                  <Text className="text-gray-500 w-1/3 text-center text-xs font-bold">חזרות</Text>
                  <Text className="text-gray-500 w-1/3 text-center text-xs font-bold">משקל</Text>
                  <Text className="text-gray-500 w-1/3 text-center text-xs font-bold">סט</Text>
                </View>

                {/* רשימת הסטים */}
                <View className="px-2 pb-2">
                  {group.sets.map((set, index) => {
                    // console.log("set", set);


                    return (
                      <View
                        key={set.id}
                        className={`flex-row justify-between py-3 ${index !== group.sets.length - 1 ? 'border-b border-gray-800/50' : ''}`}
                      >
                        <Text className="text-white w-1/3 text-center font-black text-base">{set.reps}</Text>
                        <Text className="text-white w-1/3 text-center font-black text-base">{set.weight}kg</Text>
                        <Text className="text-gray-400 w-1/3 text-center text-sm">{set.set_number}</Text>
                      </View>
                    )
                  })}
                </View>
              </>
            ) : (
              <View className="py-6 items-center justify-center">
                <Text className="text-gray-500 text-sm italic">לא בוצעו חזרות לתרגיל זה</Text>
              </View>
            )}
          </View>
        )
      })}
    </View >
  );
};

export default SessionInformation;