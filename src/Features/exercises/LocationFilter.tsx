import AppButton from '@/src/ui/PressableOpacity';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';

export type LocationFilterValue = 'all' | 'home' | 'gym';

interface LocationFilterProps {
  selected: LocationFilterValue;
  onSelect: (value: LocationFilterValue) => void;
}

const OPTIONS: { value: LocationFilterValue; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'all', label: 'הכל', icon: 'apps-outline' },
  { value: 'home', label: 'בית', icon: 'home-outline' },
  { value: 'gym', label: 'חדר כושר', icon: 'barbell-outline' },
];

const LocationFilter = ({ selected, onSelect }: LocationFilterProps) => {
  const handleSelect = useCallback((value: LocationFilterValue) => onSelect(value), [onSelect]);

  return (
    <View className="pb-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {OPTIONS.map((option) => (
          <AppButton
            key={option.value}
            animationType="opacity"
            haptic="medium"
            onPress={() => handleSelect(option.value)}
            className={`flex-row items-center gap-1.5 px-4 py-1.5 rounded-full border ${
              selected === option.value
                ? 'bg-lime-500/20 border-lime-500'
                : 'bg-transparent border-zinc-700'
            }`}
            accessibilityLabel={`סנן לפי ${option.label}`}
            accessibilityState={{ selected: selected === option.value }}
          >
            <Ionicons
              name={option.icon}
              size={14}
              color={selected === option.value ? '#a3e635' : '#a1a1aa'}
            />
            <Text className={`typo-label ${selected === option.value ? 'text-lime-400' : 'text-zinc-400'}`}>
              {option.label}
            </Text>
          </AppButton>
        ))}
      </ScrollView>
    </View>
  );
};

export default LocationFilter;
