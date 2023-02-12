//Convert user input into format used by API
export const convertCustomFood = food => {
  ret = {
    description: food.foodName || '',
    householdServingFullText: food.serving || '',
    servingSize: food.servingWeight || '',
    servingSizeUnit: `${food.servingUnit || ''}`.toLocaleUpperCase(),
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
