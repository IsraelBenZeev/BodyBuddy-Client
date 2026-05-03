import { targetMusclesHebrew } from '@/src/types/bodtPart';
import AppButton from '@/src/ui/PressableOpacity';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';

interface MuscleFiltersProps {
  uniqueMuscles: string[];
  selectedMuscle: string | 'all';
  setSelectedMuscle: (muscle: string | 'all') => void;
  onBack?: () => void;
  breadcrumb?: string;
}

const MuscleFilters = ({ uniqueMuscles, selectedMuscle, setSelectedMuscle, onBack, breadcrumb }: MuscleFiltersProps) => {
  const handleSelectAll = useCallback(() => setSelectedMuscle('all'), [setSelectedMuscle]);
  const handleSelect = useCallback((muscle: string) => setSelectedMuscle(muscle), [setSelectedMuscle]);

  return (
    <View className="pb-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}
      >
        {onBack && (
          <>
            <AppButton
              animationType="opacity"
              haptic="light"
              onPress={onBack}
              className="flex-row items-center min-h-11 px-2 justify-center"
              accessibilityLabel="חזרה לאזורי גוף"
              accessibilityRole="button"
            >
              <Ionicons name="chevron-back" size={16} color="#84cc16" />
              <Text className="typo-label text-lime-400">{breadcrumb}</Text>
            </AppButton>
            <View className="w-px h-5 bg-zinc-700" />
          </>
        )}
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
          <Text className={`typo-label ${selectedMuscle === 'all' ? 'text-lime-400' : 'text-zinc-400'}`}>
            הכל
          </Text>
        </AppButton>

        {uniqueMuscles.map((muscle) => (
          <AppButton
            key={muscle}
            animationType="opacity"
            haptic="medium"
            onPress={() => handleSelect(muscle)}
            className={`px-4 py-1.5 rounded-full border ${
              selectedMuscle === muscle
                ? 'bg-lime-500/20 border-lime-500'
                : 'bg-transparent border-zinc-700'
            }`}
            accessibilityLabel={targetMusclesHebrew[muscle] ?? muscle}
            accessibilityState={{ selected: selectedMuscle === muscle }}
          >
            <Text className={`typo-label ${selectedMuscle === muscle ? 'text-lime-400' : 'text-zinc-400'}`}>
              {targetMusclesHebrew[muscle] ?? muscle}
            </Text>
          </AppButton>
        ))}
      </ScrollView>
    </View>
  );
};

export default MuscleFilters;
