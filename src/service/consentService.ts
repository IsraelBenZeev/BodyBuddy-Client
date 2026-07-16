import { logError } from '@/src/lib/logger';
import { supabase } from '@/supabase_client';

// Best-effort: consent was already gated client-side (the auth buttons are disabled
// until the checkbox is checked) — this call just persists proof of it. ignoreDuplicates
// means repeat logins at the same policy_version are silently no-ops (unique constraint
// on user_id + policy_version), so errors here are logged, never thrown at the caller.
export const recordPrivacyConsent = async (userId: string, policyVersion: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_consents')
      .upsert(
        { user_id: userId, policy_version: policyVersion },
        { onConflict: 'user_id,policy_version', ignoreDuplicates: true }
      );
    if (error) throw error;
  } catch (error) {
    logError(error, 'recordPrivacyConsent');
  }
};
