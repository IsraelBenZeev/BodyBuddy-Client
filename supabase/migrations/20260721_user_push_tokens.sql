-- Stores one row per (user, device) pairing an Expo push token to its owner. unique on
-- device_id alone (not user_id+device_id) so that when a different user logs in on a
-- shared device, the upsert on login overwrites ownership automatically - self-healing
-- even if the previous user's logout didn't run (app killed, offline, crash).

CREATE TABLE IF NOT EXISTS user_push_tokens (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expo_push_token  TEXT NOT NULL,
  device_id        TEXT NOT NULL,
  platform         TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_push_tokens_device UNIQUE (device_id)
);

ALTER TABLE user_push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_push_tokens" ON user_push_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own_push_tokens" ON user_push_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_push_tokens" ON user_push_tokens
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_push_tokens" ON user_push_tokens
  FOR DELETE USING (auth.uid() = user_id);
