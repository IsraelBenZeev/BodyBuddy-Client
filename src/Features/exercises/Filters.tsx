import { BodyPart, partsBodyHebrew } from '@/src/types/bodtPart';
import { modeListExercises } from '@/src/types/mode';
import AppButton from '@/src/ui/PressableOpacity';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
interface FiltersProps {
  uniqueBodyParts: BodyPart[];
  selectedFilter: string | 'all';
  setSelectedFilter: (filter: string | 'all') => void;
  mode: modeListExercises
}
const Filters = ({ uniqueBodyParts, selectedFilter, setSelectedFilter, mode }: FiltersProps) => {
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
          onPress={() => setSelectedFilter('all')}
          className={`px-5 py-2 rounded-full border ${selectedFilter === 'all' ? 'bg-white border-white' : 'bg-transparent border-gray-500'
          }`}
          >
          <Text className={selectedFilter === 'all' ? 'text-black font-bold' : 'text-white'}>
            הכל
          </Text>
        </AppButton>

        {uniqueBodyParts.map((part: BodyPart) => (
          <AppButton
          animationType='opacity'
          haptic='medium'
          key={part}
          onPress={() => setSelectedFilter(part)}
          className={`px-5 py-2 rounded-full border ${selectedFilter === part
            ? 'bg-lime-500 border-lime-500'
            : 'bg-background-1000 border-background-100'
          }`}
          >
            <Text className="text-white font-medium">{partsBodyHebrew[part] || part}</Text>
          </AppButton>
        ))}
        {mode === 'view' && (
          <AppButton
          animationType='opacity'
          haptic='medium'
            className="bg-zinc-700 w-10 h-10 rounded-full items-center justify-center border border-zinc-600"
            onPress={() => router.back()}
          >
            <Text className="text-white text-lg">+</Text>
          </AppButton>
        )}
      </ScrollView>
    </View>
  );
};

export default Filters;
