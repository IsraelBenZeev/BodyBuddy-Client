import { getTermsOfService } from '@/src/service/privacyPolicyService';
import { useQuery } from '@tanstack/react-query';

export const useTermsOfService = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['termsOfService'],
    queryFn: getTermsOfService,
    enabled,
  });
};
