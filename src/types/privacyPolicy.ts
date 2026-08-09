export interface PrivacyPolicySection {
  title: string;
  body: string[];
  items?: string[];
}

export interface PrivacyPolicyContent {
  version: string;
  content_he: PrivacyPolicySection[];
  content_en: PrivacyPolicySection[];
  created_at: string;
  changes_summary_he: string[] | null;
  changes_summary_en: string[] | null;
}
