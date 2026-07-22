import { colors } from '@/colors';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '@/src/ui/PressableOpacity';

type CloseButtonVariant = 'default' | 'gray';

interface CloseButtonProps {
  onPress: () => void;
  variant?: CloseButtonVariant;
  size?: number;
  iconSize?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const VARIANT_CONFIG: Record<CloseButtonVariant, { className: string; iconColor: string }> = {
  default: {
    className: 'items-center justify-center bg-lime-500/15 border border-lime-500/40 rounded-full p-1',
    iconColor: colors.lime[300],
  },
  gray: {
    className: 'items-center justify-center bg-background-800 rounded-xl border border-white/10',
    iconColor: '#fff',
  },
};

const CloseButton = ({
  onPress,
  variant = 'default',
  size = 60,
  iconSize,
  accessibilityLabel = 'סגור',
  accessibilityHint,
}: CloseButtonProps) => {
  const resolvedIconSize = iconSize ?? Math.round(size * 0.66);
  const config = VARIANT_CONFIG[variant];

  return (
    <AppButton
      onPress={onPress}
      haptic="light"
      animationType="scale"
      className={config.className}
      style={{ width: size, height: size }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
    >
      <Ionicons name="close" size={resolvedIconSize} color={config.iconColor} />
    </AppButton>
  );
};

export default CloseButton;
