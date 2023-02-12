import {Button, ScrollView, View} from 'native-base';
import {useEffect, useState} from 'react';
import {Text} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
const CustomFoods = props => {
  const [foods, setFoods] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const load = async () => {
    try {
      const customFood = JSON.parse(
        await EncryptedStorage.getItem('customFood'),
      );
      console.log(customFood);
      setFoods(customFood === [] ? [] : customFood);
    } catch (error) {
      console.error('Failed to load');
      console.log(error);
    }
  };
  if (!loaded) {
    load();
    setLoaded(true);
  }

  const removeFood = async food => {
    var cur = foods.filter(
      item => JSON.stringify(item) !== JSON.stringify(food),
    );
    setFoods([...cur]);
    await EncryptedStorage.setItem('customFood', JSON.stringify(cur));
  };

  const displayFoods = food => {
    return (
      <View style={{elevation: 1}}>
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
            return <>{displayFoods(item)}</>;
          })}
      </ScrollView>
    </>
  );
};

export default CustomFoods;
