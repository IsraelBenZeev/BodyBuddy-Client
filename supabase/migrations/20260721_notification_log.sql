-- Dedup ledger for the send-notifications Edge Function: written/read only by that
-- function via service_role (bypasses RLS), so there are no client-facing policies.

CREATE TABLE IF NOT EXISTS notification_log (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (
    notification_type IN ('workout_reminder', 'profile_incomplete', 'nutrition_reminder', 'weekly_summary')
  ),
  sent_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notification_log_user_type_date
  ON notification_log (user_id, notification_type, sent_at DESC);

ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;
