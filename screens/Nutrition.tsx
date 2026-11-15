import { ScrollView } from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';
import { ToastAndroid, View, Text, Pressable } from 'react-native';
import { FontAwesome5 } from '@react-native-vector-icons/fontawesome5';
import { Food } from '../components/Food';
import styles from '../styles/styles';
import {
  FoodItem,
  Meal,
  NutritionDay,
  MainTabParamList,
  RootStackParamList,
  AddFoodPage,
} from '../types';
import Nutrients from '../components/Nutrients';
import { emptyNutritionDay, loadNutrition, saveNutrition } from '../utils';
import { CompositeScreenProps } from '@react-navigation/core';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type NutritionProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Nutrition'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function Nutrition({
  route,
  navigation,
}: NutritionProps): React.JSX.Element {
  const [dayReady, setDayReady] = useState(false);
  const [totals, setTotals] = useState<{ [key: string]: number }>({
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [food, setFood] = useState(emptyNutritionDay);
  const [date, setDate] = useState<string>(
    route.params?.date || new Date().toDateString(),
  );
  useEffect(() => {
    load(date);
    updateTotals();
  }, []);

  useEffect(() => {
    updateTotals();
  }, [food]);

  async function load(date: string) {
    try {
      setFood(await loadNutrition(date));
      setDayReady(true);
    } catch (error) {
      setDayReady(false);
      console.error(`Failed to load nutrition for ${date}`, error);
    }
  }

  async function changeDate(value: number) {
    if (!dayReady) return;
    try {
      await saveNutrition(date, food);
      let newDate = new Date(date);
      newDate.setDate(newDate.getDate() + value);
      const newDateString = newDate.toDateString();
      const newFood = await loadNutrition(newDateString);
      setFood(newFood);
      setDate(newDateString);
      setDayReady(true);
    } catch (error) {
      console.error(`Failed to save nutrition for ${date}`, error);
    }
  }

  /**
   * Removes a specific item from a given section of the food object.
   *
   * @param {object} item - The item to be removed from the section.
   * @param {string} section - The section from which the item is to be removed.
   */
  async function removeFood(item: any, section: Meal) {
    if (!dayReady) return;
    let meal = food[section];
    meal = meal?.filter((cur: any) => item.UUID !== cur.UUID);
    let cur: NutritionDay = {
      Breakfast: [...food.Breakfast],
      Lunch: [...food.Lunch],
      Dinner: [...food.Dinner],
      Snacks: [...food.Snacks],
    };
    cur[`${section}`] = [...meal];
    try {
      await saveNutrition(date, cur);
      setFood(cur);
    } catch (error) {
      console.error(`Failed to save nutrition for ${date}`, error);
    }
  }

  /**
   * Calculates the total number of calories based on the given protein, carbs, and fat values.
   *
   * @return {number} The total number of calories.
   */
  function getCalCount() {
    let count = 0;
    count += totals.protein * 4;
    count += totals.carbs * 4;
    count += totals.fat * 9;
    return count.toFixed(2);
  }

  /**
   * Opens the edit page for a specific food item.
   *
   * @param {Object} food - The food item to be edited.
   * @param {string} meal - The meal category of the food item.
   */
  function openEdit(food: any, meal: string) {
    navigation.navigate('AddFood', {
      page: 'edit' as AddFoodPage,
      food: { ...food, meal: meal },
      isNew: false,
      date: date,
      isCustom: false,
    });
  }

  /**
   * Updates the totals of protein, fat, and carbs based on the food object.
   */
  function updateTotals() {
    let newTotals: { [key: string]: number } = {
      protein: 0,
      fat: 0,
      carbs: 0,
    };
    Object.keys(food).forEach(meal => {
      food[meal as Meal]?.map((food: any) => {
        food.foodNutrients.map((nutrient: any, i: number) => {
          switch (nutrient.nutrientName) {
            case 'Protein':
              newTotals.protein +=
                Number(nutrient.value) * Number(food.servings);
              break;
            case 'Carbohydrate, by difference':
              newTotals.carbs += Number(nutrient.value) * Number(food.servings);
              break;
            case 'Total lipid (fat)':
              newTotals.fat += Number(nutrient.value) * Number(food.servings);
              break;
            default:
          }
        });
      });
    });
    Object.keys(newTotals).forEach(key => {
      newTotals[key] = Number(newTotals[key].toFixed(1));
    });
    setTotals({ ...newTotals });
  }
  return (
    <View style={styles.nutrition.screen}>
      <ScrollView contentContainerStyle={styles.nutrition.content}>
        <Text style={styles.nutrition.title}>Nutrition</Text>
        <View style={styles.nutrition.dateNavigation}>
          <Pressable
            testID="Previous Day"
            accessibilityRole="button"
            accessibilityLabel="Previous day"
            style={styles.nutrition.dateButton}
            onPress={() => changeDate(-1)}
          >
            <FontAwesome5
              name="chevron-left"
              size={17}
              iconStyle="solid"
              color={styles.colors.text}
            />
          </Pressable>
          <Text style={styles.nutrition.dateText}>{date}</Text>
          <Pressable
            testID="Next Day"
            accessibilityRole="button"
            accessibilityLabel="Next day"
            style={styles.nutrition.dateButton}
            onPress={() => changeDate(1)}
          >
            <FontAwesome5
              name="chevron-right"
              size={17}
              iconStyle="solid"
              color={styles.colors.text}
            />
          </Pressable>
        </View>
        <View style={styles.nutrition.summary}>
          <Nutrients
            Protein={totals.protein}
            Fat={totals.fat}
            Carbs={totals.carbs}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              ToastAndroid.show(
                'Calories: ' + getCalCount(),
                ToastAndroid.SHORT,
              )
            }
            style={styles.nutrition.caloriesButton}
          >
            <Text style={styles.nutrition.caloriesText}>Show Calories</Text>
          </Pressable>
        </View>
        {food &&
          Object.keys(food).map((meal, i) => {
            const info: FoodItem[] = food[meal as Meal];
            return (
              <Food
                meal={meal as Meal}
                foods={[...info]}
                key={i}
                remove={removeFood}
                edit={openEdit}
              />
            );
          })}
      </ScrollView>
      <Pressable
        testID="Add Food"
        accessibilityRole="button"
        accessibilityLabel="Add food"
        style={styles.nutrition.fab}
        onPress={() =>
          navigation.navigate('AddFood', {
            page: 'search' as AddFoodPage,
            isNew: true,
            date,
            isCustom: false,
            food: {},
          })
        }
      >
        <FontAwesome5
          name="plus"
          iconStyle="solid"
          color={styles.colors.background}
          size={22}
        />
      </Pressable>
    </View>
  );
}
