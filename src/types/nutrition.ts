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
  food_item_id?: string;
  /** רשומות עם אותו group_id מוצגות כבלוק אחד (למשל ארוחה מה-template) */
  group_id?: string | null;
  /** שם התצוגה של הקבוצה (למשל שם הארוחה) */
  group_name?: string | null;
  created_at: string;
}

export type MeasurementType = 'grams' | 'units';

export interface FoodItem {
  id: string;
  name: string;
  category?: string;
  is_active: boolean;
  user_id?: string;
  measurement_type: MeasurementType;
  unit_weight_g?: number | null;
  // מסלול גרמים
  calories_per_100: number | null;
  protein_per_100: number | null;
  carbs_per_100: number | null;
  fat_per_100: number | null;
  // מסלול יחידות
  calories_per_unit: number | null;
  protein_per_unit: number | null;
  carbs_per_unit: number | null;
  fat_per_unit: number | null;
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
  food_item_id?: string;
  group_id?: string | null;
  group_name?: string | null;
}

export interface MacroSplit {
  protein: { grams: number; percentage: number };
  carbs: { grams: number; percentage: number };
  fat: { grams: number; percentage: number };
}

export interface CreateFoodFormData {
  food_name: string;
  measurement_type: MeasurementType;
  category?: string;
  // מסלול גרמים
  calories_per_100?: number;
  protein_per_100?: number;
  carbs_per_100?: number;
  fat_per_100?: number;
  // מסלול יחידות
  calories_per_unit?: number;
  protein_per_unit?: number;
  carbs_per_unit?: number;
  fat_per_unit?: number;
  // להוספה ליומן
  portion_size?: number;
  portion_unit?: 'g' | 'unit';
}

// ── AI Analysis Types ──────────────────────────────────────────────────────────

export interface AIFoodResult {
  type: 'food';
  food_name: string;
  calories_per_100: number;
  protein_per_100: number;
  measurement_type?: MeasurementType;
  serving_amount?: number;
  category?: string;
  // optional לתאימות לאחור
  carbs_per_100?: number;
  fat_per_100?: number;
}

export interface AIMealResultItem {
  food_name: string;
  estimated_grams: number;
  calories_per_100: number;
  protein_per_100: number;
  carbs_per_100?: number;
  fat_per_100?: number;
}

export interface AIMealResult {
  type: 'meal';
  meal_name: string;
  items: AIMealResultItem[];
}

export type AIAnalysisResult = AIFoodResult | AIMealResult;
