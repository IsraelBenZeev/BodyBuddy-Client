import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type FoodCategoryId = string;

export interface FoodCategoryOption {
  id: FoodCategoryId;
  label: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
}

/**
 * קטגוריות מזון ליצירת מזון – אייקון לפי קטגוריה ברשימה.
 * המשתמש יוסיף שדה category ל־food_items ב-DB.
 */
export const FOOD_CATEGORIES: FoodCategoryOption[] = [
  { id: 'bakery', label: 'מאפים', icon: 'bread-slice' },
  { id: 'dairy', label: 'מוצרי חלב', icon: 'cheese' },
  { id: 'sweets', label: 'ממתקים', icon: 'candy' },
  { id: 'salty_snacks', label: 'מלוחים', icon: 'food-variant' },
  { id: 'meat_poultry', label: 'בשר ועוף', icon: 'food-drumstick' },
  { id: 'fish', label: 'דגים', icon: 'fish' },
  { id: 'eggs', label: 'ביצים', icon: 'egg' },
  { id: 'legumes', label: 'קטניות', icon: 'sprout' },
  { id: 'vegetables', label: 'ירקות', icon: 'carrot' },
  { id: 'fruits', label: 'פירות', icon: 'fruit-watermelon' },
  { id: 'grains', label: 'דגנים', icon: 'grain' },
  { id: 'fats_oils', label: 'שומנים ושמנים', icon: 'bottle-tonic' },
  { id: 'beverages', label: 'משקאות', icon: 'cup-outline' },
  { id: 'protein_powder', label: 'אבקות חלבון', icon: 'dumbbell' },
  { id: 'protein_bars', label: 'חטיפי חלבון', icon: 'lightning-bolt' },
  { id: 'fast_food', label: 'מזון מהיר', icon: 'hamburger' },
  { id: 'spreads', label: 'ממרחים', icon: 'knife' },
  { id: 'sauces', label: 'רטבים', icon: 'food-variant' },
  { id: 'salads', label: 'סלטים', icon: 'bowl-mix' },
  { id: 'soups', label: 'מרקים', icon: 'pot-steam' },
  { id: 'nuts_seeds', label: 'אגוזים וגרעינים', icon: 'peanut' },
  { id: 'other', label: 'אחר', icon: 'dots-horizontal' },
];

const CATEGORY_MAP = new Map<FoodCategoryId, FoodCategoryOption>(
  FOOD_CATEGORIES.map((c) => [c.id, c])
);

export function getCategoryById(id: FoodCategoryId | null | undefined): FoodCategoryOption | null {
  if (!id) return null;
  return CATEGORY_MAP.get(id) ?? null;
}

export function getCategoryIconName(
  categoryId: FoodCategoryId | null | undefined
): ComponentProps<typeof MaterialCommunityIcons>['name'] {
  const cat = getCategoryById(categoryId);
  return cat?.icon ?? 'food-variant';
}
