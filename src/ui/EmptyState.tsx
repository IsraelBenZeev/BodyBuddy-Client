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
    <View className="flex-1 items-center justify-center px-10">
      <View className="bg-background-800 p-8 rounded-full mb-6 opacity-80">
        {icon}
      </View>
      <Text className="text-white text-xl font-semibold text-center mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-gray-400 text-center mb-8">
          {description}
        </Text>
      )}
      {action && (
        <AppButton
          haptic="medium"
          animationType="opacity"
          onPress={action.onPress}
          className="bg-lime-500 flex-row items-center px-8 py-4 rounded-2xl"
          accessibilityLabel={action.label}
        >
          <Text className="text-background-900 font-bold text-lg">
            {action.label}
          </Text>
          {action.icon && <View className="ml-2">{action.icon}</View>}
        </AppButton>
      )}
    </View>
  );
};

export default EmptyState;
