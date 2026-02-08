import type { MacroSplit, NutritionGoals } from '@/src/types/nutrition';
import type { Profile } from '@/src/types/profile';
import { calculateDailyCalories } from './calculateMetrics';

/**
 * חישוב יעדי מקרו נוטריינטים לפי פרופיל משתמש
 *
 * ברירת מחדל:
 * - חלבון: 1.7g × משקל
 * - שומן: 25% מקלוריות
 * - פחמימות: שאר הקלוריות
 */
export const calculateNutritionGoals = (
  profile: Profile | null,
): NutritionGoals | null => {
  if (!profile || !profile.weight) return null;

  const dailyCalories = calculateDailyCalories(
    profile.gender,
    profile.weight,
    profile.height,
    profile.age,
    profile.activity_level,
    profile.goal,
    profile.calorie_offset,
  );

  if (!dailyCalories) return null;

  const protein = Math.round(profile.weight * 1.7);
  const fatCalories = dailyCalories * 0.25;
  const fat = Math.round(fatCalories / 9);
  const proteinCalories = protein * 4;
  const remainingCalories = dailyCalories - proteinCalories - fatCalories;
  const carbs = Math.round(remainingCalories / 4);

  return {
    protein,
    carbs,
    fat,
    calories: dailyCalories,
  };
};

export const calculateMacroSplit = (
  protein: number,
  carbs: number,
  fat: number,
): MacroSplit => {
  const totalCalories = protein * 4 + carbs * 4 + fat * 9;

  if (totalCalories === 0) {
    return {
      protein: { grams: 0, percentage: 0 },
      carbs: { grams: 0, percentage: 0 },
      fat: { grams: 0, percentage: 0 },
    };
  }

  const proteinPercentage = Math.round(((protein * 4) / totalCalories) * 100);
  const carbsPercentage = Math.round(((carbs * 4) / totalCalories) * 100);
  const fatPercentage = Math.round(((fat * 9) / totalCalories) * 100);

  return {
    protein: { grams: protein, percentage: proteinPercentage },
    carbs: { grams: carbs, percentage: carbsPercentage },
    fat: { grams: fat, percentage: fatPercentage },
  };
};

export const calculateRemaining = (goal: number, consumed: number): number => {
  return Math.max(0, goal - consumed);
};

export const calculateProgress = (goal: number, consumed: number): number => {
  if (goal === 0) return 0;
  return Math.min(100, Math.round((consumed / goal) * 100));
};

export const getMotivationMessage = (
  caloriesRemaining: number,
  progress: number,
): string => {
  if (progress >= 100) return '🎉 יום מושלם! השלמת את היעד היומי';
  if (progress >= 80) return `💪 כמעט שם! נותרו ${caloriesRemaining} קק״ל`;
  if (progress >= 50) return `🔥 באמצע הדרך! נותרו ${caloriesRemaining} קק״ל`;
  if (progress >= 20) return `⚡ המשך כך! נותרו ${caloriesRemaining} קק״ל`;
  return `🌟 בואו נתחיל! נותרו ${caloriesRemaining} קק״ל`;
};

export const formatDateForDB = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayDate = (): string => {
  return formatDateForDB(new Date());
};

export interface DailyConsumed {
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  calories_consumed: number;
}

/** מחשב סיכום צריכה יומית מרשומות nutrition_entries */
export const sumEntriesToDailyConsumed = (
  entries: Array<{ protein: number; carbs: number; fat: number; calories: number }>,
): DailyConsumed => {
  return entries.reduce(
    (acc, e) => ({
      protein_consumed: acc.protein_consumed + e.protein,
      carbs_consumed: acc.carbs_consumed + e.carbs,
      fat_consumed: acc.fat_consumed + e.fat,
      calories_consumed: acc.calories_consumed + e.calories,
    }),
    { protein_consumed: 0, carbs_consumed: 0, fat_consumed: 0, calories_consumed: 0 },
  );
};
