import {View, Button, IconButton, Flex, Spacer, AlertDialog} from 'native-base';
import WhiteText from '../styledComponents/WhiteText';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../styles/styles';
import {useState} from 'react';
const Food = props => {
  const [isOpen, setIsOpen] = useState(false);

  const alertDialog = (food, section) => {
    return (
      <AlertDialog isOpen={isOpen} close={() => setIsOpen(false)}>
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
        let nutrients = item.foodNutrients?.filter(item => {
          return item.nutrientName.match(
            /^(Protein|Carbohydrate, by difference|Total lipid \(fat\))$/,
          );
        });
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
                  {nutrients.map((nutrient, i) => {
                    return (
                      <View style={{paddingLeft: 5}} key={i}>
                        <WhiteText>
                          {nutrient.nutrientName}
                          {nutrient.value}
                          {nutrient.unitName}
                        </WhiteText>
                      </View>
                    );
                  })}
                </View>
              </Flex>
              <Spacer />
              {alertDialog(item, props.title)}
              <IconButton
                testID="Delete Icon"
                icon={<Icon size={16} name="trash-alt" color={'white'} />}
                onPress={() => setIsOpen(true)}
              />
              <Spacer />
              <IconButton
                testID="Edit Icon"
                icon={<Icon size={16} name="pencil-alt" color={'white'} />}
                onPress={() => {
                  props.edit(item, props.title);
                }}
              />
              <Spacer />
            </Flex>
          </View>
        );
      })}
    </View>
  );
};

export default Food;
