import {StyleSheet, TextInput} from 'react-native';
import {
  View,
  Button,
  Modal,
  Text,
  Input,
  Flex,
  Select,
  CheckIcon,
} from 'native-base';
import {useState} from 'react';
const CustomFood = props => {
  const [text, setText] = useState({});
  const [unit, setUnit] = useState('');

  const handleText = (key, value) => {
    var cur = {...text};
    cur[key] = value;
    setText(cur);
  };

  return (
    <Modal isOpen={props.isOpen} onClose={() => props.close()} size="lg">
      <Modal.Content
        h={'100%'}
        background="#6fdc6f"
        paddingTop={10}
        width={'100%'}>
        <Modal.CloseButton />
        <Text style={{fontSize: 20}}>Custom Food</Text>
        <Flex direction="row">
          <Text style={{fontSize: 20}}>Food Name</Text>
          <Input
            value={text.name}
            onChangeText={txt => handleText(('name', txt))}
            placeholder={'Cheese'}></Input>
          <Text style={{fontSize: 20}}>Brand</Text>
          <Input
            value={text.brandName}
            onChangeText={txt => handleText(('brandName', txt))}
            placeholder={'Cheese'}></Input>
        </Flex>
        <Flex direction="row">
          <Text style={{fontSize: 20}}>Serving Size</Text>
          <Input
            value={text.servingSize}
            onChangeText={txt => handleText(('servingSize', txt))}
            placeholder={'Cheese'}></Input>
          <Select
            minWidth={90}
            selectedValue={unit}
            style={{fontSize: 20}}
            _selectedItem={{endIcon: <CheckIcon size="5" />}}
            onValueChange={itemValue => setUnit(itemValue)}>
            <Select.Item label="g" value="g" />
            <Select.Item label="ml" value="ml" />
            <Select.Item label="lbs" value="lbs" />
            <Select.Item label="oz" value="oz" />
          </Select>
        </Flex>
        <Button onPress={() => search(text)}>Create</Button>
      </Modal.Content>
    </Modal>
  );
};
export default CustomFood;
