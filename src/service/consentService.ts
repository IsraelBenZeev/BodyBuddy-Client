import { logError } from '@/src/lib/logger';
import { supabase } from '@/supabase_client';

// ignoreDuplicates means repeat consents at the same policy_version are silently
// no-ops (unique constraint on user_id + policy_version), so errors here are logged,
// never thrown at the caller.
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

export const hasUserConsented = async (userId: string, policyVersion: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_consents')
      .select('id')
      .eq('user_id', userId)
      .eq('policy_version', policyVersion)
      .maybeSingle();
    if (error) throw error;
    return !!data;
  } catch (error) {
    logError(error, 'hasUserConsented');
    return true; // fail-open: לא לחסום משתמש מהאפליקציה בגלל שגיאת רשת/שרת
  }
};
