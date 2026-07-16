-- Replace the free-text "notes" field with a proper ordered "instructions" array,
-- matching exercises_v2.instructions (TEXT[]). Existing single-text notes (if any)
-- become a one-element array so no data is lost.

ALTER TABLE user_custom_exercises
  ALTER COLUMN notes TYPE TEXT[]
  USING CASE WHEN notes IS NULL OR trim(notes) = '' THEN '{}'::text[] ELSE ARRAY[notes] END;

ALTER TABLE user_custom_exercises RENAME COLUMN notes TO instructions;

ALTER TABLE user_custom_exercises ALTER COLUMN instructions SET DEFAULT '{}';
ALTER TABLE user_custom_exercises ALTER COLUMN instructions SET NOT NULL;
