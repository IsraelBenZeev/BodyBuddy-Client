import type { Meal, MealItemFoodInfo, MealWithItems } from '@/src/types/meal';
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
    if (__DEV__) console.error('Get nutrition entries error:', error);
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
      portion_size: payload.portion_size,
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
    if (__DEV__) console.error('Create nutrition entry error:', error);
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
      portion_size: p.portion_size,
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
    if (__DEV__) console.error('Create nutrition entries bulk error:', error);
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
    if (__DEV__) console.error('Delete nutrition entry error:', error);
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
    if (__DEV__) console.error('Delete nutrition entries by group error:', error);
    throw error;
  }
};

/**
 * חיפוש מאכלים לפי שם — קודם מאכלים אישיים (food_items), אחר כך מאגר גלובלי (foods).
 */
export const searchFoodItems = async (query: string, userId: string): Promise<FoodItem[]> => {
  if (!userId || typeof userId !== 'string') throw new Error('Invalid user ID');
  if (!query.trim()) return [];
  try {
    const trimmed = query.trim();

    const [globalRes, userRes] = await Promise.all([
      supabase
        .from('foods')
        .select(`
          id, name, name_en,
          default_measurement_type, default_serving_weight_g,
          calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
          nutrition_category, culinary_category
        `)
        .or(`name.ilike.%${trimmed}%,name_en.ilike.%${trimmed}%`)
        .limit(8),

      supabase
        .from('food_items')
        .select(`
          id, name, category, is_active, user_id,
          measurement_type, unit_weight_g,
          calories_per_100, protein_per_100, carbs_per_100, fat_per_100,
          calories_per_unit, protein_per_unit, carbs_per_unit, fat_per_unit,
          created_at, updated_at
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .ilike('name', `%${trimmed}%`)
        .limit(5),
    ]);

    const globalFoods = (globalRes.data ?? []).map(normalizeGlobalFood);
    const userFoods = (userRes.data ?? []).map(normalizeFoodItem);

    return [...userFoods, ...globalFoods].slice(0, 10);
  } catch (error) {
    if (__DEV__) console.error('Search food items error:', error);
    throw error;
  }
};

/**
 * מחזיר את כל המאכלים שהמשתמש יכול לבחור: גלובליים (user_id null) + המאכלים שלו.
 */
export const getFoodItems = async (userId: string): Promise<FoodItem[]> => {
  if (!userId || typeof userId !== 'string') throw new Error('Invalid user ID');
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
    if (__DEV__) console.error('Get food items error:', error);
    throw error;
  }
};

function normalizeGlobalFood(row: Record<string, unknown>): FoodItem {
  const isUnit = row.default_measurement_type === 'unit';
  const servingWeightG =
    row.default_serving_weight_g != null ? Number(row.default_serving_weight_g) : null;
  const caloriesPer100 = Number(row.calories_per_100g ?? 0);
  const proteinPer100 = Number(row.protein_per_100g ?? 0);
  const carbsPer100 = Number(row.carbs_per_100g ?? 0);
  const fatPer100 = Number(row.fat_per_100g ?? 0);
  const unitRatio = servingWeightG != null ? servingWeightG / 100 : null;

  return {
    id: row.id as string,
    name: row.name as string,
    category: ((row.nutrition_category as string | null) ??
      (row.culinary_category as string | null)) ?? undefined,
    is_active: true,
    user_id: undefined,
    measurement_type: isUnit ? 'units' : 'grams',
    unit_weight_g: servingWeightG,
    calories_per_100: !isUnit ? caloriesPer100 : null,
    protein_per_100: !isUnit ? proteinPer100 : null,
    carbs_per_100: !isUnit ? carbsPer100 : null,
    fat_per_100: !isUnit ? fatPer100 : null,
    calories_per_unit: isUnit && unitRatio != null ? caloriesPer100 * unitRatio : null,
    protein_per_unit: isUnit && unitRatio != null ? proteinPer100 * unitRatio : null,
    carbs_per_unit: isUnit && unitRatio != null ? carbsPer100 * unitRatio : null,
    fat_per_unit: isUnit && unitRatio != null ? fatPer100 * unitRatio : null,
    created_at: '',
    updated_at: '',
    source: 'foods_db',
  };
}

function normalizeFoodItem(row: Record<string, unknown>): FoodItem {
  const measurementType = (row.measurement_type as MeasurementType) ?? 'grams';
  return {
    id: row.id as string,
    name: row.name as string,
    category: (row.category as string) ?? undefined,
    is_active: row.is_active !== false,
    user_id: row.user_id as string | undefined,
    measurement_type: measurementType,
    source: 'food_items',
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
    if (__DEV__) console.error('Create food item error:', error);
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
    if (__DEV__) console.error('Delete food item error:', error);
    throw error;
  }
};

/**
 * מוחק ארוחה שמורה (meal + meal_items).
 */
export const deleteMeal = async (mealId: string, userId: string): Promise<void> => {
  try {
    const { error: mealError } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId)
      .eq('user_id', userId);

    if (mealError) throw mealError;

    const { error: itemsError } = await supabase
      .from('meal_items')
      .delete()
      .eq('meal_id', mealId);

    if (itemsError) throw itemsError;
  } catch (error) {
    if (__DEV__) console.error('Delete meal error:', error);
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
    if (__DEV__) console.error('Get meals error:', error);
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
          food_id,
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

    const foodIds = Array.from(
      new Set(
        (mealsData ?? [])
          .flatMap((meal: Record<string, unknown>) =>
            ((meal.meal_items as Record<string, unknown>[] | null) ?? [])
              .map((item) => item.food_id as string | null)
          )
          .filter((id): id is string => typeof id === 'string' && id.length > 0)
      )
    );

    let foodsById = new Map<string, MealItemFoodInfo>();
    if (foodIds.length > 0) {
      const { data: foodsData, error: foodsError } = await supabase
        .from('foods')
        .select(`
          id, name,
          default_measurement_type, default_serving_weight_g,
          calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g
        `)
        .in('id', foodIds);

      if (foodsError) throw foodsError;
      foodsById = new Map(
        (foodsData ?? []).map((food) => {
          const normalized = normalizeGlobalFood(food as Record<string, unknown>);
          return [
            normalized.id,
            {
              name: normalized.name,
              measurement_type: normalized.measurement_type,
              unit_weight_g: normalized.unit_weight_g,
              calories_per_100: normalized.calories_per_100,
              protein_per_100: normalized.protein_per_100,
              carbs_per_100: normalized.carbs_per_100,
              fat_per_100: normalized.fat_per_100,
              calories_per_unit: normalized.calories_per_unit,
              protein_per_unit: normalized.protein_per_unit,
              carbs_per_unit: normalized.carbs_per_unit,
              fat_per_unit: normalized.fat_per_unit,
            },
          ];
        })
      );
    }

    return (mealsData ?? []).map((row: Record<string, unknown>) => {
      const meal = normalizeMeal(row);
      const rawItems = (row.meal_items as Record<string, unknown>[] | null) ?? [];
      const meal_items = rawItems.filter((mi: Record<string, unknown>) => {
        const fi = (mi.food_items ?? mi.food_item) as Record<string, unknown> | null;
        return fi == null || fi.is_active !== false;
      }).map((mi: Record<string, unknown>) => {
        const food_item = (mi.food_items ?? mi.food_item) as Record<string, unknown> | null;
        const foodId = (mi.food_id as string | null) ?? null;
        const foods_data = foodId != null ? foodsById.get(foodId) : undefined;

        let foodInfo: MealItemFoodInfo | undefined;

        if (food_item != null) {
          const measurementType = (food_item.measurement_type as MeasurementType) ?? 'grams';
          foodInfo = {
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
          };
        } else if (foods_data != null) {
          foodInfo = foods_data;
        }

        return {
          id: String(mi.id),
          created_at: mi.created_at as string,
          meal_id: String(mi.meal_id),
          food_item_id: (mi.food_item_id as string | null) ?? null,
          food_id: foodId,
          amount_g: Number(mi.amount_g ?? 0),
          food_item: foodInfo,
        };
      });
      return { ...meal, meal_items };
    });
  } catch (error) {
    if (__DEV__) console.error('Get meals with items error:', error);
    throw error;
  }
};

/**
 * יוצר ארוחה חדשה עם פריטים (מזונות + כמות).
 */
export const createMealWithItems = async (
  userId: string,
  name_meal: string,
  items: { food_item_id: string | null; food_id: string | null; amount_g: number }[]
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
          food_item_id: item.food_item_id ?? null,
          food_id: item.food_id ?? null,
          amount_g: item.amount_g,
        }))
      );
      if (itemsError) throw itemsError;
    }

    return normalizeMeal(mealRow as Record<string, unknown>);
  } catch (error) {
    if (__DEV__) console.error('Create meal with items error:', error);
    throw error;
  }
};

// ── AI Image Analysis ──────────────────────────────────────────────────────────

const AI_AGENT_URL = process.env.EXPO_PUBLIC_AI_AGENT_URL ?? '';

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
