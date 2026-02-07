export interface Profile {
  id: number;
  created_at: string;
  user_id: string;
  full_name: string | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  gender: string | null;
  activity_level: string | null;
  goal: Goal | null;
  calorie_offset: number | null;
  avatar_url: string | null;
}

export type Gender = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

export type Goal = 'cut' | 'bulk' | 'maintain';

export interface ProfileFormData {
  full_name: string;
  age: number;
  height: number;
  weight: number;
  gender: Gender | '';
  activity_level: ActivityLevel | '';
  goal: Goal | '';
  calorie_offset: number;
}

export interface CreateProfilePayload {
  full_name: string;
  age: number;
  height: number;
  weight: number;
  gender: Gender;
  activity_level: ActivityLevel;
  goal: Goal;
  calorie_offset: number;
  avatar_url?: string;
}

export interface GenderOption {
  value: Gender;
  label: string;
  icon: string;
}

export interface ActivityLevelOption {
  value: ActivityLevel;
  label: string;
  description: string;
}

export interface GoalOption {
  value: Goal;
  label: string;
  description: string;
  icon: string;
}

export const genderOptions: GenderOption[] = [
  { value: 'male', label: 'זכר', icon: 'male' },
  { value: 'female', label: 'נקבה', icon: 'female' },
];

export const activityLevelOptions: ActivityLevelOption[] = [
  { value: 'sedentary', label: 'יושבני', description: 'מעט או ללא פעילות גופנית' },
  { value: 'lightly_active', label: 'פעילות קלה', description: '1-3 אימונים בשבוע' },
  { value: 'moderately_active', label: 'פעילות בינונית', description: '3-5 אימונים בשבוע' },
  { value: 'very_active', label: 'פעילות גבוהה', description: '6-7 אימונים בשבוע' },
  { value: 'extra_active', label: 'פעילות אינטנסיבית', description: 'אימונים יומיומיים כולל כוח' },
];

export const goalOptions: GoalOption[] = [
  { value: 'cut', label: 'חיטוב', description: 'הורדת אחוזי שומן ועיצוב הגוף', icon: 'body-outline' },
  { value: 'bulk', label: 'מסה', description: 'בניית מסת שריר והגדלת נפח', icon: 'barbell-outline' },
  { value: 'maintain', label: 'איזון', description: 'שמירה על המשקל והכושר הנוכחי', icon: 'scale-outline' },
];

export const activityLevelToTDEEKey: Record<ActivityLevel, 'A' | 'B' | 'C' | 'D' | 'E'> = {
  sedentary: 'A',
  lightly_active: 'B',
  moderately_active: 'C',
  very_active: 'D',
  extra_active: 'E',
};

/** ברירות מחדל להפרש קלוריות לפי מטרה */
export const DEFAULT_CALORIE_OFFSET: Record<'cut' | 'bulk', number> = {
  cut: 500,
  bulk: 300,
};

export interface OffsetIntensity {
  label: string;
  tag: string;
  color: string;
}

/**
 * אינטרפולציה ליניארית בין שני צבעי RGB.
 * ratio = 0 → startColor, ratio = 1 → endColor
 */
const lerpColor = (
  start: [number, number, number],
  end: [number, number, number],
  ratio: number,
): string => {
  const r = Math.round(start[0] + (end[0] - start[0]) * ratio);
  const g = Math.round(start[1] + (end[1] - start[1]) * ratio);
  const b = Math.round(start[2] + (end[2] - start[2]) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
};

// טווחי צבעים: מבהיר (אבל עדיין ברור) → כהה
const LIME_LIGHT: [number, number, number] = [180, 230, 60]; // lime-400
const LIME_DARK: [number, number, number] = [90, 130, 20]; // lime-700

const ORANGE_LIGHT: [number, number, number] = [253, 186, 116]; // orange-300
const ORANGE_DARK: [number, number, number] = [234, 88, 12]; // orange-600

const RED_LIGHT: [number, number, number] = [255, 100, 100]; // red-300
const RED_DARK: [number, number, number] = [200, 20, 20]; // red-600

/** מחזיר תיוג עוצמה + צבע דינמי לפי הפרש קלוריות ומטרה */
export const getOffsetIntensity = (
  offset: number,
  goal: Goal,
): OffsetIntensity => {
  if (goal === 'maintain') {
    return { label: '', tag: 'איזון', color: lerpColor(LIME_LIGHT, LIME_DARK, 0.5) };
  }

  const isCut = goal === 'cut';

  if (offset <= 300) {
    // 100-300 → lime, מבהיר לכהה
    const ratio = Math.max(0, (offset - 100) / 200);
    return {
      label: isCut
        ? 'ירידה מתונה - קל להתמיד'
        : 'עלייה מתונה - קל להתמיד',
      tag: isCut ? 'גרעון קל' : 'עודף קל',
      color: lerpColor(LIME_LIGHT, LIME_DARK, ratio),
    };
  }

  if (offset <= 600) {
    // 350-600 → orange, מבהיר לכהה
    const ratio = Math.max(0, (offset - 350) / 250);
    return {
      label: isCut
        ? 'קצב מומלץ - איזון מושלם'
        : 'קצב מומלץ - בניית שריר יעילה',
      tag: 'קצב מומלץ',
      color: lerpColor(ORANGE_LIGHT, ORANGE_DARK, ratio),
    };
  }

  // 650-1000 → red, מבהיר לכהה
  const ratio = Math.min(1, Math.max(0, (offset - 650) / 350));
  return {
    label: isCut
      ? 'קצב אגרסיבי - קשה להתמדה'
      : 'קצב אגרסיבי - עלול לצבור שומן',
    tag: isCut ? 'גרעון חזק' : 'עודף חזק',
    color: lerpColor(RED_LIGHT, RED_DARK, ratio),
  };
};
