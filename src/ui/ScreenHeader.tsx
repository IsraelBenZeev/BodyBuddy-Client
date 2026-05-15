import { Text, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

const ScreenHeader = ({ title, subtitle }: ScreenHeaderProps) => {
  return (
    <View className="mb-6">
      <Text className="typo-h1 text-white  mb-1">{title}</Text>
      {subtitle && (
        <Text className="typo-label text-gray-400 ">{subtitle}</Text>
      )}
    </View>
  );
};

export default ScreenHeader;
