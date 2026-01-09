import { colors } from '@/colors';
import { ActivityIndicator, View } from 'react-native';
interface LoadingProps {
    size?: 'small' | 'large';
    color?: string;
}
const Loading = ({ size = 'large', color = colors.lime[500] }: LoadingProps) => (
  <View className="flex-1 justify-center items-center">
    <ActivityIndicator size={size} color={color} />
  </View>
);
export default Loading;
