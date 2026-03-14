import type { Meal, MealWithItems } from '@/src/types/meal';
import type {
    AIAnalysisResult,
    CreateNutritionEntryPayload,
    FoodItem,
    MeasurementType,
    NutritionEntry,
} from '@/src/types/nutrition';
import { supabase } from '@/supabase_client';

/**
 * מחזיר את רשומות התזונה של המשתמש לתאריך נתון (יומן ארוחות).
 */
export const getNutritionEntries = async (
  userId: string,
  date: string,
): Promise<NutritionEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('nutrition_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(normalizeNutritionEntry);
  } catch (error) {
    console.error('Get nutrition entries error:', error);
    throw error;
  }
};

function normalizeNutritionEntry(row: Record<string, unknown>): NutritionEntry {
  return {
    id: String(row.id),
    user_id: row.user_id as string,
    date: row.date as string,
    food_name: (row.food_name as string) ?? '',
    protein: Number(row.protein ?? 0),
    carbs: Number(row.carbs ?? 0),
    fat: Number(row.fat ?? 0),
    calories: Number(row.calories ?? 0),
    portion_size: Number(row.portion_size ?? 0),
    portion_unit: (row.portion_unit as NutritionEntry['portion_unit']) ?? 'g',
    food_item_id: row.food_item_id as string | undefined,
    group_id: (row.group_id as string | null) ?? undefined,
    group_name: (row.group_name as string | null) ?? undefined,
    created_at: row.created_at as string,
  };
}

/**
 * יוצר רשומת תזונה (הוספה ליומן היומי).
 */
export const createNutritionEntry = async (
  payload: CreateNutritionEntryPayload,
): Promise<NutritionEntry> => {
  try {
    const insertRow: Record<string, unknown> = {
      user_id: payload.user_id,
      date: payload.date,
      food_name: payload.food_name,
      portion_size: Math.round(payload.portion_size),
      portion_unit: payload.portion_unit,
      protein: Math.round(payload.protein),
      carbs: Math.round(payload.carbs),
      fat: Math.round(payload.fat),
      calories: Math.round(payload.calories),
      food_item_id: payload.food_item_id ?? null,
      group_id: payload.group_id ?? null,
      group_name: payload.group_name ?? null,
    };
    const { data, error } = await supabase
      .from('nutrition_entries')
      .insert(insertRow)
      .select()
      .single();

    if (error) throw error;
    return normalizeNutritionEntry(data as Record<string, unknown>);
  } catch (error) {
    console.error('Create nutrition entry error:', error);
    throw error;
  }
};

/**
 * מכניס מספר רשומות תזונה עם אותו group_id (למשל הוספת ארוחה שלמה ליומן).
 */
export const createNutritionEntriesBulk = async (
  payloads: CreateNutritionEntryPayload[]
): Promise<NutritionEntry[]> => {
  if (payloads.length === 0) return [];
  try {
    const rows = payloads.map((p) => ({
      user_id: p.user_id,
      date: p.date,
      food_name: p.food_name,
      portion_size: Math.round(p.portion_size),
      portion_unit: p.portion_unit,
      protein: Math.round(p.protein),
      carbs: Math.round(p.carbs),
      fat: Math.round(p.fat),
      calories: Math.round(p.calories),
      food_item_id: p.food_item_id ?? null,
      group_id: p.group_id ?? null,
      group_name: p.group_name ?? null,
    }));
    const { data, error } = await supabase
      .from('nutrition_entries')
      .insert(rows)
      .select();
    if (error) throw error;
    return (data ?? []).map((row) =>
      normalizeNutritionEntry(row as Record<string, unknown>)
    );
  } catch (error) {
    console.error('Create nutrition entries bulk error:', error);
    throw error;
  }
};

/**
 * מוחק רשומת תזונה.
 */
export const deleteNutritionEntry = async (
  entryId: string,
  userId: string,
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('nutrition_entries')
      .delete()
      .eq('id', entryId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Delete nutrition entry error:', error);
    throw error;
  }
};

/**
 * מוחק את כל רשומות התזונה של קבוצה (ארוחה) לפי group_id.
 */
export const deleteNutritionEntriesByGroupId = async (
  groupId: string,
  userId: string,
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('nutrition_entries')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Delete nutrition entries by group error:', error);
    throw error;
  }
};

/**
 * מחזיר את כל המאכלים שהמשתמש יכול לבחור: גלובליים (user_id null) + המאכלים שלו.
 */
export const getFoodItems = async (userId: string): Promise<FoodItem[]> => {
  try {
    const { data, error } = await supabase
      .from('food_items')
      .select(`
        id, name, category, is_active, user_id,
        measurement_type, unit_weight_g,
        calories_per_100, protein_per_100, carbs_per_100, fat_per_100,
        calories_per_unit, protein_per_unit, carbs_per_unit, fat_per_unit,
        created_at, updated_at
      `)
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(normalizeFoodItem);
  } catch (error) {
    console.error('Get food items error:', error);
    throw error;
  }
};

function normalizeFoodItem(row: Record<string, unknown>): FoodItem {
  const measurementType = (row.measurement_type as MeasurementType) ?? 'grams';
  return {
    id: row.id as string,
    name: row.name as string,
    category: (row.category as string) ?? undefined,
    is_active: row.is_active !== false,
    user_id: row.user_id as string | undefined,
    measurement_type: measurementType,
    unit_weight_g: row.unit_weight_g != null ? Number(row.unit_weight_g) : null,
    calories_per_100: row.calories_per_100 != null ? Number(row.calories_per_100) : null,
    protein_per_100: row.protein_per_100 != null ? Number(row.protein_per_100) : null,
    carbs_per_100: row.carbs_per_100 != null ? Number(row.carbs_per_100) : null,
    fat_per_100: row.fat_per_100 != null ? Number(row.fat_per_100) : null,
    calories_per_unit: row.calories_per_unit != null ? Number(row.calories_per_unit) : null,
    protein_per_unit: row.protein_per_unit != null ? Number(row.protein_per_unit) : null,
    carbs_per_unit: row.carbs_per_unit != null ? Number(row.carbs_per_unit) : null,
    fat_per_unit: row.fat_per_unit != null ? Number(row.fat_per_unit) : null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

/**
 * מוסיף מאכל חדש ל־food_items.
 */
export const createFoodItem = async (
  userId: string,
  foodData: {
    name: string;
    category?: string;
    measurement_type: MeasurementType;
    // grams path
    calories_per_100?: number | null;
    protein_per_100?: number | null;
    carbs_per_100?: number | null;
    fat_per_100?: number | null;
    // units path
    unit_weight_g?: number | null;
    calories_per_unit?: number | null;
    protein_per_unit?: number | null;
    carbs_per_unit?: number | null;
    fat_per_unit?: number | null;
  },
): Promise<FoodItem> => {
  try {
    const isGrams = foodData.measurement_type === 'grams';
    const insertData = {
      user_id: userId,
      name: foodData.name,
      category: foodData.category ?? null,
      measurement_type: foodData.measurement_type,
      // grams path (NOT NULL in DB — use 0 as default for units path)
      calories_per_100: isGrams ? (foodData.calories_per_100 ?? 0) : 0,
      protein_per_100: isGrams ? (foodData.protein_per_100 ?? 0) : 0,
      carbs_per_100: isGrams ? (foodData.carbs_per_100 ?? 0) : 0,
      fat_per_100: isGrams ? (foodData.fat_per_100 ?? 0) : 0,
      // units path
      unit_weight_g: !isGrams ? (foodData.unit_weight_g ?? null) : null,
      calories_per_unit: !isGrams ? (foodData.calories_per_unit ?? null) : null,
      protein_per_unit: !isGrams ? (foodData.protein_per_unit ?? null) : null,
      carbs_per_unit: !isGrams ? (foodData.carbs_per_unit ?? null) : null,
      fat_per_unit: !isGrams ? (foodData.fat_per_unit ?? null) : null,
    };

    const { data, error } = await supabase
      .from('food_items')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return normalizeFoodItem(data as Record<string, unknown>);
  } catch (error) {
    console.error('Create food item error:', error);
    throw error;
  }
};

/**
 * מוחק מאכל מרשימת המאכלים של המשתמש (soft delete).
 */
export const deleteFoodItem = async (foodItemId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('food_items')
      .update({ is_active: false })
      .eq('id', foodItemId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Delete food item error:', error);
    throw error;
  }
};

/**
 * מוחק ארוחה שמורה (meal + meal_items).
 */
export const deleteMeal = async (mealId: string, userId: string): Promise<void> => {
  try {
    const { error: itemsError } = await supabase
      .from('meal_items')
      .delete()
      .eq('meal_id', mealId);

    if (itemsError) throw itemsError;

    const { error: mealError } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId)
      .eq('user_id', userId);

    if (mealError) throw mealError;
  } catch (error) {
    console.error('Delete meal error:', error);
    throw error;
  }
};

// —— Meals (ארוחות) ——

function normalizeMeal(row: Record<string, unknown>): Meal {
  return {
    id: String(row.id),
    created_at: row.created_at as string,
    user_id: row.user_id as string,
    name_meal: (row.name_meal as string) ?? '',
  };
}

/**
 * מחזיר את כל הארוחות של המשתמש (ללא פריטים).
 */
export const getMeals = async (userId: string): Promise<Meal[]> => {
  try {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(normalizeMeal);
  } catch (error) {
    console.error('Get meals error:', error);
    throw error;
  }
};

/**
 * מחזיר ארוחות עם פריטים (לצורך תצוגה ברשימה).
 */
export const getMealsWithItems = async (
  userId: string
): Promise<MealWithItems[]> => {
  try {
    const { data: mealsData, error: mealsError } = await supabase
      .from('meals')
      .select(`
        *,
        meal_items (
          id,
          created_at,
          meal_id,
          food_item_id,
          amount_g,
          food_items (
            name, measurement_type, unit_weight_g, is_active,
            calories_per_100, protein_per_100, carbs_per_100, fat_per_100,
            calories_per_unit, protein_per_unit, carbs_per_unit, fat_per_unit
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (mealsError) throw mealsError;

    return (mealsData ?? []).map((row: Record<string, unknown>) => {
      const meal = normalizeMeal(row);
      const rawItems = (row.meal_items as Record<string, unknown>[] | null) ?? [];
      const meal_items = rawItems.filter((mi: Record<string, unknown>) => {
        const fi = (mi.food_items ?? mi.food_item) as Record<string, unknown> | null;
        return fi == null || fi.is_active !== false;
      }).map((mi: Record<string, unknown>) => {
        const food_item = (mi.food_items ?? mi.food_item) as Record<string, unknown> | null;
        const measurementType = (food_item?.measurement_type as MeasurementType) ?? 'grams';
        return {
          id: String(mi.id),
          created_at: mi.created_at as string,
          meal_id: String(mi.meal_id),
          food_item_id: mi.food_item_id as string,
          amount_g: Number(mi.amount_g ?? 0),
          food_item:
            food_item != null
              ? {
                  name: (food_item.name as string) ?? '',
                  measurement_type: measurementType,
                  unit_weight_g: food_item.unit_weight_g != null ? Number(food_item.unit_weight_g) : null,
                  calories_per_100: food_item.calories_per_100 != null ? Number(food_item.calories_per_100) : null,
                  protein_per_100: food_item.protein_per_100 != null ? Number(food_item.protein_per_100) : null,
                  carbs_per_100: food_item.carbs_per_100 != null ? Number(food_item.carbs_per_100) : null,
                  fat_per_100: food_item.fat_per_100 != null ? Number(food_item.fat_per_100) : null,
                  calories_per_unit: food_item.calories_per_unit != null ? Number(food_item.calories_per_unit) : null,
                  protein_per_unit: food_item.protein_per_unit != null ? Number(food_item.protein_per_unit) : null,
                  carbs_per_unit: food_item.carbs_per_unit != null ? Number(food_item.carbs_per_unit) : null,
                  fat_per_unit: food_item.fat_per_unit != null ? Number(food_item.fat_per_unit) : null,
                }
              : undefined,
        };
      });
      return { ...meal, meal_items };
    });
  } catch (error) {
    console.error('Get meals with items error:', error);
    throw error;
  }
};

/**
 * יוצר ארוחה חדשה עם פריטים (מזונות + כמות).
 */
export const createMealWithItems = async (
  userId: string,
  name_meal: string,
  items: { food_item_id: string; amount_g: number }[]
): Promise<Meal> => {
  try {
    const { data: mealRow, error: mealError } = await supabase
      .from('meals')
      .insert({ user_id: userId, name_meal })
      .select()
      .single();

    if (mealError) throw mealError;

    const mealId = (mealRow as Record<string, unknown>).id as number;
    if (items.length > 0) {
      const { error: itemsError } = await supabase.from('meal_items').insert(
        items.map((item) => ({
          meal_id: mealId,
          food_item_id: item.food_item_id,
          amount_g: item.amount_g,
        }))
      );
      if (itemsError) throw itemsError;
    }

    return normalizeMeal(mealRow as Record<string, unknown>);
  } catch (error) {
    console.error('Create meal with items error:', error);
    throw error;
  }
};

// ── AI Image Analysis ──────────────────────────────────────────────────────────

const AI_AGENT_URL = 'https://mail2-whats-app-sever.vercel.app/nutrition/analyze-food';

export const analyzeNutritionImage = async (imageBase64: string, signal?: AbortSignal): Promise<AIAnalysisResult> => {
  const response = await fetch(AI_AGENT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageBase64 }),
    signal,
  });
  if (!response.ok) throw new Error('שגיאה בניתוח התמונה');
  return response.json() as Promise<AIAnalysisResult>;
};
