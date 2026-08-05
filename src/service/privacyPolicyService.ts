import { logError } from '@/src/lib/logger';
import type { PrivacyPolicyContent } from '@/src/types/privacyPolicy';
import { supabase } from '@/supabase_client';

export const getPrivacyPolicy = async (): Promise<PrivacyPolicyContent> => {
  try {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('version, content_he, content_en, created_at, changes_summary_he, changes_summary_en')
      .eq('document_type', 'privacy_policy')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (error) throw error;
    return data as PrivacyPolicyContent;
  } catch (error) {
    logError(error, 'getPrivacyPolicy');
    throw error;
  }
};
