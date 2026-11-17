import { mapNutrients } from './food';
import type { FoodItem, Meal, NutritionDay } from '../types';

export type MacroTotals = {
  protein: number;
  carbs: number;
  fat: number;
};

const meals: Meal[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

function finiteOrZero(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function servingsMultiplier(food: FoodItem): number {
  if (
    food.servings === undefined ||
    (typeof food.servings === 'string' && food.servings.trim() === '')
  ) {
    return 1;
  }

  const servings = Number(food.servings);
  return Number.isFinite(servings) && servings >= 0 ? servings : 0;
}

function roundToOneDecimal(value: number): number {
  return Number(value.toFixed(1));
}

/** Calculates daily macro totals, applying each food's serving count. */
export function calculateMacroTotals(nutrition: NutritionDay): MacroTotals {
  const totals: MacroTotals = { protein: 0, carbs: 0, fat: 0 };

  for (const meal of meals) {
    for (const food of nutrition[meal]) {
      const servingCount = servingsMultiplier(food);
      const nutrients = mapNutrients(food.foodNutrients);

      totals.protein += finiteOrZero(nutrients.protein.value) * servingCount;
      totals.carbs += finiteOrZero(nutrients.carbs.value) * servingCount;
      totals.fat += finiteOrZero(nutrients.fat.value) * servingCount;
    }
  }

  return {
    protein: roundToOneDecimal(totals.protein),
    carbs: roundToOneDecimal(totals.carbs),
    fat: roundToOneDecimal(totals.fat),
  };
}

/** Estimates calories from daily macro totals using 4/4/9 kcal per gram. */
export function calculateMacroCalories(totals: MacroTotals): number {
  return (
    finiteOrZero(totals.protein) * 4 +
    finiteOrZero(totals.carbs) * 4 +
    finiteOrZero(totals.fat) * 9
  );
}
