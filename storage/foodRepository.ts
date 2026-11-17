import EncryptedStorage from 'react-native-encrypted-storage';
import type { FoodItem, Meal, Nutrient, NutritionDay } from '../types';

const nutritionMeals: Meal[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

type StoredRecord = Record<string, unknown>;

function isRecord(value: unknown): value is StoredRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === 'string';
}

function isOptionalNumberLike(value: unknown): boolean {
  if (value === undefined) return true;
  if (typeof value === 'number') return Number.isFinite(value);
  return (
    typeof value === 'string' &&
    (value.trim() === '' || Number.isFinite(Number(value)))
  );
}

function parseStoredJson(value: string, label: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch (error) {
    throw new Error(`Stored ${label} is not valid JSON: ${String(error)}`);
  }
}

function normalizeNutrient(value: unknown, label: string): Nutrient {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object.`);
  }
  if (
    !isOptionalString(value.nutrientName) ||
    !isOptionalString(value.unitName)
  ) {
    throw new Error(`${label} has invalid text fields.`);
  }
  if (
    value.value !== undefined &&
    (typeof value.value !== 'number' || !Number.isFinite(value.value))
  ) {
    throw new Error(`${label} must have a finite numeric value.`);
  }
  return { ...value } as Nutrient;
}

function normalizeFoodItem(value: unknown, label: string): FoodItem {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object.`);
  }

  const textFields = [
    'UUID',
    'description',
    'additionalDescriptions',
    'category',
    'brandName',
    'householdServingFullText',
    'servingSizeUnit',
  ];
  if (textFields.some(field => !isOptionalString(value[field]))) {
    throw new Error(`${label} has invalid text fields.`);
  }
  if (
    !isOptionalNumberLike(value.servings) ||
    !isOptionalNumberLike(value.servingSize)
  ) {
    throw new Error(`${label} has invalid serving values.`);
  }
  if (
    value.foodNutrients !== undefined &&
    !Array.isArray(value.foodNutrients)
  ) {
    throw new Error(`${label} nutrients must be an array.`);
  }

  const foodNutrients = Array.isArray(value.foodNutrients)
    ? value.foodNutrients.map((nutrient, index) =>
        normalizeNutrient(nutrient, `${label} nutrient ${index}`),
      )
    : undefined;

  return {
    ...value,
    ...(foodNutrients === undefined ? {} : { foodNutrients }),
  } as FoodItem;
}

function normalizeNutritionDay(value: unknown): NutritionDay {
  if (!isRecord(value)) {
    throw new Error('Stored nutrition data must be an object.');
  }

  const normalized: NutritionDay = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  };
  for (const meal of nutritionMeals) {
    const items = value[meal];
    if (items === undefined) continue;
    if (!Array.isArray(items)) {
      throw new Error(`Stored nutrition meal "${meal}" must be an array.`);
    }
    normalized[meal] = items.map((item, index) =>
      normalizeFoodItem(
        item,
        `Stored nutrition meal "${meal}" food ${index}`,
      ),
    );
  }
  return normalized;
}

function normalizeCustomFoods(value: unknown): FoodItem[] {
  if (!Array.isArray(value)) {
    throw new Error('Stored custom foods must be an array.');
  }
  return value.map((food, index) =>
    normalizeFoodItem(food, `Stored custom food ${index}`),
  );
}

function nutritionStorageKey(date: string): string {
  return `nutrition-${date}`;
}

export function emptyNutritionDay(): NutritionDay {
  return { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] };
}

export async function loadNutrition(date: string): Promise<NutritionDay> {
  const stored = await EncryptedStorage.getItem(nutritionStorageKey(date));
  if (stored === null) return emptyNutritionDay();
  return normalizeNutritionDay(
    parseStoredJson(stored, `nutrition for ${date}`),
  );
}

export async function saveNutrition(
  date: string,
  nutrition: NutritionDay,
): Promise<void> {
  const normalized = normalizeNutritionDay(nutrition);
  await EncryptedStorage.setItem(
    nutritionStorageKey(date),
    JSON.stringify(normalized),
  );
}

export async function loadCustomFoods(): Promise<FoodItem[]> {
  const stored = await EncryptedStorage.getItem('customFood');
  if (stored === null) return [];
  return normalizeCustomFoods(parseStoredJson(stored, 'custom foods'));
}

export async function saveCustomFoods(foods: FoodItem[]): Promise<void> {
  const normalized = normalizeCustomFoods(foods);
  await EncryptedStorage.setItem('customFood', JSON.stringify(normalized));
}
