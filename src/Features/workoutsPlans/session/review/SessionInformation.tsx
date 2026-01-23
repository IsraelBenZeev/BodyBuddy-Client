import { useSessionExerciseLogs } from "@/src/hooks/useSession";
import { ExerciseLogDBType } from "@/src/types/session";
import Loading from "@/src/ui/Loading";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { colors } from "@/colors";

interface Props {
  sessionId: string;
}

// הגדרת המבנה של תרגיל מקובץ
interface GroupedExercise {
  exercise_id: string;
  sets: ExerciseLogDBType[];
}

const SessionInformation = ({ sessionId }: Props) => {
  const { data: exerciseLogsData, isLoading: isLoadingExerciseLogs } = useSessionExerciseLogs(sessionId);

  // פונקציית העזר לקיבוץ - עטופה ב-useMemo לביצועים
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

  if (!exerciseLogsData || exerciseLogsData.length === 0) {
    return (
      <View className="mt-10 items-center">
        <Text className="text-gray-500">לא נמצאו נתונים לאימון זה</Text>
      </View>
    );
  }

  return (
    <View className="mt-4 pb-10 px-2">
      <Text className="text-white text-xl font-bold mb-6 text-right">סיכום אימון</Text>

      {groupedExercises.map((group) => (
        <View key={group.exercise_id} className="mb-6 bg-background-850 rounded-2xl border border-gray-800 overflow-hidden">
          {/* כותרת התרגיל - כרגע לפי ID, מומלץ להוסיף JOIN לשם התרגיל */}
          <View className="bg-background-800 px-4 py-3 border-b border-gray-800">
            <Text className="text-lime-500 font-bold text-right text-lg">
               תרגיל: {group.exercise_id}
            </Text>
          </View>

          {/* כותרות הטבלה */}
          <View className="flex-row justify-between px-4 py-2 bg-background-900/50">
            <Text className="text-gray-500 w-1/3 text-center text-xs font-bold">חזרות</Text>
            <Text className="text-gray-500 w-1/3 text-center text-xs font-bold">משקל</Text>
            <Text className="text-gray-500 w-1/3 text-center text-xs font-bold">סט</Text>
          </View>

          {/* רשימת הסטים */}
          <View className="px-2 pb-2">
            {group.sets.map((set, index) => (
              <View 
                key={set.id} 
                className={`flex-row justify-between py-3 ${index !== group.sets.length - 1 ? 'border-b border-gray-800/50' : ''}`}
              >
                <Text className="text-white w-1/3 text-center font-black text-base">{set.reps}</Text>
                <Text className="text-white w-1/3 text-center font-black text-base">{set.weight}kg</Text>
                <Text className="text-gray-400 w-1/3 text-center text-sm">{set.set_number}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default SessionInformation;