import { Text, View, Pressable } from 'react-native';
import React from 'react';
import { SearchFood } from '../components/SearchFood';
import { CustomFoods } from '../components/CustomFoods';
import { EditFood } from '../components/EditFood';
import styles from '../styles/styles';
import { useEffect, useState } from 'react';
import uuid from 'uuid-random';
import {
  store,
  retrieve,
  convertCustomFood,
  emptyNutritionDay,
  loadNutrition,
  saveNutrition,
} from '../utils';
import { AddFoodPage, Meal, NutritionDay, RootStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type AddFoodProps = NativeStackScreenProps<RootStackParamList, 'AddFood'>;

export function AddFood({ navigation, route }: AddFoodProps) {
  const { page, isNew, food, date, isCustom } = route?.params;
  const [loaded, setLoaded] = useState(false);
  const [nutritionReady, setNutritionReady] = useState(false);
  const [nutrition, setNutrition] = useState<NutritionDay>(emptyNutritionDay);
  const tabs = [
    { label: 'Search', page: 'search' },
    { label: 'Custom Foods', page: 'custom' },
    { label: 'Create', page: 'edit' },
  ];
  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded]);

  /**
   * Load the nutrition data based on current date
   */
  async function load() {
    try {
      setNutrition(await loadNutrition(date));
      setNutritionReady(true);
    } catch (error) {
      setNutritionReady(false);
      console.error(`Failed to load nutrition for ${date}`, error);
    }
    if (!loaded) setLoaded(true);
  }

  /**
   * Adds an item to the nutrition tracking data for a specific meal.
   *
   * @param {object} item - The item to be added.
   * @param {string} meal - The meal to add the item to.
   */
  async function add(item: any, meal: Meal) {
    if (!nutritionReady)
      throw new Error('Nutrition data is not ready to save.');
    let cur: NutritionDay = {
      Breakfast: [...nutrition.Breakfast],
      Lunch: [...nutrition.Lunch],
      Dinner: [...nutrition.Dinner],
      Snacks: [...nutrition.Snacks],
    };
    console.log('cur:' + JSON.stringify(cur));
    item['UUID'] = uuid();
    cur[meal] = [...cur[meal], item];
    await saveNutrition(date, cur);
    console.log(JSON.stringify(cur));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          state: { routes: [{ name: 'Nutrition', params: { date: date } }] },
        },
      ],
    });
  }

  /**
   * Edits the nutrition data for a specific meal item.
   *
   * @param {object} item - The meal item to be edited.
   * @param {string} meal - The meal category to which the item belongs (e.g., Breakfast, Lunch, Dinner, Snacks).
   */
  async function edit(item: any, meal: Meal) {
    if (!nutritionReady)
      throw new Error('Nutrition data is not ready to save.');
    let cur: NutritionDay = {
      Breakfast: [...nutrition.Breakfast],
      Lunch: [...nutrition.Lunch],
      Dinner: [...nutrition.Dinner],
      Snacks: [...nutrition.Snacks],
    };
    cur.Breakfast = cur.Breakfast.filter(current => item.UUID !== current.UUID);
    cur.Lunch = cur.Lunch.filter(current => item.UUID !== current.UUID);
    cur.Dinner = cur.Dinner.filter(current => item.UUID !== current.UUID);
    cur.Snacks = cur.Snacks.filter(current => item.UUID !== current.UUID);
    cur[meal] = [...cur[meal], { ...item }];
    await saveNutrition(date, cur);
    console.log('Edited: ' + JSON.stringify(cur));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          state: { routes: [{ name: 'Nutrition', params: { date: date } }] },
        },
      ],
    });
  }

  /**
   * Edits data for a custom food
   *
   * @param {object} food - The food to be added.
   */
  async function editCustom(food: any) {
    let val = await retrieve('customFood');
    let customs;
    if (val) customs = JSON.parse(val);
    else customs = [];
    console.log('customs: ' + JSON.stringify(customs));
    customs = customs?.filter((cur: any) => food.UUID !== cur.UUID);
    console.log('Food: ' + JSON.stringify(food));
    let newFood = { ...food };
    newFood = convertCustomFood(food);
    customs.push({ ...newFood });
    console.log('customs: ' + JSON.stringify(customs));
    await store('customFood', JSON.stringify(customs));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          state: { routes: [{ name: 'Nutrition', params: { date: date } }] },
        },
      ],
    });
  }
  /**
   * Displays the current page
   *
   * @param {string} page - The page to display
   * @return {JSX.Element} - The page component
   */
  function displayPage(page: string): React.JSX.Element {
    switch (page) {
      case 'search':
        return <SearchFood date={date} />;
      case 'custom':
        return <CustomFoods date={date} />;
      case 'edit':
        return (
          <EditFood
            food={food}
            add={add}
            edit={edit}
            editCustom={editCustom}
            isNew={isNew}
            isCustom={isCustom}
          />
        );
      default:
        return <Text>Error</Text>;
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.addFood.tabs}>
        {tabs.map(tab => (
          <Pressable
            key={tab.page}
            accessibilityRole="button"
            accessibilityState={{ selected: page === tab.page }}
            style={[
              styles.addFood.tab,
              page === tab.page && styles.addFood.selectedTab,
            ]}
            onPress={() =>
              navigation.navigate('AddFood', {
                page: tab.page as AddFoodPage,
                isNew: true,
                food: {},
                isCustom: tab.page === 'edit',
                date,
              })
            }
          >
            <Text
              style={[
                styles.addFood.tabText,
                page === tab.page && styles.addFood.selectedTabText,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {displayPage(page)}
    </View>
  );
}
