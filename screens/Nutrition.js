import {Text, Flex, ScrollView, Spacer, View, IconButton} from 'native-base';
import {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EncryptedStorage from 'react-native-encrypted-storage';
import Food from '../components/Food';
import AddFood from './AddFood';
import uuid from 'uuid-random';
import styles from '../styles/styles';

const Nutrition = ({route}) => {
  const [modal, setModal] = useState({
    page: 'search',
    data: {},
    isVisible: false,
    isNew: true,
  });
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
  const [date, setDate] = useState(new Date().toDateString());

  useEffect(() => {
    if (!loaded) {
      load();
    }
    updateTotals();
  }, [load, food]);

  const load = async () => {
    try {
      const val = JSON.parse(await EncryptedStorage.getItem('nutrition'));
      if (val) {
        setFood({...val});
        console.log('Loaded: ' + val);
      }
    } catch (error) {
      console.log(error);
      console.log('Failed to load');
    }
  };
  if (!loaded) {
    load();
    setLoaded(true);
  }

  const store = async nutrition => {
    try {
      await EncryptedStorage.setItem('nutrition', JSON.stringify(nutrition));
      console.log('Stored:' + JSON.stringify(nutrition));
    } catch (error) {
      console.log('Failed to store');
    }
  };

  const changeDate = value => {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + value);
    setDate(newDate.toDateString());
  };

  const add = (item, meal) => {
    cur = {
      Breakfast: [...food.Breakfast],
      Lunch: [...food.Lunch],
      Dinner: [...food.Dinner],
      Snacks: [...food.Snacks],
    };
    Object.entries(cur).forEach(([key, value]) => {
      item['UUID'] = uuid();
      if (key === meal) {
        value = value === undefined ? [item] : [...value, item];
        console.log('key: ' + key + ' value: ' + value);
        cur[key] = [...value];
      }
    });
    setFood({...cur});
    store({...cur});
  };

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

  const openEdit = (food, meal) => {
    setModal({
      page: 'edit',
      data: {...food, meal: meal},
      isVisible: true,
      isNew: false,
    });
  };

  const editFood = (item, meal) => {
    let cur = {
      Breakfast: [...food.Breakfast],
      Lunch: [...food.Lunch],
      Dinner: [...food.Dinner],
      Snacks: [...food.Snacks],
    };
    Object.entries(cur).forEach(([key, value]) => {
      value = value?.filter(cur => item.UUID !== cur.UUID);
      if (key === meal) value.push({...item});
      cur[key] = [...value];
    });
    setFood({...cur});
    store({...cur});
  };

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
    setTotals({...newTotals});
  };

  const displayNutrients = () => {
    return (
      <Flex direction="row">
        <Spacer />
        <Text style={{...styles.nutrient, color: '#d10415'}}>
          P{'\n'}
          {totals.protein || 0}
        </Text>
        <Spacer />
        <Text style={{...styles.nutrient, color: '#0426d1'}}>
          C{'\n'}
          {totals.carbs || 0}
        </Text>
        <Spacer />
        <Text style={{...styles.nutrient, color: '#c7d104'}}>
          F{'\n'}
          {totals.fat || 0}
        </Text>
        <Spacer />
      </Flex>
    );
  };

  return (
    <ScrollView style={{backgroundColor: styles.primaryBackgroundColor}}>
      <Text style={styles.header}>Nutrition</Text>
      <Flex direction="row">
        <Spacer />
        <IconButton
          variant="ghost"
          icon={<Icon name="chevron-left" size={20} />}
          onPress={() => changeDate(-1)}
        />
        <Spacer />
        <Text style={{color: 'white', textAlign: 'center'}}>{date}</Text>
        <Spacer />
        <IconButton
          variant="ghost"
          icon={<Icon name="chevron-right" size={20} />}
          onPress={() => changeDate(1)}
        />
        <Spacer />
      </Flex>
      {displayNutrients()}
      <View>
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
      </View>
      <IconButton
        testID="openModal"
        size={10}
        rounded="100"
        variant="solid"
        position={'absolute'}
        icon={<Icon name="plus" size={20} />}
        onPress={() =>
          setModal(() => {
            return {...modal, isVisible: !modal.isVisible, page: 'search'};
          })
        }
        zIndex={10}
        right={15}
        top={350}
      />
      <AddFood
        testID="AddFood"
        info={{...modal}}
        setInfo={setModal}
        add={add}
        edit={editFood}
        close={() => setModal({...modal, isVisible: false})}
      />
    </ScrollView>
  );
};

export default Nutrition;
