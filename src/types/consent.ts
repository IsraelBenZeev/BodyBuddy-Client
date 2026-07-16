export interface UserConsent {
  id: string;
  user_id: string;
  policy_version: string;
  consented_at: string;
}

// עדכן ערך זה בכל פעם שנוסח מדיניות הפרטיות משתנה, כדי שהסכמות להסטוריה ישנה לא יידרסו
export const PRIVACY_POLICY_VERSION = '1.0';
