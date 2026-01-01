import { colors } from '@/colors';
import { ActivityIndicator, View } from 'react-native';

const Loading = () => (
  <View className="flex-1 justify-center items-center">
    <ActivityIndicator size="large" color={colors.lime[500]} />
  </View>
);
export default Loading;
