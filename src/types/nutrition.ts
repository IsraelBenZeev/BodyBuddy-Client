export interface DailyNutrition {
  id: string;
  user_id: string;
  date: string;

  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  calories_consumed: number;

  protein_goal: number | null;
  carbs_goal: number | null;
  fat_goal: number | null;
  calories_goal: number | null;

  created_at: string;
  updated_at: string;
}

export interface NutritionEntry {
  id: string;
  user_id: string;
  date: string;
  food_name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  portion_size: number;
  portion_unit: 'g' | 'ml' | 'unit' | 'serving';
  /** משקל מנה אחת בגרם – לתצוגה "שם × כמות סה״כ X גרם (מנה × כמות)" */
  serving_weight?: number | null;
  food_item_id?: string;
  /** רשומות עם אותו group_id מוצגות כבלוק אחד (למשל ארוחה מה-template) */
  group_id?: string | null;
  /** שם התצוגה של הקבוצה (למשל שם הארוחה) */
  group_name?: string | null;
  created_at: string;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  /** משקל מנה/יחידה אחת בגרם – משמש כערך התחלתי בבחירת מנה */
  serving_weight?: number | null;
  protein_per_100: number;
  carbs_per_100: number;
  fat_per_100: number;
  calories_per_100: number;
  is_verified: boolean;
  is_custom: boolean;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface NutritionGoals {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export interface ManualEntryFormData {
  food_name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  portion_size: number;
  portion_unit: 'g' | 'ml' | 'unit' | 'serving';
}

export interface CreateNutritionEntryPayload {
  user_id: string;
  date: string;
  food_name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  portion_size: number;
  portion_unit: 'g' | 'ml' | 'unit' | 'serving';
  /** משקל מנה אחת בגרם (אופציונלי – לתצוגה ביומן) */
  serving_weight?: number | null;
  food_item_id?: string;
  group_id?: string | null;
  group_name?: string | null;
}

export interface MacroSplit {
  protein: { grams: number; percentage: number };
  carbs: { grams: number; percentage: number };
  fat: { grams: number; percentage: number };
}

export interface SliderEntryFormData {
  food_name: string;
  category?: string;
  /** משקל מנה/יחידה אחת בגרם – נשמר ב־serving_weight */
  serving_weight?: number;
  protein_per_100: number;
  carbs_per_100: number;
  fat_per_100: number;
  portion_size: number;
  portion_unit: 'g' | 'ml';
}
