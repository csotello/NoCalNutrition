import {
  View,
  AlertDialog,
  Button,
  AlertDialogBackdrop,
  Heading,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
} from '@gluestack-ui/themed';
import React from 'react';
import { Text, ScrollView } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { WhiteText } from '../styledComponents/WhiteText.tsx';
import EncryptedStorage from 'react-native-encrypted-storage';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import { getMainNutrients } from '../utils.tsx';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import styles from '../styles/styles';
import { FoodItem } from '../types.ts';

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
  }, [loaded]);

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
      <View style={[styles.listItem, styles.customFoods.card]}>
        <View style={styles.customFoods.details}>
          <WhiteText style={styles.typography.sectionTitle}>
            {food.description || 'Food Description'}
          </WhiteText>
          <WhiteText style={styles.typography.muted}>
            {food.brandName || ''}
          </WhiteText>
          {food.householdServingFullText && (
            <WhiteText>{food.householdServingFullText}</WhiteText>
          )}
          {food.servingSize && (
            <WhiteText>
              {food.servingSize} {food.servingSizeUnit.toLocaleLowerCase()}
            </WhiteText>
          )}
        </View>
        <View style={styles.customFoods.macro}>
          <WhiteText>P</WhiteText>
          <WhiteText>{nutrients.protein?.value || 0}</WhiteText>
        </View>
        <View style={styles.customFoods.macro}>
          <WhiteText>C</WhiteText>
          <WhiteText>{nutrients.carbs?.value || 0}</WhiteText>
        </View>
        <View style={styles.customFoods.macro}>
          <WhiteText>F</WhiteText>
          <WhiteText>{nutrients.fat?.value || 0}</WhiteText>
        </View>
        <View style={styles.customFoods.actions}>
          <FontAwesome5
            name="plus"
            style={{ marginRight: 8 }}
            size={20}
            iconStyle="solid"
            testID="Add Icon"
            color={styles.colors.accent}
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
            style={{ marginRight: 8 }}
            testID="Delete Icon"
            iconStyle="solid"
            color={styles.colors.textMuted}
            onPress={() => setIsOpen(true)}
          />
          {alertDialog(food)}
          <FontAwesome5
            name="pencil-alt"
            size={20}
            style={{ marginRight: 8 }}
            iconStyle="solid"
            testID="Edit Icon"
            color={styles.colors.textMuted}
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
        </View>
      </View>
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
        <AlertDialogContent style={styles.dialogs.content}>
          <AlertDialogHeader>
            <Heading style={styles.dialogs.heading}>Delete Custom Food</Heading>
            <AlertDialogCloseButton />
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text style={styles.dialogs.body}>
              This will permanently delete the custom food. Data cannot be
              recovered.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              style={styles.dialogs.destructive}
              onPress={() => {
                removeFood(food);
                setIsOpen(false);
              }}
            >
              <Text style={styles.dialogs.destructiveText}>Delete</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.customFoods.list}>
      <WhiteText style={styles.screenHeading}>Custom Foods</WhiteText>
      {foods.length === 0 && (
        <WhiteText style={styles.typography.muted}>
          No custom foods saved yet.
        </WhiteText>
      )}
      {foods?.map((item, i) => {
        return <View key={i}>{displayFoods(item)}</View>;
      })}
    </ScrollView>
  );
}

export default CustomFoods;
