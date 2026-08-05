-- Audit log of manually-sent broadcast push notifications (e.g. "privacy policy
-- updated" announcements), as opposed to notification_log which only tracks the
-- automated per-user reminders sent by the send-notifications Edge Function.
-- One row per broadcast (not per recipient) - who triggered it, what was sent,
-- and where it deep-links to.

CREATE TABLE IF NOT EXISTS notification_broadcasts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  navigation   JSONB,
  sent_via     TEXT NOT NULL CHECK (sent_via IN ('claude_code', 'admin_panel')),
  sent_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notification_broadcasts ENABLE ROW LEVEL SECURITY;
