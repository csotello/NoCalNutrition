import {Flex, ScrollView, Spacer} from 'native-base';
import {useState, useEffect} from 'react';
import {Text, View, IconButton} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EncryptedStorage from 'react-native-encrypted-storage';
import Food from '../components/Food';
import AddFood from './AddFood';
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

  const add = (item, meal) => {
    cur = {
      Breakfast: [...food.Breakfast],
      Lunch: [...food.Lunch],
      Dinner: [...food.Dinner],
      Snacks: [...food.Snacks],
    };
    Object.entries(cur).forEach(([key, value]) => {
      item['UUID'] = crypto.randomUUID();
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
    meal = meal?.filter(cur => item.description !== cur.description);
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
      value = value?.filter(cur => food.UUID !== cur.UUID);
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
              newTotals.protein += nutrient.value;
              break;
            case 'Carbohydrate, by difference':
              newTotals.carbs += nutrient.value;
              break;
            case 'Total lipid (fat)':
              newTotals.fat += nutrient.value;
              break;
            default:
          }
        });
      });
    });
    setTotals({...newTotals});
  };

  return (
    <View>
      <Text>Nutrition</Text>
      <Flex direction="row">
        <Spacer />
        <View style={{padding: 1, margin: 2}}>
          <Text style={{paddingLeft: 10}}>P</Text>
          <Text>{totals.protein.toPrecision(3) || 0}</Text>
        </View>
        <Spacer />
        <View style={{padding: 1, margin: 2}}>
          <Text style={{paddingLeft: 10}}>C</Text>
          <Text>{totals.carbs.toPrecision(3) || 0}</Text>
        </View>
        <Spacer />
        <View style={{padding: 1, margin: 2}}>
          <Text style={{paddingLeft: 10}}>F</Text>
          <Text>{totals.fat.toPrecision(3) || 0}</Text>
        </View>
        <Spacer />
      </Flex>
      <ScrollView>
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
      </ScrollView>
      <IconButton
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
        right={15}
        top={450}
      />
      <AddFood
        info={{...modal}}
        setInfo={setModal}
        add={add}
        edit={editFood}
        close={() => setModal({...modal, isVisible: false})}
      />
    </View>
  );
};

export default Nutrition;
