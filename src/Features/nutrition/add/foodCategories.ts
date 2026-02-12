import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type FoodCategoryId = string;

export interface FoodCategoryOption {
  id: FoodCategoryId;
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
}

/**
 * קטגוריות מזון ליצירת מזון – אייקון לפי קטגוריה ברשימה.
 * המשתמש יוסיף שדה category ל־food_items ב-DB.
 */
export const FOOD_CATEGORIES: FoodCategoryOption[] = [
  { id: 'bakery', label: 'מאפים', icon: 'pizza-outline' },
  { id: 'dairy', label: 'מוצרי חלב', icon: 'nutrition-outline' },
  { id: 'sweets', label: 'ממתקים', icon: 'ice-cream-outline' },
  { id: 'salty_snacks', label: 'מלוחים', icon: 'fast-food-outline' },
  { id: 'meat_poultry', label: 'בשר ועוף', icon: 'restaurant-outline' },
  { id: 'fish', label: 'דגים', icon: 'fish-outline' },
  { id: 'eggs', label: 'ביצים', icon: 'egg-outline' },
  { id: 'legumes', label: 'קטניות', icon: 'leaf-outline' },
  { id: 'vegetables', label: 'ירקות', icon: 'leaf-outline' },
  { id: 'fruits', label: 'פירות', icon: 'nutrition-outline' },
  { id: 'grains', label: 'דגנים', icon: 'nutrition-outline' },
  { id: 'fats_oils', label: 'שומנים ושמנים', icon: 'water-outline' },
  { id: 'beverages', label: 'משקאות', icon: 'water-outline' },
  { id: 'protein_powder', label: 'אבקות חלבון', icon: 'barbell-outline' },
  { id: 'protein_bars', label: 'חטיפי חלבון', icon: 'flash-outline' },
  { id: 'fast_food', label: 'מזון מהיר', icon: 'fast-food-outline' },
  { id: 'spreads', label: 'ממרחים', icon: 'color-palette-outline' },
  { id: 'sauces', label: 'רטבים', icon: 'water-outline' },
  { id: 'salads', label: 'סלטים', icon: 'leaf-outline' },
  { id: 'soups', label: 'מרקים', icon: 'water-outline' },
  { id: 'nuts_seeds', label: 'אגוזים וגרעינים', icon: 'disc-outline' },
  { id: 'other', label: 'אחר', icon: 'ellipsis-horizontal' },
];

const CATEGORY_MAP = new Map<FoodCategoryId, FoodCategoryOption>(
  FOOD_CATEGORIES.map((c) => [c.id, c])
);

export function getCategoryById(id: FoodCategoryId | null | undefined): FoodCategoryOption | null {
  if (!id) return null;
  return CATEGORY_MAP.get(id) ?? null;
}

export function getCategoryIconName(categoryId: FoodCategoryId | null | undefined): ComponentProps<typeof Ionicons>['name'] {
  const cat = getCategoryById(categoryId);
  return cat?.icon ?? 'nutrition-outline';
}
