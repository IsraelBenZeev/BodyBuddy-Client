import BodyBuddyLoadingIcon, { BodyBuddyLoadingVariant } from '@/src/ui/BodyBuddyLoadingIcon';
import { View } from 'react-native';

interface LoadingProps {
    size?: number;
    variant?: BodyBuddyLoadingVariant;
}

const Loading = ({ size = 64, variant = 'elasticTrail' }: LoadingProps) => (
  <View className="flex-1 justify-center items-center">
    <BodyBuddyLoadingIcon size={size} variant={variant} />
  </View>
);
export default Loading;
