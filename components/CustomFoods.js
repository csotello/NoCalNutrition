import {Button, ScrollView, View} from 'native-base';
import {useEffect, useMemo, useState} from 'react';
import {Text} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import SyncStorage from 'sync-storage';
const CustomFoods = props => {
  const [foods, setFoods] = useState([]);
  const [status, setStatus] = useState('loading');
  const load = async () => {
    try {
      const customFood = await EncryptedStorage.getItem('customFood');
      console.log('Custom: ' + customFood);
      console.log('Sync: ' + SyncStorage.get('customFood'));
      const val = JSON.parse(customFood);
      console.log(val);
      setFoods([...val]);
      setStatus(val.length === 0 ? 'empty' : 'loaded');
    } catch (error) {
      console.error('Failed to load');
      console.log(error);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const removeFood = async food => {
    var cur = foods.filter(
      item => JSON.stringify(item) !== JSON.stringify(food),
    );
    setFoods([...cur]);
    await EncryptedStorage.setItem('customFood', JSON.stringify(cur));
  };

  const displayFoods = food => {
    console.log(food);
    return (
      <View style={{borderRadius: 5, width: '100%', height: 50}}>
        <Text>{food.description}</Text>
        <Text>{food.householdServingFullText}</Text>
        <Button onPress={removeFood(food)} />
      </View>
    );
  };

  return (
    <>
      <Text>Custom Foods</Text>
      <ScrollView>
        {foods &&
          foods.map((item, i) => {
            return <View key={i}>{displayFoods(item)}</View>;
          })}
      </ScrollView>
    </>
  );
};

export default CustomFoods;
