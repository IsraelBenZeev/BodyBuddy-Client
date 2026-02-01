import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import GraphData from './GraphData';
interface CardExerciseProgressProps {
  exercise: any;
}
interface TitleProps {
  exerciseDetails: any;
}
interface CardEmptyExerciseProps {
  exerciseDetails: any;
}
const Title = ({ exerciseDetails }: TitleProps) => {
  return (
    <View className="flex-row justify-between items-center w-full">
      <View className="flex-1 mr-4">
        <Text
          className="text-white font-bold text-lg text-right"
          numberOfLines={1} //</View></View>/ מגביל לשורה אחת
          ellipsizeMode="tail" // מוסיף את ה-3 נקודות בסוף (...)
        >
          {exerciseDetails?.name_he}
        </Text>
      </View>
      <View className="shrink-0 h-12 w-12 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden">
        <Image
          source={exerciseDetails?.gifUrl}
          style={{ width: 48, height: 48 }}
          contentFit="cover"
          cachePolicy={'disk'}
          transition={200}
        />
      </View>
    </View>
  );
};
const CardExerciseProgress = ({ exercise }: CardExerciseProgressProps) => {
  return (
    <View className="py-2">
      <GraphData logs={exercise.allLogs} />
      <View className="bg-zinc-800/50 rounded-2xl p-4 flex-row flex-wrap justify-between mt-4">
        <StatItem label="משקל שיא" value={`${exercise.maxWeight} ק"ג`} />
        <StatItem label="חזרות שיא" value={exercise.maxReps.toString()} />
        <StatItem label="שיא סטים לאימון" value={exercise.maxSetsRecord.toString()} />
        <StatItem label="סהכ עבודה" value={`${exercise.allLogs.length} סטים בוצעו`} />
      </View>
    </View>
  );
};
const CardEmptyExercise = ({ exerciseDetails }: CardEmptyExerciseProps) => {
  return (
    <View
      key={exerciseDetails?.id}
      className="mb-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 shadow-lg"
    >
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-1 mr-4">
          <Text
            className="text-white font-bold text-lg text-right"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {exerciseDetails?.name_he}
          </Text>
        </View>
        {exerciseDetails?.gifUrl && (
          <View className="shrink-0 h-12 w-12 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden">
            <Image
              source={exerciseDetails.gifUrl}
              style={{ width: 48, height: 48 }}
              contentFit="cover"
              cachePolicy={'disk'}
              transition={200}
            />
          </View>
        )}
      </View>
      <View className="bg-zinc-700/30 border border-zinc-600/40 rounded-xl px-4 py-4 flex-row items-center justify-center">
        <Text className="text-zinc-400 text-sm text-center">
          על תרגיל זה טרם בוצעו חזרות — אין נתונים להצגה
        </Text>
      </View>
    </View>
  );
};
const StatItem = ({ label, value }: { label: string; value: string }) => (
  <View className="w-[48%] mb-4 items-end">
    <Text className="text-zinc-500 text-xs mb-1">{label}</Text>
    <Text className="text-white font-bold text-base">{value}</Text>
  </View>
);
export { CardEmptyExercise, CardExerciseProgress, StatItem, Title };
