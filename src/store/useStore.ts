import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  StockIngredient,
  StockIngredientWithStatus,
  ExpiryStatus,
  Recipe,
  MatchedRecipe,
  UserPreferences,
  Ingredient,
  IngredientCategory,
} from '@/types';
import { INGREDIENTS, INGREDIENT_MAP } from '@/data/ingredients';
import { RECIPES } from '@/data/recipes';

interface StoreState {
  stockIngredients: StockIngredient[];
  preferences: UserPreferences;
  customIngredients: Ingredient[];

  addStockIngredient: (ingredientId: string, purchaseDate?: string) => void;
  removeStockIngredient: (ingredientId: string) => void;
  isInStock: (ingredientId: string) => boolean;
  updatePurchaseDate: (ingredientId: string, purchaseDate: string) => void;
  togglePreference: (key: keyof UserPreferences) => void;
  addCustomIngredient: (ingredient: Ingredient) => void;

  getAllIngredients: () => Ingredient[];
  getIngredientsByCategory: (category: IngredientCategory) => Ingredient[];
  getStockWithStatus: () => StockIngredientWithStatus[];
  getStockByStatus: () => {
    urgent: StockIngredientWithStatus[];
    warning: StockIngredientWithStatus[];
    fresh: StockIngredientWithStatus[];
    expired: StockIngredientWithStatus[];
  };
  getStockIds: () => string[];
  getMatchedRecipes: () => MatchedRecipe[];
  getFilteredRecipes: () => MatchedRecipe[];
}

const today = () => new Date().toISOString().split('T')[0];

const daysBetween = (dateStr1: string, dateStr2: string): number => {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diff = d2.getTime() - d1.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const getExpiryStatus = (remainingDays: number): ExpiryStatus => {
  if (remainingDays < 0) return 'expired';
  if (remainingDays <= 3) return 'urgent';
  if (remainingDays <= 7) return 'warning';
  return 'fresh';
};

const initialPreferences: UserPreferences = {
  onePot: false,
  quickMeal: false,
  lessDishes: false,
  vegetarian: false,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      stockIngredients: [],
      preferences: initialPreferences,
      customIngredients: [],

      addStockIngredient: (ingredientId, purchaseDate) => {
        const base = INGREDIENT_MAP[ingredientId] ||
          get().customIngredients.find(i => i.id === ingredientId);
        if (!base) return;
        if (get().isInStock(ingredientId)) return;

        const stock: StockIngredient = {
          ...base,
          purchaseDate: purchaseDate || today(),
        };
        set({ stockIngredients: [...get().stockIngredients, stock] });
      },

      removeStockIngredient: (ingredientId) => {
        set({
          stockIngredients: get().stockIngredients.filter(
            (s) => s.id !== ingredientId
          ),
        });
      },

      isInStock: (ingredientId) => {
        return get().stockIngredients.some((s) => s.id === ingredientId);
      },

      updatePurchaseDate: (ingredientId, purchaseDate) => {
        set({
          stockIngredients: get().stockIngredients.map((s) =>
            s.id === ingredientId ? { ...s, purchaseDate } : s
          ),
        });
      },

      togglePreference: (key) => {
        set({
          preferences: {
            ...get().preferences,
            [key]: !get().preferences[key],
          },
        });
      },

      addCustomIngredient: (ingredient) => {
        set({ customIngredients: [...get().customIngredients, ingredient] });
      },

      getAllIngredients: () => {
        return [...INGREDIENTS, ...get().customIngredients];
      },

      getIngredientsByCategory: (category) => {
        return get().getAllIngredients().filter((i) => i.category === category);
      },

      getStockWithStatus: () => {
        const now = today();
        return get().stockIngredients
          .map((s) => {
            const expiryDate = new Date(s.purchaseDate);
            expiryDate.setDate(expiryDate.getDate() + s.shelfLifeDays);
            const expiryStr = expiryDate.toISOString().split('T')[0];
            const remainingDays = daysBetween(now, expiryStr);
            return {
              ...s,
              remainingDays,
              status: getExpiryStatus(remainingDays),
            };
          })
          .sort((a, b) => a.remainingDays - b.remainingDays);
      },

      getStockByStatus: () => {
        const withStatus = get().getStockWithStatus();
        return {
          urgent: withStatus.filter((s) => s.status === 'urgent'),
          warning: withStatus.filter((s) => s.status === 'warning'),
          fresh: withStatus.filter((s) => s.status === 'fresh'),
          expired: withStatus.filter((s) => s.status === 'expired'),
        };
      },

      getStockIds: () => {
        return get().stockIngredients.map((s) => s.id);
      },

      getMatchedRecipes: () => {
        const stockIds = get().getStockIds();
        const matched: MatchedRecipe[] = [];

        for (const recipe of RECIPES) {
          const matchedIds = recipe.requiredIngredients.filter((id) =>
            stockIds.includes(id)
          );
          if (matchedIds.length === 0) continue;

          const matchPercentage = Math.round(
            (matchedIds.length / recipe.requiredIngredients.length) * 100
          );
          const missingIds = recipe.requiredIngredients.filter(
            (id) => !stockIds.includes(id)
          );

          matched.push({
            ...recipe,
            matchPercentage,
            matchedIngredients: matchedIds,
            missingIngredients: missingIds,
          });
        }

        return matched.sort((a, b) => {
          if (b.matchPercentage !== a.matchPercentage) {
            return b.matchPercentage - a.matchPercentage;
          }
          return a.cookTimeMinutes - b.cookTimeMinutes;
        });
      },

      getFilteredRecipes: () => {
        const { preferences } = get();
        let recipes = get().getMatchedRecipes();

        const prefEntries = Object.entries(preferences) as [keyof UserPreferences, boolean][];
        const activePrefs = prefEntries.filter(([, v]) => v);

        if (activePrefs.length === 0) return recipes;

        return recipes.filter((r) =>
          activePrefs.every(([key]) => {
            switch (key) {
              case 'onePot':
                return r.tags.onePot;
              case 'quickMeal':
                return r.tags.quickMeal;
              case 'lessDishes':
                return r.tags.lessDishes;
              case 'vegetarian':
                return r.tags.vegetarian;
              default:
                return true;
            }
          })
        );
      },
    }),
    {
      name: 'kitchen-rescue-storage',
      partialize: (state) => ({
        stockIngredients: state.stockIngredients,
        preferences: state.preferences,
        customIngredients: state.customIngredients,
      }),
    }
  )
);

export { RECIPES as RECIPE_DATA };
export const getIngredientById = (id: string): Ingredient | undefined => {
  return INGREDIENT_MAP[id];
};
