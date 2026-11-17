import type { Nutrient, NutrientValues } from '../types';

type MainNutrientKey =
  | 'protein'
  | 'carbs'
  | 'fat'
  | 'sugar'
  | 'fiber'
  | 'sodium'
  | 'saturatedFat'
  | 'cholesterol';

const keyByName: Record<string, MainNutrientKey> = {
  protein: 'protein',
  'carbohydrate, by difference': 'carbs',
  'total lipid (fat)': 'fat',
  'sugars, total including nlea': 'sugar',
  'total sugars': 'sugar',
  'fiber, total dietary': 'fiber',
  'sodium, na': 'sodium',
  'fatty acids, total saturated': 'saturatedFat',
  cholesterol: 'cholesterol',
};

export function mapNutrients(
  nutrients: readonly Nutrient[] = [],
): NutrientValues {
  const values: NutrientValues = {
    protein: { value: 0 },
    carbs: { value: 0 },
    fat: { value: 0 },
    sugar: { value: 0 },
    fiber: { value: 0 },
    sodium: { value: 0 },
    saturatedFat: { value: 0 },
    cholesterol: { value: 0 },
  };

  for (const nutrient of nutrients) {
    const name = nutrient.nutrientName?.trim().toLowerCase();
    const key = name ? keyByName[name] : undefined;

    if (key) {
      values[key] = {
        ...nutrient,
        value:
          typeof nutrient.value === 'number' && Number.isFinite(nutrient.value)
            ? nutrient.value
            : 0,
      };
    }
  }

  return values;
}
