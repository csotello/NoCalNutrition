import {ScrollView} from 'native-base';
import {useState, useEffect} from 'react';
import {Text, View, IconButton} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EncryptedStorage from 'react-native-encrypted-storage';
import Food from '../components/Food';
import AddFood from './AddFood';
const Nutrition = ({route}) => {
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
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
  }, [load]);

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

  return (
    <View>
      <Text>Nutrition</Text>
      <ScrollView>
        {Object.keys(food).map((meal, i) => {
          return (
            <Food
              meal={[...food[meal]]}
              title={meal}
              key={i}
              remove={removeFood}
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
        onPress={() => setVisible(prev => !prev)}
        right={15}
        top={450}
      />
      <AddFood isOpen={visible} add={add} close={() => setVisible(false)} />
    </View>
  );
};

export default Nutrition;
