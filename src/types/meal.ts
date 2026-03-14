import type { MeasurementType } from './nutrition';

/** תואם לטבלת meals ב-Supabase */
export interface Meal {
  id: string;
  created_at: string;
  user_id: string;
  name_meal: string;
}

/** תואם לטבלת meal_items ב-Supabase */
export interface MealItem {
  id: string;
  created_at: string;
  meal_id: string;
  food_item_id: string;
  /** גרמים אם measurement_type='grams', מספר יחידות אם 'units' */
  amount_g: number;
}

/** נתוני מזון מתוך food_items (למודל סקירת ארוחה וליומן) */
export interface MealItemFoodInfo {
  name: string;
  measurement_type: MeasurementType;
  unit_weight_g?: number | null;
  // מסלול גרמים
  calories_per_100: number | null;
  protein_per_100: number | null;
  carbs_per_100: number | null;
  fat_per_100: number | null;
  // מסלול יחידות
  calories_per_unit?: number | null;
  protein_per_unit?: number | null;
  carbs_per_unit?: number | null;
  fat_per_unit?: number | null;
}

/** ארוחה עם פריטים (לצורך תצוגה) */
export interface MealWithItems extends Meal {
  meal_items?: (MealItem & { food_item?: MealItemFoodInfo })[];
}

export type MealBuilderParams = {
  mode: 'create' | 'edit' | 'save_from_log';
  initialName?: string;
  initialItems?: {
    food_item_id: string;
    name: string;
    amount_g: number;
    protein_per_100: number;
    carbs_per_100?: number;
    fat_per_100?: number;
    calories_per_100: number;
    measurement_type?: MeasurementType;
  }[];
  mealId?: string;
};

/** פריט לארוחה בטופס (לפני שמירה) */
export interface MealItemForm {
  food_item_id: string;
  name: string;
  /** גרמים אם measurement_type='grams', מספר יחידות אם 'units' */
  amount_g: number;
  measurement_type: MeasurementType;
  protein_per_100: number | null;
  carbs_per_100: number | null;
  fat_per_100: number | null;
  calories_per_100: number | null;
  calories_per_unit?: number | null;
  protein_per_unit?: number | null;
  carbs_per_unit?: number | null;
  fat_per_unit?: number | null;
}
