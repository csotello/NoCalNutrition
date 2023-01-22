//Convert user input into format used by API
export const convertCustomFood = food => {
  ret = {
    description: food.foodName,
    householdServingFullText: food.serving,
    servingSize: food.servingWeight,
    servingSizeUnit: `${food.servingUnit}`.toLocaleUpperCase(),
    foodNutrients: [
      {
        nutrientName: 'Protein',
        value: food.protein,
        unitName: 'G',
      },
      {
        nutrientName: 'Total Lipid (fat)',
        value: food.totalFat,
        unitName: 'G',
      },
      {
        nutrientName: 'Carbohydrate, by difference',
        value: food.carbs,
        unitName: 'G',
      },
      {
        nutrientName: 'Sugars, total including NLEA',
        value: food.sugar,
        unitName: 'G',
      },
      {
        nutrientName: 'Fiber, total dietary',
        value: food.fiber,
        unitName: 'G',
      },
      {
        nutrientName: 'Sodium, Na',
        value: food.sodium,
        unitName: 'MG',
      },
      {
        nutrientName: 'Fatty acids, total saturated',
        value: food.saturatedFat,
        unitName: 'G',
      },
      {
        nutrientName: 'Cholesterol',
        value: food.cholesterol,
        unitName: 'MG',
      },
    ],
  };
  return ret;
};
