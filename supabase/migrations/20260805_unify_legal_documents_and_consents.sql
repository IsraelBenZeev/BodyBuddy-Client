-- Unify privacy_policies into a generic legal_documents table so additional
-- legal document types (e.g. terms_of_service) can reuse the same shape.
ALTER TABLE privacy_policies RENAME TO legal_documents;

ALTER TABLE legal_documents ADD COLUMN document_type text NOT NULL DEFAULT 'privacy_policy';
ALTER TABLE legal_documents ALTER COLUMN document_type DROP DEFAULT;
ALTER TABLE legal_documents ADD CONSTRAINT legal_documents_document_type_check
  CHECK (document_type IN ('privacy_policy', 'terms_of_service'));

ALTER TABLE legal_documents DROP CONSTRAINT privacy_policies_version_key;
ALTER TABLE legal_documents ADD CONSTRAINT legal_documents_type_version_key
  UNIQUE (document_type, version);

ALTER POLICY "privacy_policies_select" ON legal_documents RENAME TO "legal_documents_select";

-- Unify consent tracking across document types (append-only, same as before).
ALTER TABLE user_consents ADD COLUMN policy_type text NOT NULL DEFAULT 'privacy_policy';
ALTER TABLE user_consents ALTER COLUMN policy_type DROP DEFAULT;
ALTER TABLE user_consents ADD CONSTRAINT user_consents_policy_type_check
  CHECK (policy_type IN ('privacy_policy', 'terms_of_service'));

ALTER TABLE user_consents DROP CONSTRAINT uq_user_consents_user_version;
ALTER TABLE user_consents ADD CONSTRAINT uq_user_consents_user_type_version
  UNIQUE (user_id, policy_type, policy_version);
