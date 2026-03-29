import { useGetExerciseHistory } from '@/src/hooks/useSession';
import { useAuthStore } from '@/src/store/useAuthStore';
import Loading from '@/src/ui/Loading';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import GraphData from '../workoutsPlans/review/GraphData';

interface Props {
  exerciseId: string;
}

interface PRCardProps {
  label: string;
  value: number;
  unit: string;
}

const PRCard = ({ label, value, unit }: PRCardProps) => (
  <View className="flex-1 bg-zinc-800/60 border border-zinc-700/50 rounded-2xl p-4 items-center">
    <Text className="typo-caption text-zinc-400 mb-1">{label}</Text>
    <Text className="typo-h2 text-lime-500">{value}</Text>
    <Text className="typo-caption text-zinc-500">{unit}</Text>
  </View>
);

const ExerciseHistory = ({ exerciseId }: Props) => {
  const user = useAuthStore((state) => state.user);
  const { data: logs, isPending } = useGetExerciseHistory(user?.id ?? '', exerciseId);

  const pr = useMemo(() => {
    if (!logs || logs.length === 0) return null;

    let maxWeight = 0;
    let maxReps = 0;
    const setsPerSession: Record<string, number> = {};

    logs.forEach((log) => {
      if (log.weight > maxWeight) maxWeight = log.weight;
      if (log.reps > maxReps) maxReps = log.reps;
      setsPerSession[log.session_id] = (setsPerSession[log.session_id] || 0) + 1;
    });

    const maxSets = Math.max(...Object.values(setsPerSession));
    return { maxWeight, maxReps, maxSets };
  }, [logs]);

  if (isPending) return <Loading />;

  if (!logs || logs.length === 0) {
    return (
      <View className="p-6 items-center justify-center" style={{ minHeight: 200 }}>
        <Text className="typo-body text-zinc-500 text-center">
          לא בוצע תרגיל זה עדיין.{'\n'}התחל לאמן ותראה את ההתקדמות כאן!
        </Text>
      </View>
    );
  }

  return (
    <View className="px-4 pt-4 pb-8">
      {/* כרטיסי PR */}
      <Text className="typo-body-primary text-white text-right mb-3">שיאים אישיים</Text>
      <View className="flex-row gap-3 mb-6">
        <PRCard label="משקל מקס'" value={pr!.maxWeight} unit="ק״ג" />
        <PRCard label="חזרות מקס'" value={pr!.maxReps} unit="חזרות" />
        <PRCard label="סטים מקס'" value={pr!.maxSets} unit="סטים" />
      </View>

      {/* גרף התקדמות */}
      <Text className="typo-body-primary text-white text-right mb-3">התקדמות לאורך זמן</Text>
      <GraphData logs={logs} />
    </View>
  );
};

export default ExerciseHistory;
