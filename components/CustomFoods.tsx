import {
  ScrollView,
  View,
  AlertDialog,
  Button,
  ButtonIcon,
  AlertDialogBackdrop,
  Heading,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  HStack,
  VStack,
} from '@gluestack-ui/themed';
import React from 'react';
import { Text } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { WhiteText } from '../styledComponents/WhiteText.tsx';
import EncryptedStorage from 'react-native-encrypted-storage';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import { FoodItem, getMainNutrients } from '../utils.tsx';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import styles from '../styles/styles.tsx';

export function CustomFoods(props: any): React.JSX.Element {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef(null);
  const navigation = useNavigation<StackNavigationProp<any>>();
  /**
   * Load function that retrieves custom food from storage and sets it in state.
   */
  async function load() {
    try {
      let stored = await EncryptedStorage.getItem('customFood');
      if (!stored) return;
      let customFood: any[] = JSON.parse(stored);
      console.log('Loaded: ' + customFood);
      if (!customFood) return;
      setFoods([...customFood]);
    } catch (error) {
      console.error('Failed to load');
      console.log(error);
    }
  }
  useEffect(() => {
    if (!loaded) {
      load();
      setLoaded(true);
    }
  }, []);

  async function store(foods: any) {
    try {
      await EncryptedStorage.setItem('customFood', JSON.stringify(foods));
      console.log('Stored:' + JSON.stringify(foods));
    } catch (error) {
      console.log('Failed to store');
    }
  }

  /**
   * Removes a food from the list
   * @param {object} food - The food to be removed
   */
  async function removeFood(food: any) {
    var cur = foods?.filter(item => item.UUID !== food.UUID);
    setFoods([...cur]);
    store([...cur]);
  }

  /**
   * Renders each food item
   *
   * @param {object} food - The food to be rendered
   */
  function displayFoods(food: any): React.JSX.Element {
    let nutrients = getMainNutrients(food);
    return (
      <HStack space="xl">
        <View style={{ paddingRight: 10, minWidth: 100 }}>
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
        <View>
          <WhiteText>P</WhiteText>
          <WhiteText>{nutrients.protein?.value || 0}</WhiteText>
        </View>
        <View>
          <WhiteText>C</WhiteText>
          <WhiteText>{nutrients.carbs?.value || 0}</WhiteText>
        </View>
        <View style={{ marginRight: 20 }}>
          <WhiteText>F</WhiteText>
          <WhiteText>{nutrients.fat?.value || 0}</WhiteText>
        </View>
        <FontAwesome5
          name="plus"
          size={20}
          iconStyle="solid"
          color={'white'}
          onPress={() => {
            navigation.push('AddFood', {
              page: 'edit',
              food: { ...food },
              isNew: true,
              date: props.date,
            });
          }}
        />
        <FontAwesome5
          name="trash-alt"
          size={20}
          iconStyle="solid"
          color={'white'}
          onPress={() => setIsOpen(true)}
        />
        {alertDialog(food)}
        <FontAwesome5
          name="pencil-alt"
          size={20}
          iconStyle="solid"
          color={'white'}
          onPress={() =>
            navigation.push('AddFood', {
              page: 'edit',
              food: { ...food },
              isNew: false,
              date: props.date,
              isCustom: true,
            })
          }
        />
      </HStack>
    );
  }

  function alertDialog(food: any): React.JSX.Element {
    return (
      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading>Delete Custom Food</Heading>
            <AlertDialogCloseButton />
          </AlertDialogHeader>
          <AlertDialogBody>
            This will permanently delete the custom food. Data cannot be
            recovered.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              onPress={() => {
                removeFood(food);
                setIsOpen(false);
              }}
            >
              <Text>Delete</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <ScrollView>
      <WhiteText>Custom Foods</WhiteText>
      {foods?.map((item, i) => {
        return <View key={i}>{displayFoods(item)}</View>;
      })}
    </ScrollView>
  );
}

export default CustomFoods;
