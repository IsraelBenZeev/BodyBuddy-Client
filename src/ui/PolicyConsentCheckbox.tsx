import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface PolicyConsentCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  promptText: string;
}

export default function PolicyConsentCheckbox({
  checked,
  onToggle,
  promptText,
}: PolicyConsentCheckboxProps) {
  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center gap-3 px-2 mb-4"
      accessibilityRole="checkbox"
      accessibilityLabel={`${promptText}הינך מסכים למדיניות הפרטיות שלנו`}
      accessibilityHint="לחץ כדי לאשר את מדיניות הפרטיות"
      accessibilityState={{ checked }}
      hitSlop={8}
    >
      <View
        className={`w-6 h-6 rounded-full border items-center justify-center ${
          checked ? 'bg-lime-500 border-lime-500' : 'border-background-400'
        }`}
        importantForAccessibility="no"
      >
        {checked && <Text className="text-black typo-caption-bold">✓</Text>}
      </View>
      <Text className="typo-label text-background-400 flex-1 text-left">
        {`${promptText}הינך מסכים ל`}
        <Text
          onPress={() => router.push('/privacy-policy')}
          accessibilityRole="link"
          accessibilityLabel="פתח מדיניות פרטיות"
          className="typo-label text-lime-400 font-semibold"
        >
          {'מדיניות הפרטיות'}
        </Text>
        {' שלנו'}
      </Text>
    </Pressable>
  );
}
