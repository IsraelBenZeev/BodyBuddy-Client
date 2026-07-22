import { colors } from '@/colors';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '@/src/ui/PressableOpacity';

interface BackButtonProps {
  onPress: () => void;
  size?: number;
  iconSize?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const BackButton = ({
  onPress,
  size = 60,
  iconSize,
  accessibilityLabel = 'חזור',
  accessibilityHint = 'חזרה למסך הקודם',
}: BackButtonProps) => {
  const resolvedIconSize = iconSize ?? Math.round(size * 0.66);

  return (
    <AppButton
      onPress={onPress}
      haptic="light"
      animationType="scale"
      className="items-center justify-center bg-lime-500/15 border border-lime-500/40 rounded-full p-1"
      style={{ width: size, height: size }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
    >
      <Ionicons name="chevron-forward" size={resolvedIconSize} color={colors.lime[300]} />
    </AppButton>
  );
};

export default BackButton;
