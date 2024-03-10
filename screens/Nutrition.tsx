import {
  Text,
  // ScrollView,
  Button,
  HStack,
  ButtonIcon,
} from '@gluestack-ui/themed';
import {ScrollView} from 'react-native';
import React from 'react';
import {useState, useEffect} from 'react';
import {ToastAndroid, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Food} from '../components/Food';
import styles from '../styles/styles';
import {retrieve, FoodItem} from '../utils';
import Nutrients from '../components/Nutrients';

export function Nutrition({route, navigation}: any): JSX.Element {
  const [loaded, setLoaded] = useState(false);
  const [totals, setTotals] = useState<{[key: string]: number}>({
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [food, setFood] = useState<{[key: string]: any[]}>({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });
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
      let ret;
      if (val) {
        ret = JSON.parse(val);
        setFood(ret);
        console.log('Loaded: ', val);
      }
    } catch (error) {
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
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + value);
    let ret = newDate.toDateString();
    await store({...food});
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
    let cur: {[key: string]: any} = {
      Breakfast: [...food.Breakfast],
      Lunch: [...food.Lunch],
      Dinner: [...food.Dinner],
      Snacks: [...food.Snacks],
    };
    cur[`${section}`] = [...meal];
    setFood({...cur});
    store({...cur});
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
      food: {...food, meal: meal},
      isNew: false,
      date: date,
    });
  }

  /**
   * Updates the totals of protein, fat, and carbs based on the food object.
   */
  function updateTotals() {
    let newTotals: {[key: string]: number} = {
      protein: 0,
      fat: 0,
      carbs: 0,
    };
    Object.keys(food).forEach(meal => {
      food[`${meal}`]?.map((food: any) => {
        food.foodNutrients.map((nutrient: any, i: number) => {
          switch (nutrient.nutrientName) {
            case 'Protein':
              newTotals.protein += Number(nutrient.value);
              break;
            case 'Carbohydrate, by difference':
              newTotals.carbs += Number(nutrient.value);
              break;
            case 'Total lipid (fat)':
              newTotals.fat += Number(nutrient.value);
              break;
            default:
          }
        });
      });
    });
    Object.keys(newTotals).forEach(key => {
      newTotals[key] = Number(newTotals[key].toFixed(1));
    });
    setTotals({...newTotals});
  }

  return (
    <ScrollView
      style={{backgroundColor: styles.primaryBackgroundColor}}
      contentContainerStyle={{flexGrow: 1}}>
      <Text style={{color: 'white', textAlign: 'center'}}>Nutrition</Text>
      <HStack style={{padding: 10, justifyContent: 'center'}}>
        <Icon.Button
          name="chevron-left"
          size={20}
          backgroundColor={styles.primaryBackgroundColor}
          style={{color: 'white'}}
          onPress={() => changeDate(-1)}
        />
        <Text
          style={{
            color: 'white',
            textAlignVertical: 'center',
          }}>
          {date}
        </Text>
        <Icon.Button
          name="chevron-right"
          size={20}
          backgroundColor={styles.primaryBackgroundColor}
          onPress={() => changeDate(1)}
        />
      </HStack>
      <Nutrients
        protein={totals.protein}
        fat={totals.fat}
        carbs={totals.carbs}
      />
      <Button
        style={{margin: 10}}
        variant="link"
        onPress={() =>
          ToastAndroid.show('Calories: ' + getCalCount(), ToastAndroid.SHORT)
        }>
        <Text style={{color: 'white', textAlign: 'center'}}>Show Calories</Text>
      </Button>
      {food &&
        Object.keys(food || {})?.map((meal, i) => {
          let info: FoodItem[] = food[meal];
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
      <View style={{position: 'absolute', top: 450, left: 350}}>
        <Icon.Button
          name="plus"
          backgroundColor={styles.primaryBackgroundColor}
          size={30}
          style={{
            zIndex: 10,
          }}
          onPress={() => {
            navigation.navigate('AddFood', {
              page: 'search',
              isNew: true,
              date: date,
            });
          }}
        />
      </View>
    </ScrollView>
  );
}
