import { NavigatorScreenParams } from '@react-navigation/native';

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
  servings?: string | number;
  servingSize?: number | string;
  servingSizeUnit?: string;
  foodNutrients?: Nutrient[];
};

export type Nutrient = {
  nutrientName?: string;
  value?: number;
  unitName?: string;
};

export type Meal = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export type NutritionDay = Record<Meal, FoodItem[]>;

export type AddFoodPage = 'search' | 'custom' | 'edit';

export type MainTabParamList = {
  Nutrition: { date?: string } | undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Home: NavigatorScreenParams<MainTabParamList>;
  Habits: undefined;
  AddFood: {
    page: AddFoodPage;
    date: string;
    isNew: boolean;
    isCustom: boolean;
    food: FoodItem;
    meal?: Meal;
  };
};
