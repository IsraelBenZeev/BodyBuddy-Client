export interface Profile {
  id: number;
  created_at: string;
  user_id: string;
  full_name: string | null;
  age: number | null;
  weight: number | null;
  gender: string | null;
  activity_level: string | null;
  avatar_url: string | null;
}

export type Gender = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

/** הנתונים שהטופס מנהל (TextInput תמיד מחזיר string) */
export interface ProfileFormData {
  full_name: string;
  age: string;
  weight: string;
  gender: Gender | '';
  activity_level: ActivityLevel | '';
}

/** הנתונים שנשלחים ל-Supabase */
export interface CreateProfilePayload {
  full_name: string;
  age: number;
  weight: number;
  gender: Gender;
  activity_level: ActivityLevel;
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
