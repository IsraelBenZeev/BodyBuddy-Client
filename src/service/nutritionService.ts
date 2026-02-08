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
    food_item_id: row.food_item_id as string | undefined,
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
    const { data, error } = await supabase
      .from('nutrition_entries')
      .insert({
        user_id: payload.user_id,
        date: payload.date,
        food_name: payload.food_name,
        portion_size: Math.round(payload.portion_size),
        protein: Math.round(payload.protein),
        carbs: Math.round(payload.carbs),
        fat: Math.round(payload.fat),
        calories: Math.round(payload.calories),
        food_item_id: payload.food_item_id ?? null,
      })
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
  return {
    id: row.id as string,
    name: row.name as string,
    brand: row.brand as string | undefined,
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
