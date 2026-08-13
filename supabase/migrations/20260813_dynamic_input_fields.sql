-- Dynamic exercise input_fields: each exercise declares which metrics it
-- needs (reps/weight/added_weight/duration/...), each set stores a generic
-- `values` jsonb blob instead of fixed reps/weight columns.

-- =========================================================================
-- 1. Add new columns (nullable first, backfill below, then tighten).
-- =========================================================================
ALTER TABLE exercises_v2 ADD COLUMN IF NOT EXISTS input_fields JSONB;
ALTER TABLE user_custom_exercises ADD COLUMN IF NOT EXISTS input_fields JSONB;
ALTER TABLE exercise_logs ADD COLUMN IF NOT EXISTS values JSONB;

-- =========================================================================
-- 2. Backfill exercise_logs.values from reps/weight (45 existing rows).
-- =========================================================================
UPDATE exercise_logs
SET values = jsonb_strip_nulls(jsonb_build_object('reps', reps, 'weight', weight))
WHERE values IS NULL;

-- =========================================================================
-- 3. Auto-classify exercises_v2.input_fields from `equipments`.
--    Each UPDATE below overrides rows it matches; net effect is
--    "most specific bucket wins" since they run in this order.
-- =========================================================================

-- 3a. Default bucket: reps + weight (external-weight equipment).
UPDATE exercises_v2
SET input_fields = '[
  {"key":"reps","type":"number","label":"חזרות","unit":null},
  {"key":"weight","type":"number","label":"משקל","unit":"kg"}
]'::jsonb;

-- 3b. Pure bodyweight bucket: equipments is exactly {'body weight'}.
UPDATE exercises_v2
SET input_fields = '[
  {"key":"reps","type":"number","label":"חזרות","unit":null}
]'::jsonb
WHERE equipments = ARRAY['body weight']::text[];

-- 3c. Bodyweight + optional added weight: pull-up/dip/captain's-chair style
--     apparatus, or bench+bodyweight combos, as long as no genuine external
--     weight equipment is also present.
UPDATE exercises_v2
SET input_fields = '[
  {"key":"reps","type":"number","label":"חזרות","unit":null},
  {"key":"added_weight","type":"number","label":"משקל נוסף","unit":"kg","optional":true}
]'::jsonb
WHERE NOT (equipments && ARRAY[
      'barbell','dumbbell','cable machine','machine','EZ bar','weight plate','squat rack'
    ]::text[])
  AND (
    equipments && ARRAY['pull-up bar','dip station','captain''s chair']::text[]
    OR equipments @> ARRAY['bench','body weight']::text[]
  );

-- 3d. Plank exception: timed hold, not reps-based.
UPDATE exercises_v2
SET input_fields = '[
  {"key":"duration","type":"duration","label":"משך זמן","unit":"sec"}
]'::jsonb
WHERE "exerciseId" = 'EbvrQ9D';

-- =========================================================================
-- 4. Backfill user_custom_exercises.input_fields (6 existing rows) using the
--    same heuristic, adapted to the single `equipment` text column.
-- =========================================================================
UPDATE user_custom_exercises
SET input_fields = '[
  {"key":"reps","type":"number","label":"חזרות","unit":null},
  {"key":"weight","type":"number","label":"משקל","unit":"kg"}
]'::jsonb
WHERE input_fields IS NULL;

UPDATE user_custom_exercises
SET input_fields = '[
  {"key":"reps","type":"number","label":"חזרות","unit":null}
]'::jsonb
WHERE equipment = 'body weight';

UPDATE user_custom_exercises
SET input_fields = '[
  {"key":"reps","type":"number","label":"חזרות","unit":null},
  {"key":"added_weight","type":"number","label":"משקל נוסף","unit":"kg","optional":true}
]'::jsonb
WHERE equipment IN ('pull-up bar', 'dip station', 'captain''s chair');

-- =========================================================================
-- 5. Tighten constraints now that every row has a value.
-- =========================================================================
ALTER TABLE exercises_v2 ALTER COLUMN input_fields SET NOT NULL;
ALTER TABLE exercises_v2 ALTER COLUMN input_fields SET DEFAULT '[]'::jsonb;
ALTER TABLE user_custom_exercises ALTER COLUMN input_fields SET NOT NULL;
ALTER TABLE user_custom_exercises ALTER COLUMN input_fields SET DEFAULT '[]'::jsonb;
ALTER TABLE exercise_logs ALTER COLUMN values SET NOT NULL;

-- =========================================================================
-- 6. Rename exercise_logs -> exercise_sets, then drop the now-dead columns.
--    (Rename is metadata-only in Postgres; the session_id FK survives it.)
-- =========================================================================
ALTER TABLE exercise_logs RENAME TO exercise_sets;
ALTER TABLE exercise_sets DROP COLUMN reps;
ALTER TABLE exercise_sets DROP COLUMN weight;
