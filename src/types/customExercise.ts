import { BodyPart } from './bodtPart';

export interface UserCustomExercise {
  id: string; // raw uuid, DB primary key
  user_id: string;
  name: string;
  body_part: BodyPart;
  equipment: string | null;
  target_muscle: string | null;
  home_friendly: boolean;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomExercisePayload {
  name: string;
  body_part: BodyPart;
  equipment?: string | null;
  target_muscle?: string | null;
  home_friendly?: boolean;
  notes?: string | null;
}

export const CUSTOM_EXERCISE_ID_PREFIX = 'custom-';

export const isCustomExerciseId = (id: string): boolean => id.startsWith(CUSTOM_EXERCISE_ID_PREFIX);

export const toCustomExerciseId = (rawId: string): string => `${CUSTOM_EXERCISE_ID_PREFIX}${rawId}`;

export const toRawCustomExerciseId = (exerciseId: string): string =>
  exerciseId.slice(CUSTOM_EXERCISE_ID_PREFIX.length);

// Free-text equipment vocabulary actually in use in exercises_v2 (no DB enum backs this).
export const CUSTOM_EQUIPMENT_OPTIONS: { value: string; label_he: string }[] = [
  { value: 'body weight', label_he: 'משקל גוף' },
  { value: 'dumbbell', label_he: 'דמבל' },
  { value: 'barbell', label_he: 'מוט ברזל' },
  { value: 'EZ bar', label_he: 'מוט EZ' },
  { value: 'cable machine', label_he: 'מכבל' },
  { value: 'machine', label_he: 'מכונה' },
  { value: 'bench', label_he: 'ספסל' },
  { value: 'incline bench', label_he: 'ספסל משופע' },
  { value: 'decline bench', label_he: 'ספסל שיפוע הפוך' },
  { value: 'preacher bench', label_he: 'ספסל פריצ׳ר' },
  { value: 'squat rack', label_he: 'מתקן סקוואט' },
  { value: 'pull-up bar', label_he: 'מתח' },
  { value: 'dip station', label_he: 'מתקן מקבילים' },
  { value: "captain's chair", label_he: 'כיסא קפטן' },
  { value: 'rope', label_he: 'חבל' },
  { value: 'V-bar', label_he: 'ידית V' },
  { value: 'weight plate', label_he: 'דיסקית משקל' },
  { value: 'ab wheel', label_he: 'גלגל בטן' },
];
