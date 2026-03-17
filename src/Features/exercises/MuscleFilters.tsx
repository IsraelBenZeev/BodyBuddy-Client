import { targetMusclesHebrew } from '@/src/types/bodtPart';
import AppButton from '@/src/ui/PressableOpacity';
import { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';

interface MuscleFiltersProps {
  uniqueMuscles: string[];
  selectedMuscle: string | 'all';
  setSelectedMuscle: (muscle: string | 'all') => void;
}

const MuscleFilters = ({ uniqueMuscles, selectedMuscle, setSelectedMuscle }: MuscleFiltersProps) => {
  const handleSelectAll = useCallback(() => setSelectedMuscle('all'), [setSelectedMuscle]);
  const handleSelect = useCallback((muscle: string) => setSelectedMuscle(muscle), [setSelectedMuscle]);

  return (
    <View className="pb-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        <AppButton
          animationType="opacity"
          haptic="medium"
          onPress={handleSelectAll}
          className={`px-4 py-1.5 rounded-full border ${
            selectedMuscle === 'all' ? 'bg-lime-500/20 border-lime-500' : 'bg-transparent border-zinc-700'
          }`}
          accessibilityLabel="הצג הכל"
          accessibilityState={{ selected: selectedMuscle === 'all' }}
        >
          <Text className={`text-sm ${selectedMuscle === 'all' ? 'text-lime-400 font-bold' : 'text-zinc-400'}`}>
            הכל
          </Text>
        </AppButton>

        {uniqueMuscles.map((muscle) => (
          <AppButton
            animationType="opacity"
            haptic="medium"
            key={muscle}
            onPress={() => handleSelect(muscle)}
            className={`px-4 py-1.5 rounded-full border ${
              selectedMuscle === muscle
                ? 'bg-lime-500/20 border-lime-500'
                : 'bg-transparent border-zinc-700'
            }`}
            accessibilityLabel={targetMusclesHebrew[muscle] ?? muscle}
            accessibilityState={{ selected: selectedMuscle === muscle }}
          >
            <Text className={`text-sm ${selectedMuscle === muscle ? 'text-lime-400 font-bold' : 'text-zinc-400'}`}>
              {targetMusclesHebrew[muscle] ?? muscle}
            </Text>
          </AppButton>
        ))}
      </ScrollView>
    </View>
  );
};

export default MuscleFilters;
