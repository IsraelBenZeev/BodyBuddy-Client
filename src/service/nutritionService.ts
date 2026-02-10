import type { Meal, MealWithItems } from '@/src/types/meal';
import type {
  CreateNutritionEntryPayload,
  FoodItem,
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

/**
 * מנרמל רשומה מהדאטאבייס (id כ-bigint, ללא portion_unit).
 */
function normalizeNutritionEntry(row: Record<string, unknown>): NutritionEntry {
  const servingWeight = row.serving_weight;
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
    portion_unit: 'g',
    serving_weight:
      servingWeight != null && servingWeight !== '' ? Number(servingWeight) : undefined,
    food_item_id: row.food_item_id as string | undefined,
    group_id: (row.group_id as string | null) ?? undefined,
    group_name: (row.group_name as string | null) ?? undefined,
    created_at: row.created_at as string,
  };
}

/**
 * יוצר רשומת תזונה (הוספה ליומן היומי). ללא עדכון טבלת סיכום – הסיכום מחושב בצד הלקוח מ־nutrition_entries.
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
      protein: Math.round(payload.protein),
      carbs: Math.round(payload.carbs),
      fat: Math.round(payload.fat),
      calories: Math.round(payload.calories),
      food_item_id: payload.food_item_id ?? null,
      group_id: payload.group_id ?? null,
      group_name: payload.group_name ?? null,
    };
    if (payload.serving_weight != null && payload.serving_weight > 0) {
      insertRow.serving_weight = Math.round(payload.serving_weight);
    }
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
    const rows = payloads.map((p) => {
      const row: Record<string, unknown> = {
        user_id: p.user_id,
        date: p.date,
        food_name: p.food_name,
        portion_size: Math.round(p.portion_size),
        protein: Math.round(p.protein),
        carbs: Math.round(p.carbs),
        fat: Math.round(p.fat),
        calories: Math.round(p.calories),
        food_item_id: p.food_item_id ?? null,
        group_id: p.group_id ?? null,
        group_name: p.group_name ?? null,
      };
      if (p.serving_weight != null && p.serving_weight > 0) {
        row.serving_weight = Math.round(p.serving_weight);
      }
      return row;
    });
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
 * מוחק רשומת תזונה. הסיכום היומי מחושב מחדש בצד הלקוח מ־entries.
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
 * מחזיר את כל המאכלים שהמשתמש יכול לבחור: גלובליים (user_id null) + המאכלים שלו (user_id = userId).
 */
export const getFoodItems = async (userId: string): Promise<FoodItem[]> => {
  try {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(normalizeFoodItem);
  } catch (error) {
    console.error('Get food items error:', error);
    throw error;
  }
};

function normalizeFoodItem(row: Record<string, unknown>): FoodItem {
  const servingWeight = row.serving_weight;
  return {
    id: row.id as string,
    name: row.name as string,
    brand: row.brand as string | undefined,
    category: (row.category as string) ?? undefined,
    serving_weight:
      servingWeight != null && servingWeight !== '' ? Number(servingWeight) : undefined,
    protein_per_100: Number(row.protein_per_100 ?? 0),
    carbs_per_100: Number(row.carbs_per_100 ?? 0),
    fat_per_100: Number(row.fat_per_100 ?? 0),
    calories_per_100: Number(row.calories_per_100 ?? 0),
    is_verified: Boolean(row.is_verified),
    is_custom: Boolean(row.is_custom),
    user_id: row.user_id as string | undefined,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

/**
 * מוסיף מאכל חדש ל־food_items (ואז המשתמש יכול להוסיף אותו ל־nutrition_entries).
 */
export const createFoodItem = async (
  userId: string,
  foodData: {
    name: string;
    category?: string;
    serving_weight?: number;
    protein_per_100: number;
    carbs_per_100: number;
    fat_per_100: number;
    calories_per_100: number;
  },
): Promise<FoodItem> => {
  try {
    const { data, error } = await supabase
      .from('food_items')
      .insert({
        user_id: userId,
        is_custom: true,
        is_verified: false,
        ...foodData,
      })
      .select()
      .single();

    if (error) throw error;
    return normalizeFoodItem(data as Record<string, unknown>);
  } catch (error) {
    console.error('Create food item error:', error);
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
          food_items ( name, calories_per_100, protein_per_100, carbs_per_100, fat_per_100, serving_weight )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (mealsError) throw mealsError;

    return (mealsData ?? []).map((row: Record<string, unknown>) => {
      const meal = normalizeMeal(row);
      const rawItems = (row.meal_items as Record<string, unknown>[] | null) ?? [];
      const meal_items = rawItems.map((mi: Record<string, unknown>) => {
        const food_item = (mi.food_items ?? mi.food_item) as Record<string, unknown> | null;
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
                  calories_per_100: Number(food_item.calories_per_100 ?? 0),
                  protein_per_100: Number(food_item.protein_per_100 ?? 0),
                  carbs_per_100: Number(food_item.carbs_per_100 ?? 0),
                  fat_per_100: Number(food_item.fat_per_100 ?? 0),
                  serving_weight: Number(food_item.serving_weight ?? 100),
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
 * יוצר ארוחה חדשה עם פריטים (מזונות + כמות בגרם).
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
