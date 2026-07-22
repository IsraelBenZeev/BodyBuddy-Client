import { logError } from '@/src/lib/logger';
import type { PrivacyPolicyContent } from '@/src/types/privacyPolicy';

const PRIVACY_POLICY_URL = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? '';

export const getPrivacyPolicy = async (): Promise<PrivacyPolicyContent> => {
  try {
    const response = await fetch(PRIVACY_POLICY_URL);
    if (!response.ok) throw new Error(`getPrivacyPolicy ${response.status}`);
    return (await response.json()) as PrivacyPolicyContent;
  } catch (error) {
    logError(error, 'getPrivacyPolicy');
    throw error;
  }
};
