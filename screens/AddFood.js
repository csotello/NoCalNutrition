import {Text, View} from 'react-native';
import {Flex, IconButton, Modal} from 'native-base';
import SearchFood from '../components/SearchFood';
import CustomFoods from '../components/CustomFoods';
import EditFood from '../components/EditFood';
import styles from '../styles/styles';
import {useEffect, useState} from 'react';
import uuid from 'uuid-random';
import {store, retrieve, convertCustomFood} from '../utils';
import Icon from 'react-native-vector-icons/FontAwesome5';

const AddFood = ({navigation, route}) => {
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
  const load = async () => {
    console.log(key);
    const val = JSON.parse(await retrieve('nutrition' + '-' + date));
    if (val) {
      setNutrition({...val});
      console.log('Loaded: ' + val);
    }
    if (!loaded) setLoaded(true);
  };

  /**
   * Adds an item to the nutrition tracking data for a specific meal.
   *
   * @param {object} item - The item to be added.
   * @param {string} meal - The meal to add the item to.
   */
  const add = async (item, meal) => {
    // console.log('item: ' + item);
    // console.log('meal: ' + meal);
    // let key = 'nutrition' + '-' + date;
    // let cur = await retrieve(key);
    // cur = JSON.parse(cur);
    cur = {
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
  };

  /**
   * Edits the nutrition data for a specific meal item.
   *
   * @param {object} item - The meal item to be edited.
   * @param {string} meal - The meal category to which the item belongs (e.g., Breakfast, Lunch, Dinner, Snacks).
   */
  const edit = async (item, meal) => {
    let cur = {
      Breakfast: [...nutrition.Breakfast],
      Lunch: [...nutrition.Lunch],
      Dinner: [...nutrition.Dinner],
      Snacks: [...nutrition.Snacks],
    };
    Object.entries(cur).forEach(([key, value]) => {
      value = value?.filter(cur => item.UUID !== cur.UUID);
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
  };
  /**
   * Edits data for a custom food
   *
   * @param {object} food - The food to be added.
   */
  const editCustom = async food => {
    let customs = JSON.parse(await retrieve('customFood'));
    console.log('customs: ' + JSON.stringify(customs));
    customs = customs?.filter(cur => food.UUID !== cur.UUID);
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
  };
  /**
   * Displays the current page
   *
   * @param {string} page - The page to display
   * @return {JSX.Element} - The page component
   */
  const displayPage = page => {
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
  };

  return (
    <View
      style={{backgroundColor: styles.primaryBackgroundColor, height: '100%'}}>
      <Flex direction="row">
        <Text
          style={styles.modalTab}
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
          style={styles.modalTab}
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
          style={styles.modalTab}
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
      </Flex>
      {displayPage(page)}
    </View>
  );
};

export default AddFood;
