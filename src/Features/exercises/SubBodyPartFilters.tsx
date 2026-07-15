import AppButton from '@/src/ui/PressableOpacity';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';

export interface FilterChipItem {
  key: string;
  label: string;
}

interface SubBodyPartFiltersProps {
  items: FilterChipItem[];
  selected: string | 'all';
  onSelect: (key: string | 'all') => void;
  onBack?: () => void;
  breadcrumb?: string;
}

const SubBodyPartFilters = ({ items, selected, onSelect, onBack, breadcrumb }: SubBodyPartFiltersProps) => {
  const handleSelectAll = useCallback(() => onSelect('all'), [onSelect]);
  const handleSelect = useCallback((key: string) => onSelect(key), [onSelect]);

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
            selected === 'all' ? 'bg-lime-500/20 border-lime-500' : 'bg-transparent border-zinc-700'
          }`}
          accessibilityLabel="הצג הכל"
          accessibilityState={{ selected: selected === 'all' }}
        >
          <Text className={`typo-label ${selected === 'all' ? 'text-lime-400' : 'text-zinc-400'}`}>
            הכל
          </Text>
        </AppButton>

        {items.map((item) => (
          <AppButton
            key={item.key}
            animationType="opacity"
            haptic="medium"
            onPress={() => handleSelect(item.key)}
            className={`px-4 py-1.5 rounded-full border ${
              selected === item.key
                ? 'bg-lime-500/20 border-lime-500'
                : 'bg-transparent border-zinc-700'
            }`}
            accessibilityLabel={item.label}
            accessibilityState={{ selected: selected === item.key }}
          >
            <Text className={`typo-label ${selected === item.key ? 'text-lime-400' : 'text-zinc-400'}`}>
              {item.label}
            </Text>
          </AppButton>
        ))}
      </ScrollView>
    </View>
  );
};

export default SubBodyPartFilters;
