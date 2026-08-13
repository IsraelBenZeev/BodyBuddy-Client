import { useGetExercisesByIds } from '@/src/hooks/useEcercises';
import { useGetExerciseHistory } from '@/src/hooks/useSession';
import { useAuthStore } from '@/src/store/useAuthStore';
import Loading from '@/src/ui/Loading';
import { formatFieldValue } from '@/src/utils/formatExerciseMetrics';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import GraphData from '../workoutsPlans/review/GraphData';

interface Props {
  exerciseId: string;
}

interface PRCardProps {
  label: string;
  value: string;
}

const PRCard = ({ label, value }: PRCardProps) => (
  <View className="flex-1 bg-zinc-800/60 border border-zinc-700/50 rounded-2xl p-4 items-center">
    <Text className="typo-caption text-zinc-400 mb-1">{label}</Text>
    <Text className="typo-h2 text-lime-500">{value}</Text>
  </View>
);

const ExerciseHistory = ({ exerciseId }: Props) => {
  const user = useAuthStore((state) => state.user);
  const { data: logs, isPending } = useGetExerciseHistory(user?.id ?? '', exerciseId);
  const { data: exercises } = useGetExercisesByIds([exerciseId]);
  const exercise = exercises?.[0];
  const fields = exercise?.input_fields ?? [];

  const pr = useMemo(() => {
    if (!logs || logs.length === 0) return null;

    const maxima: Record<string, number> = {};
    const setsPerSession: Record<string, number> = {};

    logs.forEach((log) => {
      Object.entries(log.values).forEach(([key, value]) => {
        if (!maxima[key] || value > maxima[key]) maxima[key] = value;
      });
      setsPerSession[log.session_id] = (setsPerSession[log.session_id] || 0) + 1;
    });

    const maxSets = Math.max(...Object.values(setsPerSession));
    return { maxima, maxSets };
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
    <View className="px-4 pt-4 pb-8 items-start">
      {/* כרטיסי PR */}
      <Text className="typo-body-primary text-white text-right mb-3">שיאים אישיים</Text>
      <View className="flex-row gap-3 mb-6">
        {fields.map((field) => (
          <PRCard key={field.key} label={`${field.label} מקס'`} value={formatFieldValue(field, pr!.maxima[field.key] ?? 0)} />
        ))}
        <PRCard label="סטים מקס'" value={pr!.maxSets.toString()} />
      </View>

      {/* גרף התקדמות */}
      <Text className="typo-body-primary text-white text-right mb-3">התקדמות לאורך זמן</Text>
      <GraphData logs={logs} fields={fields} />
    </View>
  );
};

export default ExerciseHistory;
