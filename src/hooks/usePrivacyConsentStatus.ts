import { hasUserConsented } from '@/src/service/consentService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { usePrivacyPolicy } from './usePrivacyPolicy';

export const usePrivacyConsentStatus = () => {
  const user = useAuthStore((state) => state.user);
  const { data: policy, isLoading: isPolicyLoading } = usePrivacyPolicy(!!user?.id);

  const { data: consented, isLoading: isConsentLoading } = useQuery({
    queryKey: ['privacyConsent', user?.id, policy?.version],
    queryFn: () => hasUserConsented(user!.id, policy!.version),
    enabled: !!user?.id && !!policy?.version,
  });

  const needsConsent = !!user?.id && !!policy?.version && consented === false;

  return {
    needsConsent,
    isLoading: isPolicyLoading || isConsentLoading,
    policy,
  };
};
