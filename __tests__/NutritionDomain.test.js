import {
  calculateMacroCalories,
  calculateMacroTotals,
} from '../domain/nutrition';

function emptyNutritionDay() {
  return { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] };
}

it('aggregates macros across meals and applies each food serving count', () => {
  const nutrition = emptyNutritionDay();
  nutrition.Breakfast.push({
    servings: '2',
    foodNutrients: [
      { nutrientName: 'Protein', value: 3 },
      { nutrientName: 'Carbohydrate, by difference', value: 4 },
      { nutrientName: 'Total lipid (fat)', value: 1 },
    ],
  });
  nutrition.Lunch.push({
    servings: '0.5',
    foodNutrients: [
      { nutrientName: 'Protein', value: 2 },
      { nutrientName: 'Total lipid (fat)', value: 8 },
    ],
  });

  const totals = calculateMacroTotals(nutrition);

  expect(totals).toEqual({ protein: 7, carbs: 8, fat: 6 });
  expect(calculateMacroCalories(totals)).toBe(114);
});

it('treats missing serving counts as one and missing nutrients as zero', () => {
  const nutrition = emptyNutritionDay();
  nutrition.Dinner.push({
    foodNutrients: [{ nutrientName: 'Protein', value: 2.34 }],
  });

  expect(calculateMacroTotals(nutrition)).toEqual({
    protein: 2.3,
    carbs: 0,
    fat: 0,
  });
});

it('ignores invalid nutrient values and invalid or negative serving counts', () => {
  const nutrition = emptyNutritionDay();
  nutrition.Breakfast.push({
    servings: 'not a number',
    foodNutrients: [{ nutrientName: 'Protein', value: 5 }],
  });
  nutrition.Lunch.push({
    servings: '-1',
    foodNutrients: [{ nutrientName: 'Total lipid (fat)', value: 9 }],
  });
  nutrition.Dinner.push({
    servings: '1',
    foodNutrients: [{ nutrientName: 'Protein', value: NaN }],
  });

  expect(calculateMacroTotals(nutrition)).toEqual({
    protein: 0,
    carbs: 0,
    fat: 0,
  });
});
