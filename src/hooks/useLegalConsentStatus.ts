import { hasUserConsented } from '@/src/service/consentService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { usePrivacyPolicy } from './usePrivacyPolicy';
import { useTermsOfService } from './useTermsOfService';

export const useLegalConsentStatus = () => {
  const user = useAuthStore((state) => state.user);

  const { data: privacyPolicy, isLoading: isPrivacyPolicyLoading } = usePrivacyPolicy(!!user?.id);
  const { data: termsOfService, isLoading: isTermsLoading } = useTermsOfService(!!user?.id);

  const { data: privacyConsented, isLoading: isPrivacyConsentLoading } = useQuery({
    queryKey: ['legalConsent', user?.id, 'privacy_policy', privacyPolicy?.version],
    queryFn: () => hasUserConsented(user!.id, 'privacy_policy', privacyPolicy!.version),
    enabled: !!user?.id && !!privacyPolicy?.version,
  });

  const { data: termsConsented, isLoading: isTermsConsentLoading } = useQuery({
    queryKey: ['legalConsent', user?.id, 'terms_of_service', termsOfService?.version],
    queryFn: () => hasUserConsented(user!.id, 'terms_of_service', termsOfService!.version),
    enabled: !!user?.id && !!termsOfService?.version,
  });

  const needsPrivacyConsent =
    !!user?.id && !!privacyPolicy?.version && privacyConsented === false;
  const needsTermsConsent =
    !!user?.id && !!termsOfService?.version && termsConsented === false;

  return {
    isLoading:
      isPrivacyPolicyLoading || isTermsLoading || isPrivacyConsentLoading || isTermsConsentLoading,
    needsPrivacyConsent,
    needsTermsConsent,
    needsConsent: needsPrivacyConsent || needsTermsConsent,
    privacyPolicy,
    termsOfService,
  };
};
