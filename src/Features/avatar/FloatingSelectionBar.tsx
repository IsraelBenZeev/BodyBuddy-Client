import { BodyPart, partsBodyHebrew } from '@/src/types/bodtPart';
import AppButton from '@/src/ui/PressableOpacity';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 60;

interface FloatingSelectionBarProps {
  selectedParts: BodyPart[];
  onDeselectPart: (part: BodyPart) => void;
  onClearAll: () => void;
  onNavigate: () => void;
}

const FloatingSelectionBar = ({ selectedParts, onDeselectPart, onClearAll, onNavigate }: FloatingSelectionBarProps) => {
  const { bottom: bottomInset } = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      className="absolute left-4 right-4"
      style={{ bottom: TAB_BAR_HEIGHT + bottomInset + 12, zIndex: 50 }}
      pointerEvents="box-none"
    >
      {/* כרטיס עם lime neon border glow */}
      <View
        style={{
          backgroundColor: 'rgba(9, 9, 11, 0.98)',
          borderRadius: 22,
          borderWidth: 1.5,
          borderColor: 'rgba(132, 204, 22, 0.35)',
          shadowColor: '#84cc16',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.22,
          shadowRadius: 22,
          elevation: 18,
          padding: 14,
          gap: 10,
        }}
      >
        {/* שורת כותרת + נקה */}
        <View className="flex-row-reverse items-center justify-between">
          <Text className="text-xs font-bold text-zinc-500 tracking-wide">
            {selectedParts.length} אזורים נבחרו
          </Text>
          <AppButton animationType="scale" haptic="light" onPress={onClearAll} accessibilityLabel="נקה את כל הבחירות">
            <Text className="text-xs font-bold text-red-400">נקה הכל</Text>
          </AppButton>
        </View>

        {/* chips בסגנון lime */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, flexDirection: 'row-reverse' }}
        >
          {selectedParts.map((part) => (
            <View
              key={part}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(132, 204, 22, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(132, 204, 22, 0.3)',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 5,
                gap: 5,
              }}
            >
              <Text className="text-xs font-bold text-lime-200">
                {partsBodyHebrew[part]}
              </Text>
              <AppButton animationType="scale" haptic="light" onPress={() => onDeselectPart(part)} accessibilityLabel={`הסר ${partsBodyHebrew[part]}`}>
                <Ionicons name="close-circle" size={14} color="rgba(132, 204, 22, 0.45)" />
              </AppButton>
            </View>
          ))}
        </ScrollView>

        {/* CTA Button עם gradient */}
        <AppButton animationType="scale" haptic="success" onPress={onNavigate} className="w-full" accessibilityLabel="צפה בתרגילים לאזורים הנבחרים">
          <LinearGradient
            colors={['#a3e635', '#84cc16']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 54,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              shadowColor: '#84cc16',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 14,
            }}
          >
            <Text className="text-base font-black text-zinc-950">
              צפה בתרגילים
            </Text>
          </LinearGradient>
        </AppButton>
      </View>
    </Animated.View>
  );
};

export default FloatingSelectionBar;
