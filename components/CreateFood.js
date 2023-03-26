import {NativeBaseProvider, extendTheme} from 'native-base';
import {convertCustomFood} from '../utils';
import {
  View,
  Button,
  Text,
  Input,
  Flex,
  Select,
  CheckIcon,
  ScrollView,
} from 'native-base';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useEffect, useState} from 'react';
import uuid from 'uuid-random';
const CreateFood = props => {
  const [food, setFood] = useState({sevingSizeUnit: 'g'});
  useEffect(() => {
    if (props.food) {
      console.log(props.food);
      let cur = {
        ...props.food,
      };
      cur.foodNutrients?.map((nutrient, i) => {
        switch (nutrient.nutrientName) {
          case 'Protein':
            cur.protein = nutrient.value;
            break;
          case 'Carbohydrate, by difference':
            cur.carbs = nutrient.value;
            break;
          case 'Total Lipid (fat)':
            cur.totalFat = nutrient.value;
            break;
          default:
            break;
        }
      });
      setFood({...cur});
    }
    return () => {};
  }, []);

  const theme = extendTheme({
    components: {
      Input: {
        baseStyle: {
          w: 20,
          marginLeft: 2,
        },
      },
      Text: {
        baseStyle: {
          marginTop: 3,
          fontSize: 15,
        },
      },
    },
  });

  const handleText = (key, value) => {
    var cur = {...food};
    cur[`${key}`] = value;
    setFood({...cur});
  };

  const create = async () => {
    let newFood = convertCustomFood(food);
    newFood['UUID'] = uuid();
    console.log('Create');
    console.log(newFood);
    try {
      var val = JSON.parse(await EncryptedStorage.getItem('customFood'));
      if (val) val.push(newFood);
      else val = [newFood];
      console.log('Custom After');
      console.log(val);
      await EncryptedStorage.setItem('customFood', JSON.stringify(val));
    } catch (error) {
      console.error(error);
    }
  };

  const edit = async () => {
    console.log('Edit');
    console.log(food);
    let newFood = convertCustomFood(food);
    newFood['UUID'] = props.food.UUID;
    console.log(newFood);
    try {
      var val = JSON.parse(await EncryptedStorage.getItem('customFood'));
      console.log('old');
      console.log(val);
      val = val.filter(item => item.UUID !== newFood.UUID);
      val.push({...newFood});
      console.log(val);
      await EncryptedStorage.setItem('customFood', JSON.stringify(val));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NativeBaseProvider theme={theme}>
      <ScrollView>
        <Text style={{fontSize: 20}}>Custom Food</Text>
        <Flex direction="row">
          <View style={{marginRight: 10}}>
            <Text style={{marginLeft: 8}}>Food Name</Text>
            <Input
              value={food.description}
              w={40}
              marginBottom={2}
              onChangeText={txt => handleText('description', txt)}
              placeholder={'Cheese'}></Input>
          </View>
          <View>
            <Text style={{marginLeft: 8}}>Brand</Text>
            <Input
              value={food.brandName}
              w={40}
              marginBottom={2}
              onChangeText={txt => handleText('brandName', txt)}
              placeholder={'Kroger'}></Input>
          </View>
        </Flex>
        <Flex direction="row">
          <Text>Serving</Text>
          <Input
            value={food.householdServingFullText}
            w={40}
            onChangeText={txt => handleText('householdServingFullText', txt)}
            placeholder={'1 slice'}></Input>
          <Input
            value={food.servingSize}
            w={20}
            onChangeText={txt => handleText('servingSize', txt)}
            placeholder={'0'}></Input>
          <Select
            minWidth={90}
            selectedValue={food.servingSizeUnit}
            style={{fontSize: 15}}
            _selectedItem={{endIcon: <CheckIcon />}}
            onValueChange={itemValue =>
              handleText('servingSizeUnit', itemValue)
            }>
            <Select.Item label="g" value="g" />
            <Select.Item label="ml" value="ml" />
            <Select.Item label="lbs" value="lbs" />
            <Select.Item label="oz" value="oz" />
          </Select>
        </Flex>
        <Flex direction="row">
          <Text>Total Fat</Text>
          <Input
            value={food.totalFat}
            onChangeText={txt => handleText('totalFat', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Flex direction="row">
          <Text>Saturated Fat</Text>
          <Input
            value={food.saturatedFat}
            onChangeText={txt => handleText('saturatedFat', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Flex direction="row">
          <Text>Trans Fat</Text>
          <Input
            value={food.transFat}
            onChangeText={txt => handleText('transFat', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Flex direction="row">
          <Text>Cholesterol</Text>
          <Input
            value={food.cholesterol}
            onChangeText={txt => handleText('cholesterol', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>mg</Text>
        </Flex>
        <Flex direction="row">
          <Text>Sodium</Text>
          <Input
            value={food.sodium}
            onChangeText={txt => handleText('sodium', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>mg</Text>
        </Flex>
        <Flex direction="row">
          <Text>Total Carbohydrates</Text>
          <Input
            value={food.carbs}
            onChangeText={txt => handleText('carbs', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Flex direction="row">
          <Text>Dietary Fibers</Text>
          <Input
            value={food.fiber}
            onChangeText={txt => handleText('fiber', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Flex direction="row">
          <Text>Total Sugars</Text>
          <Input
            value={food.sugar}
            onChangeText={txt => handleText('sugar', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Flex direction="row">
          <Text>Protein</Text>
          <Input
            value={food.protein}
            onChangeText={txt => handleText('protein', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Button
          onPress={() => {
            if (props.isNew) {
              create();
              alert('Custom Food Created');
            } else {
              edit();
              alert('Custom Food edited');
            }
          }}>
          {props.isNew ? 'Create' : 'Apply'}
        </Button>
      </ScrollView>
    </NativeBaseProvider>
  );
};
export default CreateFood;
