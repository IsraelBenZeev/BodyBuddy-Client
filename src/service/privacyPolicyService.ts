import { logError } from '@/src/lib/logger';
import type { PrivacyPolicyContent } from '@/src/types/privacyPolicy';
import { supabase } from '@/supabase_client';

type LegalDocumentType = 'privacy_policy' | 'terms_of_service';

const fetchLegalDocument = async (documentType: LegalDocumentType): Promise<PrivacyPolicyContent> => {
  const { data, error } = await supabase
    .from('legal_documents')
    .select('version, content_he, content_en, created_at, changes_summary_he, changes_summary_en')
    .eq('document_type', documentType)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data as PrivacyPolicyContent;
};

export const getPrivacyPolicy = async (): Promise<PrivacyPolicyContent> => {
  try {
    return await fetchLegalDocument('privacy_policy');
  } catch (error) {
    logError(error, 'getPrivacyPolicy');
    throw error;
  }
};

export const getTermsOfService = async (): Promise<PrivacyPolicyContent> => {
  try {
    return await fetchLegalDocument('terms_of_service');
  } catch (error) {
    logError(error, 'getTermsOfService');
    throw error;
  }
};
