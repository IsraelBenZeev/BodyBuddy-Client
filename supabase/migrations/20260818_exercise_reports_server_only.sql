-- The exercise-missing report flow now goes through the server (POST /reports/exercise-missing),
-- which inserts with the service_role key and sends the email itself. The DB-level webhook that
-- fired on every INSERT (calling /webhooks/exercise-report) is now redundant and would double-send
-- the email, since the server's own insert still fires it.
DROP TRIGGER IF EXISTS exercise_reports_notify_webhook ON exercise_reports;
DROP FUNCTION IF EXISTS notify_exercise_report_webhook();

-- The client no longer inserts directly with the anon/authenticated key — only the server's
-- service_role writes to this table now, so RLS should deny all client-side access, including INSERT.
DROP POLICY IF EXISTS "exercise_reports_insert" ON exercise_reports;
