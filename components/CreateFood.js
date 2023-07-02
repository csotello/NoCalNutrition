import {convertCustomFood} from '../utils';
import WhiteText from '../styledComponents/WhiteText';
import {
  View,
  Button,
  Input,
  Flex,
  Select,
  CheckIcon,
  ScrollView,
  NativeBaseProvider,
  extendTheme,
} from 'native-base';
import {Alert} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useEffect, useState} from 'react';
import uuid from 'uuid-random';
import styles from '../styles/styles';

const CreateFood = props => {
  const [food, setFood] = useState({servingSizeUnit: 'g'});
  useEffect(() => {
    if (props.food) {
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
          color: 'white',
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
        <WhiteText style={{fontSize: 20}}>Custom Food</WhiteText>
        <Flex direction="row">
          <View style={{marginRight: 10}}>
            <WhiteText style={{marginLeft: 8}}>Food Name</WhiteText>
            <Input
              value={food.description}
              w={40}
              marginBottom={2}
              onChangeText={txt => handleText('description', txt)}
              placeholder={'Cheese'}></Input>
          </View>
          <View>
            <WhiteText style={{marginLeft: 8}}>Brand</WhiteText>
            <Input
              value={food.brandName}
              w={40}
              marginBottom={2}
              onChangeText={txt => handleText('brandName', txt)}
              placeholder={'Kroger'}></Input>
          </View>
        </Flex>
        <Flex direction="row">
          <WhiteText style={{marginLeft: 8}}>Category</WhiteText>
          <Input
            value={food.category}
            w={40}
            marginBottom={2}
            onChangeText={txt => handleText('category', txt)}
            placeholder={'dairy'}></Input>
        </Flex>
        <Flex direction="row">
          <WhiteText>Serving</WhiteText>
          <Input
            value={food.householdServingFullText}
            w={40}
            onChangeText={txt => handleText('householdServingFullText', txt)}
            placeholder={'1 slice'}></Input>
          <Input
            testID="servingInput"
            value={food.servingSize}
            w={20}
            onChangeText={txt => handleText('servingSize', txt)}
            placeholder={'0'}></Input>
          <Select
            testID="servingSizeUnitInput"
            minWidth={90}
            selectedValue={food.servingSizeUnit}
            style={{fontSize: 15}}
            _selectedItem={{endIcon: <CheckIcon />}}
            onValueChange={itemValue =>
              handleText('servingSizeUnit', itemValue)
            }>
            <Select.Item testID="servingSizeUnit" label="g" value="g" />
            <Select.Item testID="servingSizeUnit" label="ml" value="ml" />
            <Select.Item testID="servingSizeUnit" label="lbs" value="lbs" />
            <Select.Item testID="servingSizeUnit" label="oz" value="oz" />
          </Select>
        </Flex>
        <Flex direction="row">
          <WhiteText>Total Fat</WhiteText>
          <Input
            value={food.totalFat}
            onChangeText={txt => handleText('totalFat', txt)}
            placeholder={'0'}></Input>
          <WhiteText style={{marginLeft: 5}}>g</WhiteText>
        </Flex>
        <Flex direction="row">
          <WhiteText>Saturated Fat</WhiteText>
          <Input
            value={food.saturatedFat}
            onChangeText={txt => handleText('saturatedFat', txt)}
            placeholder={'0'}></Input>
          <WhiteText style={{marginLeft: 5}}>g</WhiteText>
        </Flex>
        <Flex direction="row">
          <WhiteText>Trans Fat</WhiteText>
          <Input
            value={food.transFat}
            onChangeText={txt => handleText('transFat', txt)}
            placeholder={'0'}></Input>
          <WhiteText style={{marginLeft: 5}}>g</WhiteText>
        </Flex>
        <Flex direction="row">
          <WhiteText>Cholesterol</WhiteText>
          <Input
            value={food.cholesterol}
            onChangeText={txt => handleText('cholesterol', txt)}
            placeholder={'0'}></Input>
          <WhiteText style={{marginLeft: 5}}>mg</WhiteText>
        </Flex>
        <Flex direction="row">
          <WhiteText>Sodium</WhiteText>
          <Input
            value={food.sodium}
            onChangeText={txt => handleText('sodium', txt)}
            placeholder={'0'}></Input>
          <WhiteText style={{marginLeft: 5}}>mg</WhiteText>
        </Flex>
        <Flex direction="row">
          <WhiteText>Total Carbohydrates</WhiteText>
          <Input
            value={food.carbs}
            onChangeText={txt => handleText('carbs', txt)}
            placeholder={'0'}></Input>
          <WhiteText style={{marginLeft: 5}}>g</WhiteText>
        </Flex>
        <Flex direction="row">
          <WhiteText>Dietary Fibers</WhiteText>
          <Input
            value={food.fiber}
            onChangeText={txt => handleText('fiber', txt)}
            placeholder={'0'}></Input>
          <WhiteText style={{marginLeft: 5}}>g</WhiteText>
        </Flex>
        <Flex direction="row">
          <WhiteText>Total Sugars</WhiteText>
          <Input
            value={food.sugar}
            onChangeText={txt => handleText('sugar', txt)}
            placeholder={'0'}></Input>
          <WhiteText style={{marginLeft: 5}}>g</WhiteText>
        </Flex>
        <Flex direction="row">
          <WhiteText>Protein</WhiteText>
          <Input
            value={food.protein}
            onChangeText={txt => handleText('protein', txt)}
            placeholder={'0'}></Input>
          <WhiteText style={{marginLeft: 5}}>g</WhiteText>
        </Flex>
        <Button
          onPress={() => {
            if (props.isNew) {
              create();
              Alert.alert('Custom Food Created');
            } else {
              edit();
              Alert.alert('Custom Food edited');
            }
          }}>
          {props.isNew ? 'Create' : 'Apply'}
        </Button>
      </ScrollView>
    </NativeBaseProvider>
  );
};
export default CreateFood;
