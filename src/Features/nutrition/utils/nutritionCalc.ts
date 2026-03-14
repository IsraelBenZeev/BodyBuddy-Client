import type { FoodItem } from '@/src/types/nutrition';

export interface NutrientValues {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

/**
 * מחשב ערכים תזונתיים לפי measurement_type של המזון.
 * @param food - פריט מזון
 * @param amount - גרמים (אם grams) או מספר יחידות (אם units)
 */
export function calculateNutrients(food: FoodItem, amount: number): NutrientValues {
  const round = (n: number) => Math.round(n * 10) / 10;

  if (food.measurement_type === 'units') {
    return {
      protein: round((food.protein_per_unit ?? 0) * amount),
      carbs: round((food.carbs_per_unit ?? 0) * amount),
      fat: round((food.fat_per_unit ?? 0) * amount),
      calories: round((food.calories_per_unit ?? 0) * amount),
    };
  }

  // grams path
  const ratio = amount / 100;
  return {
    protein: round((food.protein_per_100 ?? 0) * ratio),
    carbs: round((food.carbs_per_100 ?? 0) * ratio),
    fat: round((food.fat_per_100 ?? 0) * ratio),
    calories: round((food.calories_per_100 ?? 0) * ratio),
  };
}

/**
 * מחזיר את שם יחידת המדידה לתצוגה.
 * - grams → "גרם"
 * - units → שם היחידה (למשל "ביצה") או "יחידה" כברירת מחדל
 */
export function getAmountLabel(food: FoodItem): string {
  if (food.measurement_type === 'units') {
    return 'יחידה';
  }
  return 'גרם';
}

/**
 * מחזיר את ה-portion_unit המתאים לסוג המדידה.
 */
export function getPortionUnit(food: FoodItem): 'g' | 'unit' {
  return food.measurement_type === 'units' ? 'unit' : 'g';
}
