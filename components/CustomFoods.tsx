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
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import { getMainNutrients } from '../utils.tsx';
import { loadCustomFoods, saveCustomFoods } from '../storage/foodRepository';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import styles from '../styles/styles';
import { FoodItem, RootStackParamList } from '../types.ts';

interface CustomFoodsProps {
  date: string;
}

export function CustomFoods(props: CustomFoodsProps): React.JSX.Element {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef(null);

  type RootNavigation = StackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<RootNavigation>();
  /**
   * Load function that retrieves custom food from storage and sets it in state.
   */
  async function load() {
    try {
      setFoods(await loadCustomFoods());
    } catch (error) {
      console.error('Failed to load custom foods', error);
    }
  }
  useEffect(() => {
    if (!loaded) {
      load();
      setLoaded(true);
    }
  }, [loaded]);

  /**
   * Removes a food from the list
   * @param {object} food - The food to be removed
   */
  async function removeFood(food: FoodItem) {
    const remainingFoods = foods.filter(item => item.UUID !== food.UUID);
    try {
      await saveCustomFoods(remainingFoods);
      setFoods(remainingFoods);
    } catch (error) {
      console.error('Failed to save custom foods', error);
    }
  }

  /**
   * Renders each food item
   *
   * @param {object} food - The food to be rendered
   */
  function displayFoods(food: FoodItem): React.JSX.Element {
    let nutrients = getMainNutrients(food);
    return (
      <View style={[styles.listItem, styles.customFoods.card]}>
        <View style={styles.customFoods.details}>
          <Text
            style={[
              styles.typography.sectionTitle,
              styles.typography.whiteText,
            ]}
          >
            {food.description || 'Food Description'}
          </Text>
          <Text style={[styles.typography.muted, styles.typography.whiteText]}>
            {food.brandName || ''}
          </Text>
          {food.householdServingFullText && (
            <Text style={styles.typography.whiteText}>
              {food.householdServingFullText}
            </Text>
          )}
          {food.servingSize && (
            <Text style={styles.typography.whiteText}>
              {food.servingSize} {food.servingSizeUnit.toLocaleLowerCase()}
            </Text>
          )}
        </View>
        <View style={styles.customFoods.macro}>
          <Text style={styles.typography.whiteText}>P</Text>
          <Text style={styles.typography.whiteText}>
            {nutrients.protein?.value || 0}
          </Text>
        </View>
        <View style={styles.customFoods.macro}>
          <Text style={styles.typography.whiteText}>C</Text>
          <Text style={styles.typography.whiteText}>
            {nutrients.carbs?.value || 0}
          </Text>
        </View>
        <View style={styles.customFoods.macro}>
          <Text style={styles.typography.whiteText}>F</Text>
          <Text style={styles.typography.whiteText}>
            {nutrients.fat?.value || 0}
          </Text>
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
                isCustom: true,
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

  function alertDialog(food: FoodItem): React.JSX.Element {
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
      <Text style={[styles.screenHeading, styles.typography.whiteText]}>
        Custom Foods
      </Text>
      {foods.length === 0 && (
        <Text style={[styles.typography.muted, styles.typography.whiteText]}>
          No custom foods saved yet.
        </Text>
      )}
      {foods?.map((item, i) => {
        return <View key={i}>{displayFoods(item)}</View>;
      })}
    </ScrollView>
  );
}

export default CustomFoods;
