import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type IconCaptionButtonSize = 'sm' | 'md' | 'lg';
type IconCaptionButtonVariant = 'outline' | 'secondary' | 'primary';

interface IconCaptionButtonProps {
  onPress: () => void;
  iconName: IoniconName;
  caption: string;
  size?: IconCaptionButtonSize;
  variant?: IconCaptionButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

const SIZE_CONFIG: Record<IconCaptionButtonSize, { iconSize: number }> = {
  sm: { iconSize: 44 },
  md: { iconSize: 52 },
  lg: { iconSize: 58 },
};

const VARIANT_CONFIG: Record<
  IconCaptionButtonVariant,
  { iconColor: string; textClass: string; activityColor: string }
> = {
  outline: {
    iconColor: '#84cc16',
    textClass: 'typo-caption text-lime-400',
    activityColor: '#84cc16',
  },
  secondary: {
    iconColor: '#ffffff',
    textClass: 'typo-caption text-background-300',
    activityColor: '#ffffff',
  },
  primary: {
    iconColor: '#bef264',
    textClass: 'typo-caption-bold text-lime-300',
    activityColor: '#bef264',
  },
};

const DISABLED_CONFIG = {
  iconColor: '#71717a',
  textClass: 'typo-caption text-background-500',
  activityColor: '#71717a',
};

export default function IconCaptionButton({
  onPress,
  iconName,
  caption,
  size = 'md',
  variant = 'outline',
  disabled = false,
  loading = false,
  accessibilityLabel,
  accessibilityHint,
}: IconCaptionButtonProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const isDisabled = disabled || loading;
  const variantConfig = disabled ? DISABLED_CONFIG : VARIANT_CONFIG[variant];

  return (
    <View className="items-center">
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        hitSlop={10}
        style={{ minWidth: 44, minHeight: 44 }}
        className={`items-center justify-center active:scale-95 active:opacity-70${loading ? ' opacity-70' : ''}`}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variantConfig.activityColor} />
        ) : (
          <Ionicons name={iconName} size={sizeConfig.iconSize} color={variantConfig.iconColor} />
        )}
      </Pressable>
      <Text className={`${variantConfig.textClass} mt-1`}>{caption}</Text>
    </View>
  );
}
