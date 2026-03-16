import { Text, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

const ScreenHeader = ({ title, subtitle }: ScreenHeaderProps) => {
  return (
    <View className="mb-6">
      <Text className="text-white text-3xl font-black text-right mb-1">{title}</Text>
      {subtitle && (
        <Text className="text-gray-400 text-sm text-right font-medium">{subtitle}</Text>
      )}
    </View>
  );
};

export default ScreenHeader;
