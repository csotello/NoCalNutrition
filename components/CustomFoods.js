import {Flex, IconButton, ScrollView, View} from 'native-base';
import {useEffect, useState} from 'react';
import {Text} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
const CustomFoods = props => {
  const [foods, setFoods] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    try {
      const customFood = JSON.parse(
        await EncryptedStorage.getItem('customFood'),
      );
      console.log('Loaded: ' + customFood);
      if (customFood) setFoods([...customFood]);
    } catch (error) {
      console.error('Failed to load');
      console.log(error);
    }
  };
  useEffect(() => {
    if (!loaded) {
      load();
      setLoaded(true);
    }
  }, []);

  const store = async foods => {
    try {
      await EncryptedStorage.setItem('customFood', JSON.stringify(foods));
      console.log('Stored:' + JSON.stringify(foods));
    } catch (error) {
      console.log('Failed to store');
    }
  };

  const removeFood = food => {
    var cur = foods?.filter(item => item.UUID !== food.UUID);
    setFoods([...cur]);
    store([...cur]);
  };

  const displayFoods = food => {
    return (
      <Flex
        direction="row"
        style={{
          paddingLeft: 10,
          paddingBottom: 20,
        }}>
        <View style={{paddingRight: 10}}>
          <Text>{food.description || 'Food Description'}</Text>
          <Text>{food.householdServingFullText || 'serving'}</Text>
        </View>
        <IconButton
          icon={<Icon name="plus" size={10} />}
          variant="ghost"
          onPress={() => {
            props.setPage({
              page: 'edit',
              data: {...food},
              isVisible: true,
              isNew: true,
            });
          }}
        />
        <IconButton
          icon={<Icon name="trash-alt" size={10} />}
          variant="ghost"
          onPress={() => removeFood(food)}
        />
      </Flex>
    );
  };

  return (
    <ScrollView style={{height: 500}}>
      <Text>Custom Foods</Text>
      {foods?.map((item, i) => {
        return <View key={i}>{displayFoods(item)}</View>;
      })}
    </ScrollView>
  );
};

export default CustomFoods;
