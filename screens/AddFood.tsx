import {Text, View} from 'react-native';
import {HStack, Modal} from '@gluestack-ui/themed';
import {SearchFood} from '../components/SearchFood';
import {CustomFoods} from '../components/CustomFoods';
import {EditFood} from '../components/EditFood';
import styles from '../styles/styles';
import {useEffect, useState} from 'react';
import uuid from 'uuid-random';
import {store, retrieve, convertCustomFood} from '../utils';
import Icon from 'react-native-vector-icons/FontAwesome5';

export function AddFood({navigation, route}: any) {
  const {page, isNew, food, date, isCustom} = route.params;
  const [loaded, setLoaded] = useState(false);
  const [nutrition, setNutrition] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });
  const key = 'nutrition' + '-' + date;
  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded]);

  /**
   * Load the nutrition data based on current date
   */
  async function load() {
    console.log(key);
    let val = await retrieve('nutrition' + '-' + date);
    let ret;
    if (val) {
      ret = JSON.parse(val);
    }
    if (ret) {
      setNutrition({...ret});
      console.log('Loaded: ' + val);
    }
    if (!loaded) setLoaded(true);
  }

  /**
   * Adds an item to the nutrition tracking data for a specific meal.
   *
   * @param {object} item - The item to be added.
   * @param {string} meal - The meal to add the item to.
   */
  async function add(item: any, meal: string) {
    // console.log('item: ' + item);
    // console.log('meal: ' + meal);
    // let key = 'nutrition' + '-' + date;
    // let cur = await retrieve(key);
    // cur = JSON.parse(cur);
    let cur: {[key: string]: any} = {
      Breakfast: [...nutrition.Breakfast],
      Lunch: [...nutrition.Lunch],
      Dinner: [...nutrition.Dinner],
      Snacks: [...nutrition.Snacks],
    };
    console.log('cur:' + JSON.stringify(cur));
    item['UUID'] = uuid();
    Object.entries(cur).forEach(([key, value]) => {
      if (key === meal) {
        value = value === undefined ? [item] : [...value, item];
        console.log('key: ' + key + ' value: ' + JSON.stringify(value));
        cur[key] = [...value];
      }
    });
    await store(key, JSON.stringify(cur));
    console.log(JSON.stringify(cur));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          state: {routes: [{name: 'Nutrition', params: {date: date}}]},
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
  async function edit(item: any, meal: string) {
    let cur: {[key: string]: any} = {
      Breakfast: [...nutrition.Breakfast],
      Lunch: [...nutrition.Lunch],
      Dinner: [...nutrition.Dinner],
      Snacks: [...nutrition.Snacks],
    };
    Object.entries(cur).forEach(([key, value]) => {
      value = value?.filter((cur: any) => item.UUID !== cur.UUID);
      if (key === meal) value.push({...item});
      cur[key] = [...value];
    });
    await store(key, JSON.stringify(cur));
    console.log('Edited: ' + JSON.stringify(cur));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          state: {routes: [{name: 'Nutrition', params: {date: date}}]},
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
    let newFood = {...food};
    newFood = convertCustomFood(food);
    customs.push({...newFood});
    console.log('customs: ' + JSON.stringify(customs));
    await store('customFood', JSON.stringify(customs));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          state: {routes: [{name: 'Nutrition', params: {date: date}}]},
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
  function displayPage(page: string): JSX.Element {
    switch (page) {
      case 'search':
        return <SearchFood date={date} />;
      case 'custom':
        return <CustomFoods add={add} date={date} />;
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
    <View
      style={{backgroundColor: styles.primaryBackgroundColor, height: '100%'}}>
      <HStack>
        <Text
          style={{
            width: '34%',
            padding: 10,
            justifyContent: 'center',
            marginBottom: 10,
            textAlign: 'center',
            borderColor: 'grey',
            elevation: 1,
            color: 'white',
          }}
          onPress={() =>
            navigation.navigate('AddFood', {
              page: 'search',
              isNew: true,
              date: date,
            })
          }>
          Search
        </Text>
        <Text
          style={{
            width: '34%',
            padding: 10,
            justifyContent: 'center',
            marginBottom: 10,
            textAlign: 'center',
            borderColor: 'grey',
            elevation: 1,
            color: 'white',
          }}
          onPress={() =>
            navigation.navigate('AddFood', {
              page: 'custom',
              isNew: true,
              date: date,
            })
          }>
          Custom Foods
        </Text>
        <Text
          style={{
            width: '34%',
            padding: 10,
            justifyContent: 'center',
            marginBottom: 10,
            textAlign: 'center',
            borderColor: 'grey',
            elevation: 1,
            color: 'white',
          }}
          onPress={() =>
            navigation.navigate('AddFood', {
              page: 'edit',
              isNew: true,
              food: {},
              date: date,
              isCustom: true,
            })
          }>
          Create
        </Text>
      </HStack>
      {displayPage(page)}
    </View>
  );
}
