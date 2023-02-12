import {StyleSheet, TextInput} from 'react-native';
import {NativeBaseProvider, extendTheme} from 'native-base';
import styles from '../styles/styles';
import {convertCustomFood} from '../utils';
import {
  View,
  Button,
  Modal,
  Text,
  Input,
  Flex,
  Select,
  CheckIcon,
  ScrollView,
  theme,
} from 'native-base';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useState} from 'react';
const CreateFood = props => {
  const [text, setText] = useState({sevingUnit: 'g'});

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
    var cur = {...text};
    cur[`${key}`] = value;
    setText(cur);
  };

  const create = async () => {
    let food = convertCustomFood(text);
    try {
      const customFood = JSON.parse(
        await EncryptedStorage.getItem('customFood'),
      );
      let curr = customFood ? [...customFood, food] : [food];
      await EncryptedStorage.setItem('customFood', JSON.stringify(curr));
    } catch (error) {
      console.error(error);
    }
    props.setPage('custom');
  };

  return (
    <NativeBaseProvider theme={theme}>
      <ScrollView>
        <Text style={{fontSize: 20}}>Custom Food</Text>
        <Flex direction="row">
          <View style={{marginRight: 10}}>
            <Text style={{marginLeft: 8}}>Food Name</Text>
            <Input
              value={text.name}
              w={40}
              marginBottom={2}
              onChangeText={txt => handleText('name', txt)}
              placeholder={'Cheese'}></Input>
          </View>
          <View>
            <Text style={{marginLeft: 8}}>Brand</Text>
            <Input
              value={text.brandName}
              w={40}
              marginBottom={2}
              onChangeText={txt => handleText('brandName', txt)}
              placeholder={'Kroger'}></Input>
          </View>
        </Flex>
        <Flex direction="row">
          <Text>Serving</Text>
          <Input
            value={text.serving}
            w={40}
            onChangeText={txt => handleText('serving', txt)}
            placeholder={'1 slice'}></Input>
          <Input
            value={text.servingWeight}
            w={20}
            onChangeText={txt => handleText('servingWeight', txt)}
            placeholder={'0'}></Input>
          <Select
            minWidth={90}
            selectedValue={text.unit}
            style={{fontSize: 15}}
            _selectedItem={{endIcon: <CheckIcon />}}
            onValueChange={itemValue => handleText('servingUnit', itemValue)}>
            <Select.Item label="g" value="g" />
            <Select.Item label="ml" value="ml" />
            <Select.Item label="lbs" value="lbs" />
            <Select.Item label="oz" value="oz" />
          </Select>
        </Flex>
        <Flex direction="row">
          <Text>Total Fat</Text>
          <Input
            value={text.totalFat}
            onChangeText={txt => handleText('totalFat', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Flex direction="row">
          <Text>Saturated Fat</Text>
          <Input
            value={text.saturatedFat}
            onChangeText={txt => handleText('saturatedFat', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Flex direction="row">
          <Text>Trans Fat</Text>
          <Input
            value={text.transFat}
            onChangeText={txt => handleText('transFat', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Flex direction="row">
          <Text>Cholesterol</Text>
          <Input
            value={text.cholesterol}
            onChangeText={txt => handleText('cholesterol', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>mg</Text>
        </Flex>
        <Flex direction="row">
          <Text>Sodium</Text>
          <Input
            value={text.sodium}
            onChangeText={txt => handleText('sodium', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>mg</Text>
        </Flex>
        <Flex direction="row">
          <Text>Total Carbohydrates</Text>
          <Input
            value={text.carbs}
            onChangeText={txt => handleText('carbs', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Flex direction="row">
          <Text>Dietary Fibers</Text>
          <Input
            value={text.fiber}
            onChangeText={txt => handleText('fiber', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Flex direction="row">
          <Text>Total Sugars</Text>
          <Input
            value={text.sugar}
            onChangeText={txt => handleText('sugar', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Flex direction="row">
          <Text>Protein</Text>
          <Input
            value={text.protein}
            onChangeText={txt => handleText('protein', txt)}
            placeholder={'0'}></Input>
          <Text style={{marginLeft: 5}}>g</Text>
        </Flex>
        <Button onPress={() => create()}>Create</Button>
      </ScrollView>
    </NativeBaseProvider>
  );
};
export default CreateFood;
