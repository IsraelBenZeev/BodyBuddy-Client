import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import AppButton from './PressableOpacity';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
    icon?: ReactNode;
  };
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <View className="flex-1 items-center justify-center px-8">
      {/* Icon with layered glow rings */}
      <View className="items-center justify-center mb-8" style={{ width: 160, height: 160 }}>
        <View className="absolute w-40 h-40 bg-lime-500/5 rounded-full" />
        <View className="absolute w-32 h-32 bg-lime-500/8 rounded-full" />
        <View className="bg-background-800 border border-white/8 p-8 rounded-full">
          {icon}
        </View>
      </View>

      <Text className="typo-h2 text-white text-center mb-3">
        {title}
      </Text>

      {description && (
        <Text className="typo-body-small text-gray-400 text-center mb-10 leading-5">
          {description}
        </Text>
      )}

      {action && (
        <AppButton
          haptic="medium"
          animationType="opacity"
          onPress={action.onPress}
          className="bg-lime-500 flex-col items-center px-10 py-4 rounded-2xl"
          accessibilityLabel={action.label}
        >
          {action.icon && <View className="mb-2">{action.icon}</View>}
          <Text className="typo-btn-cta text-background-900 text-center">
            {action.label}
          </Text>
        </AppButton>
      )}
    </View>
  );
};

export default EmptyState;
