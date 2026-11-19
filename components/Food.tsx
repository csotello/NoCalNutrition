import {
  View,
  Button,
  AlertDialog,
  Heading,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  HStack,
} from '@gluestack-ui/themed';
import React, { useRef, useState } from 'react';
import { Pressable, Text } from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import { getMainNutrients } from '../utils';
import styles from '../styles/styles';
import nutritionStyles from '../styles/nutrition';
import { FoodItem, Meal } from '../types';

interface FoodProps {
  meal: Meal;
  foods: FoodItem[];
  edit: (item: FoodItem, meal: Meal) => void;
  remove: (item: FoodItem, meal: Meal) => void;
}

export function Food(props: FoodProps): React.JSX.Element {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const cancelRef = useRef(null);

  return (
    <View style={nutritionStyles.mealCard}>
      <Text style={nutritionStyles.mealTitle}>{props.meal}</Text>
      {props.foods?.length === 0 && (
        <Text style={styles.typography.muted}>No foods added yet</Text>
      )}
      {props.foods?.map((item: FoodItem) => {
        const nutrients = getMainNutrients({ ...item });
        return (
          <View
            key={item.UUID || item.description}
            style={nutritionStyles.foodCard}
          >
            <HStack style={nutritionStyles.foodHeader}>
              <View style={{ flex: 1 }}>
                {!!item.brandName && (
                  <Text style={nutritionStyles.foodDetail}>
                    {item.brandName}
                  </Text>
                )}
                <Text style={nutritionStyles.foodName}>{item.description}</Text>
                <Text style={nutritionStyles.foodDetail}>
                  Serving Size: {Number(item.servingSize)}{' '}
                  {item.servingSizeUnit}
                </Text>
                <Text style={nutritionStyles.foodDetail}>
                  Servings: {Number(item.servings)}
                </Text>
              </View>
              <View style={nutritionStyles.foodActions}>
                <Pressable
                  testID="Delete Icon"
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.description}`}
                  hitSlop={4}
                  style={nutritionStyles.actionButton}
                  onPress={() => setSelectedFood(item)}
                >
                  <FontAwesome5
                    name="trash-alt"
                    iconStyle="solid"
                    color={styles.colors.textMuted}
                    size={17}
                  />
                </Pressable>
                <Pressable
                  testID="Edit Icon"
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${item.description}`}
                  hitSlop={4}
                  style={nutritionStyles.actionButton}
                  onPress={() => props.edit(item, props.meal)}
                >
                  <FontAwesome5
                    name="pencil-alt"
                    iconStyle="solid"
                    color={styles.colors.textMuted}
                    size={17}
                  />
                </Pressable>
              </View>
            </HStack>
            <View style={nutritionStyles.nutrients}>
              <Text style={nutritionStyles.nutrientValue}>
                P: {nutrients.protein.value}
                {nutrients.protein.unitName}
              </Text>
              <Text style={nutritionStyles.nutrientValue}>
                C: {nutrients.carbs.value}
                {nutrients.carbs.unitName}
              </Text>
              <Text style={nutritionStyles.nutrientValue}>
                F: {nutrients.fat.value}
                {nutrients.fat.unitName}
              </Text>
            </View>
          </View>
        );
      })}
      <AlertDialog
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
        testID="modal"
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent style={styles.dialogs.content}>
          <AlertDialogCloseButton />
          <AlertDialogHeader>
            <Heading style={styles.dialogs.heading}>Delete Food</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text style={styles.dialogs.body}>
              This will permanently delete the food item. Data cannot be
              recovered.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              style={styles.dialogs.destructive}
              testID="Delete Button"
              onPress={() => {
                if (selectedFood) props.remove(selectedFood, props.meal);
                setSelectedFood(null);
              }}
            >
              <Text style={styles.dialogs.destructiveText}>Delete</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
