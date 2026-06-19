import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'outline' | 'secondary' | 'primary';

interface ActionButtonProps {
  onPress: () => void;
  label: string;
  iconName?: IoniconName;
  children?: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const SIZE_CONFIG: Record<ButtonSize, { button: string; icon: string; iconSize: number }> = {
  sm: { button: 'py-2 px-4 gap-2', icon: 'w-9 h-9', iconSize: 18 },
  md: { button: 'py-3 px-6 gap-3', icon: 'w-12 h-12', iconSize: 26 },
  lg: { button: 'py-4 px-6 gap-3', icon: 'w-14 h-14', iconSize: 28 },
};

const VARIANT_CONFIG: Record<
  ButtonVariant,
  {
    button: string;
    iconWrapper: string;
    textClass: string;
    iconColor: string;
    activityColor: string;
  }
> = {
  outline: {
    button: 'bg-gradient-to-r from-lime-500/15 to-lime-500/5 border border-lime-500/40 rounded-full',
    iconWrapper: 'bg-lime-500/25 border border-lime-500/50 rounded-full',
    textClass: 'typo-btn-cta text-lime-400',
    iconColor: '#84cc16',
    activityColor: '#84cc16',
  },
  secondary: {
    button: 'bg-gradient-to-r from-white/10 to-white/5 border border-white/60 rounded-full',
    iconWrapper: 'bg-white/15 border border-white/20 rounded-full',
    textClass: 'typo-btn-cta text-white',
    iconColor: '#ffffff',
    activityColor: '#ffffff',
  },
  primary: {
    button: 'bg-background-700 border border-lime-500 rounded-full',
    iconWrapper: 'bg-lime-500/55 border border-lime-500 rounded-full',
    textClass: 'typo-btn-cta text-lime-300',
    iconColor: '#bef264',
    activityColor: '#bef264',
  },
};

export default function ActionButton({
  onPress,
  label,
  iconName,
  children,
  size = 'md',
  variant = 'outline',
  fullWidth = false,
  disabled = false,
  loading = false,
  accessibilityLabel,
  accessibilityHint,
}: ActionButtonProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const variantConfig = VARIANT_CONFIG[variant];
  const isDisabled = disabled || loading;
  const showIconWrapper = !!(iconName || children || loading);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed && !isDisabled ? 0.96 : 1 }],
          opacity: isDisabled ? 0.45 : pressed ? 0.9 : 1,
        },
      ]}
      className={`${variantConfig.button} flex-row items-center justify-center ${sizeConfig.button}${fullWidth ? ' w-full' : ''}`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {showIconWrapper && (
        <View
          className={`${variantConfig.iconWrapper} ${sizeConfig.icon} items-center justify-center`}
        >
          {loading ? (
            <ActivityIndicator size="small" color={variantConfig.activityColor} />
          ) : children ? (
            children
          ) : (
            <Ionicons name={iconName!} size={sizeConfig.iconSize} color={variantConfig.iconColor} />
          )}
        </View>
      )}
      <Text className={variantConfig.textClass}>{label}</Text>
    </Pressable>
  );
}
