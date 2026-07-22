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
}
