import {View, Button, IconButton, Flex, Spacer, AlertDialog} from 'native-base';
import WhiteText from '../styledComponents/WhiteText';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../styles/styles';
import {getMainNutrients} from '../utils';
import {useState, useRef} from 'react';
const Food = props => {
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef(null);
  const alertDialog = (food, section) => {
    return (
      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        leastDestructiveRef={cancelRef}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Food</AlertDialog.Header>
          <AlertDialog.Body>
            This will permanently delete the food item. Data cannot be
            recovered.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              colorScheme="danger"
              testID="Delete Button"
              onPress={() => {
                props.remove(food, section);
                setIsOpen(false);
              }}>
              <WhiteText>Delete</WhiteText>
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
  };

  return (
    <View style={{padding: 10}}>
      <WhiteText style={{paddingBottom: 10}}>{props.title}</WhiteText>
      {props.meal?.map((item, i) => {
        let nutrients = getMainNutrients({...item});
        return (
          <View
            key={i}
            style={{paddingLeft: 10, marginBottom: 10, paddingBottom: 10}}>
            <Flex direction="row">
              <Flex direction="column">
                <View>
                  <WhiteText>
                    {item.brandName} {item.description}
                    {'\n'}
                    Amount: {Number(item.servingSize)} {item.servingSizeUnit}
                  </WhiteText>
                </View>
                <Flex direction="row">
                  <WhiteText>
                    P: {nutrients.protein.value}
                    {nutrients.protein.unitName}
                  </WhiteText>
                  <Spacer />
                  <WhiteText>
                    C: {nutrients.carbs.value}
                    {nutrients.carbs.unitName}
                  </WhiteText>
                  <Spacer />
                  <WhiteText>
                    F: {nutrients.fat.value}
                    {nutrients.fat.unitName}
                  </WhiteText>
                  <Spacer />
                </Flex>
              </Flex>
              <Spacer />
              {alertDialog(item, props.title)}
              <IconButton
                marginRight={5}
                testID="Delete Icon"
                icon={<Icon size={16} name="trash-alt" color={'white'} />}
                onPress={() => setIsOpen(true)}
              />
              <IconButton
                testID="Edit Icon"
                icon={<Icon size={16} name="pencil-alt" color={'white'} />}
                onPress={() => {
                  props.edit(item, props.title);
                }}
              />
            </Flex>
          </View>
        );
      })}
    </View>
  );
};

export default Food;
