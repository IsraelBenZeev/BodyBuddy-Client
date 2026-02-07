import type { ActivityLevel, Goal } from '@/src/types/profile';
import { activityLevelToTDEEKey } from '@/src/types/profile';

export const calculateTDEE = (
  gender: 'male' | 'female',
  weight: number,
  height: number,
  age: number,
  activityLevel: 'A' | 'B' | 'C' | 'D' | 'E',
) => {
  // 1. חישוב BMR
  const bmr =
    10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);

  // 2. מיפוי מכפילי פעילות
  const multipliers = {
    A: 1.2,
    B: 1.375,
    C: 1.55,
    D: 1.725,
    E: 1.9,
  };

  // 3. תוצאה סופית
  return Math.round(bmr * multipliers[activityLevel]);
};

/** כיוון ההתאמה לפי מטרה: cut = הפחתה, bulk = תוספת, maintain = ללא שינוי */
const GOAL_DIRECTION: Record<Goal, -1 | 0 | 1> = {
  cut: -1,
  bulk: 1,
  maintain: 0,
};

/**
 * מחשב קלוריות יומיות מומלצות לפי פרופיל, מטרה והפרש קלוריות שהיוזר בחר.
 * מחזיר null אם חסרים נתונים.
 */
export const calculateDailyCalories = (
  gender: string | null,
  weight: number | null,
  height: number | null,
  age: number | null,
  activityLevel: string | null,
  goal: string | null,
  calorieOffset: number | null,
): number | null => {
  if (
    !gender ||
    !weight ||
    !height ||
    !age ||
    !activityLevel ||
    !goal ||
    calorieOffset == null ||
    !(gender === 'male' || gender === 'female') ||
    !(activityLevel in activityLevelToTDEEKey) ||
    !(goal in GOAL_DIRECTION)
  ) {
    return null;
  }

  const tdeeKey = activityLevelToTDEEKey[activityLevel as ActivityLevel];
  const tdee = calculateTDEE(gender, weight, height, age, tdeeKey);
  const direction = GOAL_DIRECTION[goal as Goal];
  return tdee + direction * calorieOffset;
};