-- 1) Private, user-owned exercises. Unlike food_items there is no "global" variant —
-- user_id is always NOT NULL, these rows are never shown to other users.

CREATE TABLE IF NOT EXISTS user_custom_exercises (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  body_part      TEXT NOT NULL,
  equipment      TEXT,
  target_muscle  TEXT,
  home_friendly  BOOLEAN NOT NULL DEFAULT false,
  notes          TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Must stay manually in sync with the BodyPart union in src/types/bodtPart.ts —
  -- adding/renaming a body part there requires a follow-up migration to update this too.
  CONSTRAINT chk_custom_exercise_body_part CHECK (
    body_part IN ('neck','shoulders','chest','upper arms','lower arms','waist',
                   'upper legs','lower legs','glutes','general','cardio','back')
  ),
  CONSTRAINT chk_custom_exercise_name_len CHECK (char_length(trim(name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_user_custom_exercises_user
  ON user_custom_exercises(user_id, is_active);

ALTER TABLE user_custom_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_custom_exercises_select" ON user_custom_exercises
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_custom_exercises_insert" ON user_custom_exercises
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_custom_exercises_update" ON user_custom_exercises
  FOR UPDATE USING (auth.uid() = user_id);
-- No DELETE policy — deletion is soft (is_active = false via UPDATE), matching food_items.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_custom_exercises_updated_at
  BEFORE UPDATE ON user_custom_exercises
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 2) "This exercise is missing" reports. Insert-only from the client; the developer
-- reviews via the Supabase dashboard/SQL (service_role bypasses RLS) — no client
-- read access is needed or granted.

CREATE TABLE IF NOT EXISTS exercise_reports (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query    TEXT NOT NULL,
  suggested_name  TEXT,
  note            TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_exercise_reports_status CHECK (status IN ('pending','reviewed','added','dismissed')),
  CONSTRAINT chk_exercise_reports_query_len CHECK (char_length(trim(search_query)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_exercise_reports_created_at
  ON exercise_reports(created_at DESC);

ALTER TABLE exercise_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exercise_reports_insert" ON exercise_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Intentionally no SELECT/UPDATE/DELETE policy — RLS default-denies everything else
-- for the anon/authenticated roles. service_role (dashboard) bypasses RLS.
