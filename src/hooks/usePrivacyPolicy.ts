import { getPrivacyPolicy } from '@/src/service/privacyPolicyService';
import { useQuery } from '@tanstack/react-query';

export const usePrivacyPolicy = () => {
  return useQuery({
    queryKey: ['privacyPolicy'],
    queryFn: getPrivacyPolicy,
  });
};
