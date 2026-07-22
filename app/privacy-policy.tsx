import { usePrivacyPolicy } from '@/src/hooks/usePrivacyPolicy';
import PrivacyPolicyCard from '@/src/ui/PrivacyPolicyCard';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function PrivacyPolicyScreen() {
  const { data, isLoading, isError } = usePrivacyPolicy();

  return (
    <View className="flex-1 items-center justify-center bg-black/60 px-6">
      <PrivacyPolicyCard
        title="מדיניות פרטיות"
        onClose={() => router.back()}
        data={data}
        isLoading={isLoading}
        isError={isError}
      />
    </View>
  );
}
