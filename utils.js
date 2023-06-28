import EncryptedStorage from 'react-native-encrypted-storage';

//Convert user input into format used by API
export const convertCustomFood = food => {
  ret = {
    description: food.description || '',
    brandName: food.brandName || '',
    householdServingFullText: food.householdServingFullText || '',
    servingSize: food.servingSize || '',
    servingSizeUnit: `${food.servingSizeUnit || ''}`.toLocaleUpperCase(),
    foodNutrients: [
      {
        nutrientName: 'Protein',
        value: food.protein || 0,
        unitName: 'G',
      },
      {
        nutrientName: 'Total Lipid (fat)',
        value: food.totalFat || 0,
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
  return ret;
};

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

export const getMainNutrients = food => {
  let ret = {};
  food?.foodNutrients?.map((nutrient, i) => {
    switch (nutrient.nutrientName) {
      case 'Protein':
        ret.protein = {...nutrient};
        break;
      case 'Carbohydrate, by difference':
        ret.carbs = {...nutrient};
        break;
      case 'Total Lipid (fat)':
        ret.totalFat = {...nutrient};
        break;
      default:
        break;
    }
  });
  return {...ret};
};
