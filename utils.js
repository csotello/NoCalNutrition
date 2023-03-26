import EncryptedStorage from 'react-native-encrypted-storage';
export const backgroundColor = 'rgb(111, 220, 111)';

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
  name: '',
  description: '',
};

export const store = async (key, value) => {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
    // console.log('Stored:' + JSON.stringify(value));
  } catch (error) {
    console.log('Failed to store');
  }
};

export const retrieve = async key => {
  return JSON.parse(await EncryptedStorage.getItem(key));
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
