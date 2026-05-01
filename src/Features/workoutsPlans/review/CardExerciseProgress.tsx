import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';
import DumbbellAnimation from '@/src/ui/Animations/DumbbellAnimation';
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
const Title = React.memo(({ exerciseDetails }: TitleProps) => {
  return (
    <View className="flex-row justify-between items-center w-full">
      <View className="flex-1 mr-4">
        <Text
          className="typo-h4 text-white "
          numberOfLines={1} //</View></View>/ מגביל לשורה אחת
          ellipsizeMode="tail" // מוסיף את ה-3 נקודות בסוף (...)
        >
          {exerciseDetails?.name_he}
        </Text>
      </View>
      <View className="shrink-0 h-12 w-12 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden">
        {exerciseDetails?.gif_available === false ? (
          <DumbbellAnimation size={48} />
        ) : (
          <Image
            source={exerciseDetails?.gifUrl}
            style={{ width: 48, height: 48 }}
            contentFit="cover"
            cachePolicy={'disk'}
            transition={200}
          />
        )}
      </View>
    </View>
  );
});
const CardExerciseProgress = React.memo(({ exercise }: CardExerciseProgressProps) => {
  return (
    <View className="py-2 ">
      <GraphData logs={exercise.allLogs} />
      <View className="bg-zinc-800/50 rounded-2xl p-4 flex-row flex-wrap justify-between mt-4">
        <StatItem label="משקל שיא" value={`${exercise.maxWeight} ק"ג`} />
        <StatItem label="חזרות שיא" value={exercise.maxReps.toString()} />
        <StatItem label="שיא סטים לאימון" value={exercise.maxSetsRecord.toString()} />
        <StatItem label="סהכ עבודה" value={`${exercise.allLogs.length} סטים בוצעו`} />
      </View>
    </View>
  );
});
const CardEmptyExercise = React.memo(({ exerciseDetails }: CardEmptyExerciseProps) => {
  return (
    <View
      key={exerciseDetails?.id}
      className="mb-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 shadow-lg"
    >
      <View className="flex-row justify-between items-center mb-4 gap-3">
        {(exerciseDetails?.gifUrl || exerciseDetails?.gif_available === false) && (
          <View className="shrink-0 h-12 w-12 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden">
            {exerciseDetails?.gif_available === false ? (
              <DumbbellAnimation size={48} />
            ) : (
              <Image
                source={exerciseDetails.gifUrl}
                style={{ width: 48, height: 48 }}
                contentFit="cover"
                cachePolicy={'disk'}
                transition={200}
              />
            )}
          </View>
        )}
        <View className="flex-1 mr-4">
          <Text className="typo-h4 text-white" numberOfLines={1} ellipsizeMode="tail">
            {exerciseDetails?.name_he}
          </Text>
        </View>
      </View>

      <View className="bg-zinc-700/30 border border-zinc-600/40 rounded-xl px-4 py-4 flex-row items-center justify-center">
        <Text className="typo-label text-zinc-400 text-center ">
          על תרגיל זה טרם בוצעו חזרות — אין נתונים להצגה
        </Text>
      </View>
    </View>
  );
});
const StatItem = React.memo(({ label, value }: { label: string; value: string }) => (
  <View className="w-[48%] mb-4">
    <Text className="typo-caption text-zinc-500 mb-1">{label}</Text>
    <Text className="typo-body-primary text-white">{value}</Text>
  </View>
));
export { CardEmptyExercise, CardExerciseProgress, StatItem, Title };
