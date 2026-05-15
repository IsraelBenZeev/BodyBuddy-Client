-- Track recently used foods per user.
-- Each row stores a reference to either food_items (user/custom foods)
-- or foods (global DB foods), never both at once.
--
-- UNIQUE constraints on nullable columns: PostgreSQL treats NULLs as not-equal,
-- so UNIQUE(user_id, food_item_id) allows multiple rows where food_item_id IS NULL —
-- which is exactly what we want (those rows have food_id set instead).

CREATE TABLE IF NOT EXISTS user_recent_foods (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_item_id  UUID REFERENCES food_items(id) ON DELETE CASCADE,
  food_id       UUID REFERENCES foods(id) ON DELETE CASCADE,
  last_used_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT chk_one_food CHECK (
    (food_item_id IS NOT NULL AND food_id IS NULL) OR
    (food_item_id IS NULL  AND food_id IS NOT NULL)
  ),
  CONSTRAINT uq_recent_food_item UNIQUE (user_id, food_item_id),
  CONSTRAINT uq_recent_food      UNIQUE (user_id, food_id)
);

-- Fast lookup of recent foods for a user
CREATE INDEX IF NOT EXISTS idx_recent_by_user
  ON user_recent_foods(user_id, last_used_at DESC);

-- RLS: users can only see/modify their own rows
ALTER TABLE user_recent_foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_recent_foods_select" ON user_recent_foods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_recent_foods_insert" ON user_recent_foods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_recent_foods_update" ON user_recent_foods
  FOR UPDATE USING (auth.uid() = user_id);
