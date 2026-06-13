export type IngredientCategory = 'vegetable' | 'protein' | 'staple' | 'seasoning';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  emoji: string;
  shelfLifeDays: number;
}

export interface StockIngredient extends Ingredient {
  purchaseDate: string;
  quantity?: string;
}

export type ExpiryStatus = 'fresh' | 'warning' | 'urgent' | 'expired';

export interface StockIngredientWithStatus extends StockIngredient {
  remainingDays: number;
  status: ExpiryStatus;
}

export interface RecipeTags {
  onePot: boolean;
  quickMeal: boolean;
  lessDishes: boolean;
  vegetarian: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  coverEmoji: string;
  requiredIngredients: string[];
  steps: string[];
  cookTimeMinutes: number;
  potCount: number;
  dishCount: number;
  tags: RecipeTags;
  description?: string;
}

export interface MatchedRecipe extends Recipe {
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface UserPreferences {
  onePot: boolean;
  quickMeal: boolean;
  lessDishes: boolean;
  vegetarian: boolean;
}

export type FilterKey = 'onePot' | 'quickMeal' | 'lessDishes' | 'vegetarian';
