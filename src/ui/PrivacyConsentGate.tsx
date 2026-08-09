import { useLegalConsentStatus } from '@/src/hooks/useLegalConsentStatus';
import { recordConsent, type LegalPolicyType } from '@/src/service/consentService';
import { useAuthStore } from '@/src/store/useAuthStore';
import ActionButton from '@/src/ui/ActionButton';
import PrivacyPolicyCard from '@/src/ui/PrivacyPolicyCard';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const COPY: Record<
  LegalPolicyType,
  {
    tabLabel: string;
    firstVersionTitle: string;
    updatedTitle: string;
    firstVersionPrompt: string;
    updatedPrompt: string;
    confirmA11yLabel: string;
  }
> = {
  privacy_policy: {
    tabLabel: 'מדיניות פרטיות',
    firstVersionTitle: 'מדיניות הפרטיות שלנו',
    updatedTitle: 'עדכנו את מדיניות הפרטיות',
    firstVersionPrompt: 'נא אשר שקראת והבנת את מדיניות הפרטיות שלנו',
    updatedPrompt: 'נא אשר שקראת, הבנת ומסכים למדיניות הפרטיות המעודכנת',
    confirmA11yLabel: 'קראתי ואני מאשר את מדיניות הפרטיות',
  },
  terms_of_service: {
    tabLabel: 'תנאי שימוש',
    firstVersionTitle: 'תנאי השימוש שלנו',
    updatedTitle: 'עדכנו את תנאי השימוש',
    firstVersionPrompt: 'נא אשר שקראת והבנת את תנאי השימוש שלנו',
    updatedPrompt: 'נא אשר שקראת, הבנת ומסכים לתנאי השימוש המעודכנים',
    confirmA11yLabel: 'קראתי ואני מאשר את תנאי השימוש',
  },
};

export default function PrivacyConsentGate() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const {
    isLoading,
    needsPrivacyConsent,
    needsTermsConsent,
    needsConsent,
    privacyPolicy,
    termsOfService,
  } = useLegalConsentStatus();

  const [activeTab, setActiveTab] = useState<LegalPolicyType>('privacy_policy');
  const [confirming, setConfirming] = useState(false);

  // תמיד לפתוח ישירות בטאב שבאמת דורש אישור (למשל אם עודכנו רק תנאי השימוש)
  useEffect(() => {
    if (needsTermsConsent && !needsPrivacyConsent) {
      setActiveTab('terms_of_service');
    } else if (needsPrivacyConsent && !needsTermsConsent) {
      setActiveTab('privacy_policy');
    }
  }, [needsPrivacyConsent, needsTermsConsent]);

  if (isLoading || !needsConsent || !user) return null;

  const activePolicy = activeTab === 'privacy_policy' ? privacyPolicy : termsOfService;
  const activeNeedsConsent = activeTab === 'privacy_policy' ? needsPrivacyConsent : needsTermsConsent;
  const showTabs = needsPrivacyConsent && needsTermsConsent;

  if (!activePolicy) return null;

  const copy = COPY[activeTab];
  const isFirstVersion = parseFloat(activePolicy.version) <= 1;

  const handleConfirm = async () => {
    setConfirming(true);
    await recordConsent(user.id, activeTab, activePolicy.version);
    await queryClient.invalidateQueries({
      queryKey: ['legalConsent', user.id, activeTab, activePolicy.version],
    });
    setConfirming(false);
    // אם עוד מסמך דורש אישור, לעבור אליו אוטומטית
    if (activeTab === 'privacy_policy' && needsTermsConsent) {
      setActiveTab('terms_of_service');
    } else if (activeTab === 'terms_of_service' && needsPrivacyConsent) {
      setActiveTab('privacy_policy');
    }
  };

  return (
    <Animated.View
      entering={FadeIn}
      className="absolute inset-0 z-[10000] items-center justify-center bg-black/70 px-6"
      accessible
      accessibilityViewIsModal
      accessibilityLabel="נדרש אישור מדיניות הפרטיות ותנאי השימוש להמשך שימוש באפליקציה"
    >
      <View className="w-full gap-3">
        {showTabs && (
          <View
            className="flex-row self-center rounded-full border border-white/10 overflow-hidden bg-white/5"
            accessibilityRole="tablist"
          >
            {(Object.keys(COPY) as LegalPolicyType[]).map((type) => (
              <Pressable
                key={type}
                onPress={() => setActiveTab(type)}
                className={`px-4 py-2 ${activeTab === type ? 'bg-lime-500/20' : ''}`}
                accessibilityRole="tab"
                accessibilityLabel={COPY[type].tabLabel}
                accessibilityState={{ selected: activeTab === type }}
              >
                <Text
                  className={`typo-caption-bold ${activeTab === type ? 'text-lime-300' : 'text-background-400'}`}
                >
                  {COPY[type].tabLabel}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <PrivacyPolicyCard
          title={isFirstVersion ? copy.firstVersionTitle : copy.updatedTitle}
          data={activePolicy}
          isLoading={false}
          isError={false}
          footer={
            activeNeedsConsent ? (
              <View className="gap-3">
                <Text className="typo-label text-background-400 text-center">
                  {isFirstVersion ? copy.firstVersionPrompt : copy.updatedPrompt}
                </Text>
                <ActionButton
                  onPress={handleConfirm}
                  label="קראתי ואני מאשר/ת"
                  iconName="checkmark-circle-outline"
                  variant="primary"
                  size="sm"
                  fullWidth
                  loading={confirming}
                  accessibilityLabel={copy.confirmA11yLabel}
                  accessibilityHint="לחץ כדי לאשר ולהמשיך לאפליקציה"
                />
              </View>
            ) : undefined
          }
        />
      </View>
    </Animated.View>
  );
}
