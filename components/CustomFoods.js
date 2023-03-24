import {
  Flex,
  IconButton,
  ScrollView,
  View,
  Spacer,
  AlertDialog,
  Button,
} from 'native-base';
import {useEffect, useState} from 'react';
import {Text} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {getMainNutrients} from '../utils';
const CustomFoods = props => {
  const [foods, setFoods] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    let nutrients = getMainNutrients(food);
    return (
      <Flex
        direction="row"
        style={{
          paddingLeft: 10,
          paddingBottom: 20,
        }}>
        <View style={{paddingRight: 10, minWidth: 100}}>
          <Text>{food.description || 'Food Description'}</Text>
          {food.householdServingFullText && (
            <Text>{food.householdServingFullText}</Text>
          )}
          {food.servingSize && (
            <Text>
              {food.servingSize} {food.servingSizeUnit.toLocaleLowerCase()}
            </Text>
          )}
        </View>
        <Spacer />
        <View>
          <Text>P</Text>
          <Text>{nutrients.protein?.value || 0}</Text>
        </View>
        <Spacer />
        <View>
          <Text>C</Text>
          <Text>{nutrients.carbs?.value || 0}</Text>
        </View>
        <Spacer />
        <View>
          <Text>F</Text>
          <Text>{nutrients.totalFat?.value || 0}</Text>
        </View>
        <Spacer />
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
          onPress={() => setIsOpen(true)}
        />
        {alertDialog(food)}
        <IconButton
          icon={<Icon size={16} name="pencil-alt" />}
          variant="ghost"
          onPress={() => {
            props.setPage({
              page: 'create',
              data: {...food},
              isVisible: true,
              isNew: false,
            });
          }}
        />
      </Flex>
    );
  };

  const alertDialog = food => {
    return (
      <AlertDialog isOpen={isOpen} close={() => setIsOpen(false)}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Custom Food</AlertDialog.Header>
          <AlertDialog.Body>
            This will permentently delete the custom food. Data cannot be
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
      <Text>Custom Foods</Text>
      {foods?.map((item, i) => {
        return <View key={i}>{displayFoods(item)}</View>;
      })}
    </ScrollView>
  );
};

export default CustomFoods;
