-- Short "what changed" bullet list shown to users on version bumps, so re-consent
-- is backed by an actual summary of the change rather than a generic re-show of
-- the full document. NULL/empty for the first version of a document (nothing changed yet).
ALTER TABLE legal_documents ADD COLUMN changes_summary_he text[];
ALTER TABLE legal_documents ADD COLUMN changes_summary_en text[];
