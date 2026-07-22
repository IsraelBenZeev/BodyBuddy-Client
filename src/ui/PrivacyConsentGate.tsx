import { usePrivacyConsentStatus } from '@/src/hooks/usePrivacyConsentStatus';
import { recordPrivacyConsent } from '@/src/service/consentService';
import { useAuthStore } from '@/src/store/useAuthStore';
import ActionButton from '@/src/ui/ActionButton';
import PrivacyPolicyCard from '@/src/ui/PrivacyPolicyCard';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function PrivacyConsentGate() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { needsConsent, isLoading, policy } = usePrivacyConsentStatus();
  const [confirming, setConfirming] = useState(false);

  if (isLoading || !needsConsent || !user || !policy) return null;

  const isFirstVersion = parseFloat(policy.version) <= 1;

  const handleConfirm = async () => {
    setConfirming(true);
    await recordPrivacyConsent(user.id, policy.version);
    await queryClient.invalidateQueries({ queryKey: ['privacyConsent', user.id, policy.version] });
    setConfirming(false);
  };

  return (
    <Animated.View
      entering={FadeIn}
      className="absolute inset-0 z-[10000] items-center justify-center bg-black/70 px-6"
      accessible
      accessibilityViewIsModal
      accessibilityLabel="נדרש אישור מדיניות הפרטיות להמשך שימוש באפליקציה"
    >
      <PrivacyPolicyCard
        title={isFirstVersion ? 'מדיניות הפרטיות שלנו' : 'עדכנו את מדיניות הפרטיות'}
        data={policy}
        isLoading={false}
        isError={false}
        footer={
          <View className="gap-3">
            <Text className="typo-label text-background-400 text-center">
              {isFirstVersion
                ? 'נא אשר שקראת והבנת את מדיניות הפרטיות שלנו'
                : 'נא אשר שקראת, הבנת ומסכים להמשך השימוש באפליקציה'}
            </Text>
            <ActionButton
              onPress={handleConfirm}
              label="קראתי ואני מאשר/ת"
              iconName="checkmark-circle-outline"
              variant="primary"
              size="sm"
              fullWidth
              loading={confirming}
              accessibilityLabel="קראתי ואני מאשר את מדיניות הפרטיות"
              accessibilityHint="לחץ כדי לאשר את מדיניות הפרטיות ולהמשיך לאפליקציה"
            />
          </View>
        }
      />
    </Animated.View>
  );
}
