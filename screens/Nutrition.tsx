import { ScrollView } from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';
import { ToastAndroid, View, Text, Pressable } from 'react-native';
import { FontAwesome5 } from '@react-native-vector-icons/fontawesome5';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Food } from '../components/Food';
import styles from '../styles/styles';
// import { retrieve } from '../utils';
import { FoodItem } from '../types';
import Nutrients from '../components/Nutrients';

function emptyNutrition(): { [key: string]: any[] } {
  return {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  };
}

export function Nutrition({ route, navigation }: any): React.JSX.Element {
  const [loaded, setLoaded] = useState(false);
  const [totals, setTotals] = useState<{ [key: string]: number }>({
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [food, setFood] = useState<{ [key: string]: any[] }>(emptyNutrition);
  const [date, setDate] = useState<string>(
    route.params?.date || new Date().toDateString(),
  );
  useEffect(() => {
    if (!loaded) {
      load(date);
      setLoaded(true);
    }
    updateTotals();
  }, []);

  useEffect(() => {
    updateTotals();
  }, [food]);

  async function load(date: string) {
    let key = 'nutrition' + '-' + date;
    console.log('Loading: ' + key);
    try {
      let val = await EncryptedStorage.getItem('nutrition' + '-' + date);
      if (val) {
        setFood(JSON.parse(val));
        console.log('Loaded: ', val);
      } else {
        setFood(emptyNutrition());
      }
    } catch (error) {
      setFood(emptyNutrition());
      console.log(error);
      console.log('Failed to load');
    }
    if (!loaded) setLoaded(true);
  }

  async function store(nutrition: any) {
    let key = 'nutrition' + '-' + date;
    console.log('Storing: ' + key);
    try {
      await EncryptedStorage.setItem(
        'nutrition' + '-' + date,
        JSON.stringify(nutrition),
      );
      console.log('Stored:' + JSON.stringify(nutrition));
    } catch (error) {
      console.log('Failed to store');
    }
  }

  async function changeDate(value: number) {
    await store({ ...food });
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + value);
    let ret = newDate.toDateString();
    await load(ret);
    setDate(newDate.toDateString());
  }

  /**
   * Removes a specific item from a given section of the food object.
   *
   * @param {object} item - The item to be removed from the section.
   * @param {string} section - The section from which the item is to be removed.
   */
  function removeFood(item: any, section: string) {
    let meal = food[`${section}`];
    meal = meal?.filter((cur: any) => item.UUID !== cur.UUID);
    let cur: { [key: string]: any } = {
      Breakfast: [...food.Breakfast],
      Lunch: [...food.Lunch],
      Dinner: [...food.Dinner],
      Snacks: [...food.Snacks],
    };
    cur[`${section}`] = [...meal];
    setFood({ ...cur });
    store({ ...cur });
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
      page: 'edit',
      food: { ...food, meal: meal },
      isNew: false,
      date: date,
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
      food[`${meal}`]?.map((food: any) => {
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
            const info: FoodItem[] = food[meal];
            return (
              <Food
                meal={[...info]}
                title={meal}
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
          navigation.navigate('AddFood', { page: 'search', isNew: true, date })
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
