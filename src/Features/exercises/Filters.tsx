import { BodyPart, partsBodyHebrew } from '@/src/types/bodtPart';
import { modeListExercises } from '@/src/types/mode';
import AppButton from '@/src/ui/PressableOpacity';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
interface FiltersProps {
  uniqueBodyParts: BodyPart[];
  selectedFilter: string | 'all';
  setSelectedFilter: (filter: string | 'all') => void;
  mode: modeListExercises
}
const Filters = ({ uniqueBodyParts, selectedFilter, setSelectedFilter, mode }: FiltersProps) => {
  const handleSelectAll = useCallback(() => setSelectedFilter('all'), [setSelectedFilter]);
  const handleSelectFilter = useCallback((part: string) => setSelectedFilter(part), [setSelectedFilter]);
  const handleBack = useCallback(() => router.back(), []);
  return (
    <View className="py-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        <AppButton
          animationType='opacity'
          haptic='medium'
          onPress={handleSelectAll}
          className={`px-5 py-2 rounded-full border ${selectedFilter === 'all' ? 'bg-white border-white' : 'bg-transparent border-gray-500'
          }`}
          accessibilityLabel="הצג הכל"
          accessibilityState={{ selected: selectedFilter === 'all' }}
          >
          <Text className={selectedFilter === 'all' ? 'typo-btn-cta text-black' : 'typo-body text-white'}>
            הכל
          </Text>
        </AppButton>

        {uniqueBodyParts.map((part: BodyPart) => (
          <AppButton
          animationType='opacity'
          haptic='medium'
          key={part}
          onPress={() => handleSelectFilter(part)}
          className={`px-5 py-2 rounded-full border ${selectedFilter === part
            ? 'bg-lime-500 border-lime-500'
            : 'bg-background-1000 border-background-100'
          }`}
          accessibilityLabel={partsBodyHebrew[part] || part}
          accessibilityState={{ selected: selectedFilter === part }}
          >
            <Text className="typo-body-primary text-white">{partsBodyHebrew[part] || part}</Text>
          </AppButton>
        ))}
        {mode === 'view' && (
          <AppButton
          animationType='opacity'
          haptic='medium'
            className="bg-zinc-700 w-11 h-11 rounded-full items-center justify-center border border-zinc-600"
            onPress={handleBack}
            accessibilityLabel="הוסף אזורי גוף"
          >
            <Text className="typo-h4 text-white">+</Text>
          </AppButton>
        )}
      </ScrollView>
    </View>
  );
};

export default Filters;
