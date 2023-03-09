import {Button, ScrollView, View} from 'native-base';
import {useEffect, useMemo, useState} from 'react';
import {Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
const CustomFoods = props => {
  const [foods, setFoods] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const load = async () => {
    try {
      const customFood = JSON.parse(
        await EncryptedStorage.getItem('customFood'),
      );
      console.log('Loaded: ' + customFood);
      setFoods(customFood ? [...customFood] : []);
      setLoaded(true);
    } catch (error) {
      console.error('Failed to load');
      console.log(error);
    }
  };
  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, []);

  const removeFood = async food => {
    var cur = foods.filter(
      item => JSON.stringify(item) !== JSON.stringify(food),
    );
    setFoods([...cur]);
    await EncryptedStorage.setItem('customFood', JSON.stringify(cur));
  };

  const displayFoods = food => {
    // console.log(food);
    return (
      <View
        style={{width: '100%', height: 50, borderRadius: 5, borderWidth: 3}}>
        <Text>{food.description || 'Food Description'}</Text>
        <Text>{food.householdServingFullText}</Text>
        <Button onPress={removeFood(food)}>Delete</Button>
      </View>
    );
  };

  return (
    <>
      <Text>Custom Foods</Text>
      <ScrollView
        style={{width: '100%', height: 100, borderRadius: 5, borderWidth: 3}}>
        {foods &&
          foods.map((item, i) => {
            return <View key={i}>{displayFoods(item)}</View>;
          })}
      </ScrollView>
    </>
  );
};

export default CustomFoods;
