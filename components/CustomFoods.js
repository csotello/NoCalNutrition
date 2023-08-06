import {
  Flex,
  IconButton,
  ScrollView,
  View,
  Spacer,
  AlertDialog,
  Button,
} from 'native-base';
import {useEffect, useRef, useState} from 'react';
import WhiteText from '../styledComponents/WhiteText.js';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {getMainNutrients} from '../utils';
import {useNavigation} from '@react-navigation/native';
const CustomFoods = props => {
  const [foods, setFoods] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef(null);
  const navigation = useNavigation();
  /**
   * Load function that retrieves custom food from storage and sets it in state.
   */
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

  /**
   * Removes a food from the list
   * @param {object} food - The food to be removed
   */
  const removeFood = food => {
    var cur = foods?.filter(item => item.UUID !== food.UUID);
    setFoods([...cur]);
    store([...cur]);
  };

  /**
   * Renders each food item
   *
   * @param {object} food - The food to be rendered
   */
  const displayFoods = food => {
    let nutrients = getMainNutrients(food);
    return (
      <Flex
        direction="row"
        style={{
          paddingLeft: 10,
          paddingBottom: 20,
        }}>
        <View style={{paddingRight: 10, minWidth: 100}}>
          <WhiteText>{food.description || 'Food Description'}</WhiteText>
          <WhiteText>{food.brandName || ''}</WhiteText>
          {food.householdServingFullText && (
            <WhiteText>{food.householdServingFullText}</WhiteText>
          )}
          {food.servingSize && (
            <WhiteText>
              {food.servingSize} {food.servingSizeUnit.toLocaleLowerCase()}
            </WhiteText>
          )}
        </View>
        <Spacer />
        <View>
          <WhiteText>P</WhiteText>
          <WhiteText>{nutrients.protein?.value || 0}</WhiteText>
        </View>
        <Spacer />
        <View>
          <WhiteText>C</WhiteText>
          <WhiteText>{nutrients.carbs?.value || 0}</WhiteText>
        </View>
        <Spacer />
        <View>
          <WhiteText>F</WhiteText>
          <WhiteText>{nutrients.fat?.value || 0}</WhiteText>
        </View>
        <Spacer />
        <IconButton
          icon={<Icon name="plus" size={10} color={'white'} />}
          variant="ghost"
          onPress={() => {
            navigation.push('AddFood', {
              page: 'edit',
              food: {...food},
              isNew: true,
              date: props.date,
            });
          }}
        />
        <IconButton
          icon={<Icon name="trash-alt" size={10} color={'white'} />}
          variant="ghost"
          onPress={() => setIsOpen(true)}
        />
        {alertDialog(food)}
        <IconButton
          icon={<Icon size={16} name="pencil-alt" color={'white'} />}
          variant="ghost"
          onPress={() => {
            navigation.push('AddFood', {
              page: 'edit',
              food: {...food},
              isNew: false,
              date: props.date,
              isCustom: true,
            });
          }}
        />
      </Flex>
    );
  };

  const alertDialog = food => {
    return (
      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        leastDestructiveRef={cancelRef}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Custom Food</AlertDialog.Header>
          <AlertDialog.Body>
            This will permanently delete the custom food. Data cannot be
            recovered.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              colorScheme="danger"
              onPress={() => {
                removeFood(food);
                setIsOpen(false);
              }}>
              Delete
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
  };

  return (
    <ScrollView>
      <WhiteText>Custom Foods</WhiteText>
      {foods?.map((item, i) => {
        return <View key={i}>{displayFoods(item)}</View>;
      })}
    </ScrollView>
  );
};

export default CustomFoods;
