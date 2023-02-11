import {ScrollView} from 'native-base';
import {useState, useEffect} from 'react';
import {Text, View, Modal, Input, IconButton} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EncryptedStorage from 'react-native-encrypted-storage';
import Food from '../components/Food';
import CustomFood from '../components/CustomFood';
import SearchFood from '../components/SearchFood';
import AddFood from './AddFood';
const Nutrition = ({route}) => {
  const date = new Date().toDateString();
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setOpen] = useState(false);
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
      const val = await EncryptedStorage.getItem('nutrition');
      if (val) {
        setFood(JSON.parse(val));
        console.log('Loaded');
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
      await EncryptedStorage.setItem('nutrition', JSON.stringify(tasks));
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
        cur[key] = [...value];
      }
    });
    setFood({...cur});
    store({...cur});
  };

  return (
    <View>
      <Text>Nutrition</Text>
      <ScrollView>
        {Object.keys(food).map((meal, i) => {
          return <Food meal={[...food[meal]]} title={meal} key={i} />;
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
