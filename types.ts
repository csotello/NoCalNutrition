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