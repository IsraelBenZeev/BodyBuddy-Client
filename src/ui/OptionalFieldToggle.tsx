import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';

interface OptionalFieldToggleProps {
  label: string;
  enabled?: boolean;
  defaultEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  children?: React.ReactNode;
}

const OptionalFieldToggle = ({
  label,
  enabled: controlledEnabled,
  defaultEnabled = false,
  onToggle,
  children,
}: OptionalFieldToggleProps) => {
  const [uncontrolledEnabled, setUncontrolledEnabled] = useState(defaultEnabled);
  const enabled = controlledEnabled ?? uncontrolledEnabled;

  const handleToggle = () => {
    const next = !enabled;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (controlledEnabled === undefined) setUncontrolledEnabled(next);
    onToggle?.(next);
  };

  return (
    <View className="flex items-center w-full gap-3 justify-end">
      <Pressable
        onPress={handleToggle}
        className="w-full items-start gap-2"
        style={{ direction: 'ltr', flexDirection: 'row-reverse', justifyContent: 'flex-start' }}
        hitSlop={8}
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityState={{ checked: enabled }}
      >
        <View
          className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${
            enabled ? 'bg-lime-300 border-lime-300' : 'border-zinc-600 bg-transparent'
          }`}
        >
          {enabled && <MaterialCommunityIcons name="check-bold" size={16} color="black" />}
        </View>
        <Text
          className={`typo-body-primary flex-shrink ${enabled ? 'text-lime-300' : 'text-zinc-400'}`}
          style={{ writingDirection: 'rtl', textAlign: 'right' }}
        >
          {label}
        </Text>
      </Pressable>

      {enabled && children && (
        <Animated.View entering={SlideInUp.duration(250)} exiting={SlideOutUp.duration(200)} className="items-center">
          {children}
        </Animated.View>
      )}
    </View>
  );
};

export default OptionalFieldToggle;
