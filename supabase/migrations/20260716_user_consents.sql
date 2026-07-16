-- Records each time a user explicitly agreed to the privacy policy. Append-only:
-- if the policy is updated (new policy_version), a new row is inserted rather than
-- overwriting the previous one, so consent to earlier versions is never lost/overwritten.

CREATE TABLE IF NOT EXISTS user_consents (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_version TEXT NOT NULL,
  consented_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_consents_user_version UNIQUE (user_id, policy_version)
);

CREATE INDEX IF NOT EXISTS idx_user_consents_user ON user_consents(user_id);

ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_consents_select" ON user_consents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_consents_insert" ON user_consents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
-- No UPDATE/DELETE policy — consent records are immutable/append-only.
