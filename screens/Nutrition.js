import {Text, Flex, ScrollView, Spacer, IconButton, Button} from 'native-base';
import {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EncryptedStorage from 'react-native-encrypted-storage';
import Food from '../components/Food';
import styles from '../styles/styles';
import {retrieve} from '../utils';
import Nutrients from '../components/Nutrients';

const Nutrition = ({route, navigation}) => {
  const [loaded, setLoaded] = useState(false);
  const [totals, setTotals] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [food, setFood] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });
  const [date, setDate] = useState(
    route.params?.date || new Date().toDateString(),
  );
  useEffect(() => {
    if (!loaded) {
      load(date);
    }
    updateTotals();
  }, [loaded, load]);

  useEffect(() => {
    updateTotals();
  }, [food]);

  const load = async date => {
    let key = 'nutrition' + '-' + date;
    console.log(key);
    try {
      const val = JSON.parse(
        await EncryptedStorage.getItem('nutrition' + '-' + date),
      );
      if (val) {
        setFood({...val});
        console.log('Loaded: ' + JSON.stringify(val));
      }
    } catch (error) {
      console.log(error);
      console.log('Failed to load');
    }
    if (!loaded) setLoaded(true);
  };

  const store = async nutrition => {
    let key = 'nutrition' + '-' + date;
    console.log('key: ' + key);
    try {
      await EncryptedStorage.setItem(
        'nutrition' + '-' + date,
        JSON.stringify(nutrition),
      );
      console.log('Stored:' + JSON.stringify(nutrition));
    } catch (error) {
      console.log('Failed to store');
    }
  };

  const changeDate = async value => {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + value);
    newDate = newDate.toDateString();
    await store({...food});
    await load(newDate);
    setDate(newDate);
  };

  /**
   * Removes a specific item from a given section of the food object.
   *
   * @param {object} item - The item to be removed from the section.
   * @param {string} section - The section from which the item is to be removed.
   */
  const removeFood = (item, section) => {
    let meal = food[`${section}`];
    meal = meal?.filter(cur => item.UUID !== cur.UUID);
    let cur = {
      Breakfast: [...food.Breakfast],
      Lunch: [...food.Lunch],
      Dinner: [...food.Dinner],
      Snacks: [...food.Snacks],
    };
    cur[`${section}`] = [...meal];
    setFood({...cur});
    store({...cur});
  };

  /**
   * Opens the edit page for a specific food item.
   *
   * @param {Object} food - The food item to be edited.
   * @param {string} meal - The meal category of the food item.
   */
  const openEdit = (food, meal) => {
    navigation.navigate('AddFood', {
      page: 'edit',
      food: {...food, meal: meal},
      isNew: false,
      date: date,
    });
  };

  /**
   * Updates the totals of protein, fat, and carbs based on the food object.
   */
  const updateTotals = () => {
    let newTotals = {
      protein: 0,
      fat: 0,
      carbs: 0,
    };
    Object.keys(food).forEach(meal => {
      food[`${meal}`]?.map(food => {
        food.foodNutrients.map((nutrient, i) => {
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
  };

  return (
    <ScrollView
      style={{backgroundColor: styles.primaryBackgroundColor}}
      contentContainerStyle={{flexGrow: 1}}>
      <Text style={styles.header}>Nutrition</Text>
      <Flex direction="row">
        <Spacer />
        <IconButton
          variant="ghost"
          icon={<Icon name="chevron-left" size={20} />}
          onPress={async () => await changeDate(-1)}
        />
        <Spacer />
        <Text
          style={{
            color: 'white',
            textAlignVertical: 'center',
          }}>
          {date}
        </Text>
        <Spacer />
        <IconButton
          variant="ghost"
          icon={<Icon name="chevron-right" size={20} />}
          onPress={async () => await changeDate(1)}
        />
        <Spacer />
      </Flex>
      <Nutrients
        protein={totals.protein}
        fat={totals.fat}
        carbs={totals.carbs}
      />
      {Object.keys(food).map((meal, i) => {
        return (
          <Food
            meal={[...food[meal]]}
            title={meal}
            key={i}
            remove={removeFood}
            edit={openEdit}
          />
        );
      })}
      <IconButton
        testID="openModal"
        size={10}
        rounded="100"
        variant="solid"
        position={'absolute'}
        icon={<Icon name="plus" size={20} />}
        onPress={() =>
          navigation.navigate('AddFood', {
            page: 'search',
            isNew: true,
            date: date,
          })
        }
        zIndex={10}
        right={15}
        top={350}
      />
    </ScrollView>
  );
};

export default Nutrition;
