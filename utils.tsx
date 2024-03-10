import EncryptedStorage from 'react-native-encrypted-storage';

export type NutrientValues = {
  [key: string]: Nutrient;
  protein: Nutrient;
  carbs: Nutrient;
  fat: Nutrient;
  sugar: Nutrient;
  fiber: Nutrient;
  sodium: Nutrient;
  saturatedFat: Nutrient;
  cholesterol: Nutrient;
};
export type FoodItem = {
  UUID?: string;
  description?: string;
  additionalDescriptions?: string;
  category?: string;
  brandName?: string;
  householdServingFullText?: string;
  servings?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients?: Nutrient[];
};

export type Nutrient = {
  nutrientName?: string;
  value?: number;
  unitName?: string;
};

/**
 * Convert user input into format used by API
 * @param {object} food - User input to convert
 * @return {object} Converted food
 */
export function convertCustomFood(food: any): FoodItem {
  console.log('Converting: ' + JSON.stringify(food));
  if (food.foodNutrients) {
    let nutrients: NutrientValues = getMainNutrients(food);
    Object.keys(nutrients).forEach(key => {
      food[key] = nutrients[key].value;
    });
  }
  let ret: any = {
    ...food,
    UUID: food.UUID || '',
    description: food.description || '',
    additionalDescriptions: food.additionalDescriptions || '',
    category: food.category || '',
    brandName: food.brandName || '',
    householdServingFullText: food.householdServingFullText || '',
    servings: food.servings || '',
    servingSize: food.servingSize || '',
    servingSizeUnit: `${food.servingSizeUnit || ''}`.toLocaleUpperCase(),
    foodNutrients: [
      {
        nutrientName: 'Protein',
        value: food.protein || 0,
        unitName: 'G',
      },
      {
        nutrientName: 'Total lipid (fat)',
        value: food.fat || 0,
        unitName: 'G',
      },
      {
        nutrientName: 'Carbohydrate, by difference',
        value: food.carbs || 0,
        unitName: 'G',
      },
      {
        nutrientName: 'Sugars, total including NLEA',
        value: food.sugar || 0,
        unitName: 'G',
      },
      {
        nutrientName: 'Fiber, total dietary',
        value: food.fiber || 0,
        unitName: 'G',
      },
      {
        nutrientName: 'Sodium, Na',
        value: food.sodium || 0,
        unitName: 'MG',
      },
      {
        nutrientName: 'Fatty acids, total saturated',
        value: food.saturatedFat || 0,
        unitName: 'G',
      },
      {
        nutrientName: 'Cholesterol',
        value: food.cholesterol || 0,
        unitName: 'MG',
      },
    ],
  };
  console.log('Converted: ', JSON.stringify(ret));
  return ret;
}

export const defaultFood = {
  description: 'Kroger Mexican Cheese',
  householdServingFullText: '1/4 cup',
  servingSize: 28,
  servingSizeUnit: 'G',
  foodNutrients: [
    {
      nutrientName: 'Protein',
      value: 12,
    },
    {
      nutrientName: 'Carbohydrate, by difference',
      value: 10,
    },
    {
      nutrientName: 'Total lipid (fat)',
      value: 8,
    },
  ],
};

/**
 * Stores a value in the encrypted storage.
 *
 * @param {string} key - the key to store the value under
 * @param {string} value - the value to be stored
 */
export async function store(key: string, value: string) {
  try {
    await EncryptedStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Retrieves a value from the encrypted storage.
 *
 * @param {string} key - the key to retrieve the value under
 * @return {string} the value retrieved
 */
export async function retrieve(key: string): Promise<string | null> {
  try {
    const val = await EncryptedStorage.getItem(key);
    return val;
  } catch (error) {
    console.log(error);
  }
  return null;
}

/**
 * Retrieves nutrient values from given food object
 *
 * @param {object} food - the food object
 * @returns {object} the nutrient values
 */
export function getMainNutrients(food: FoodItem): NutrientValues {
  let ret: NutrientValues = {
    protein: {value: 0},
    carbs: {value: 0},
    fat: {value: 0},
    sugar: {value: 0},
    fiber: {value: 0},
    sodium: {value: 0},
    saturatedFat: {value: 0},
    cholesterol: {value: 0},
  };
  food?.foodNutrients?.map((nutrient, i) => {
    switch (nutrient.nutrientName) {
      case 'Protein':
        ret.protein = {...nutrient};
        break;
      case 'Carbohydrate, by difference':
        ret.carbs = {...nutrient};
        break;
      case 'Total lipid (fat)':
        ret.fat = {...nutrient};
        break;
      case 'Sugars, total including NLEA':
        ret.sugar = {...nutrient};
        break;
      case 'Fiber, total dietary':
        ret.fiber = {...nutrient};
        break;
      case 'Sodium, Na':
        ret.sodium = {...nutrient};
        break;
      case 'Fatty acids, total saturated':
        ret.saturatedFat = {...nutrient};
        break;
      case 'Cholesterol':
        ret.cholesterol = {...nutrient};
        break;
      default:
        break;
    }
  });
  return {...ret};
}
