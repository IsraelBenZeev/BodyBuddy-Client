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
  amount_g: number;
}

/** נתוני מזון מתוך food_items (למודל סקירת ארוחה וליומן) */
export interface MealItemFoodInfo {
  name: string;
  calories_per_100: number;
  protein_per_100: number;
  carbs_per_100: number;
  fat_per_100: number;
  /** משקל מנה/יחידה אחת בגרם – להצגת כמות (quantity × serving_weight = גרם) */
  serving_weight: number;
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
  }[];
  mealId?: string;
};

/** פריט לארוחה בטופס (לפני שמירה) */
export interface MealItemForm {
  food_item_id: string;
  name: string;
  amount_g: number;
  protein_per_100: number;
  carbs_per_100: number;
  fat_per_100: number;
  calories_per_100: number;
  /** גרם למנה (מ־food_items.serving_weight) – לתצוגה */
  serving_weight: number;
}