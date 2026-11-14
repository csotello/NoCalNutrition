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

export function Food(props: any): React.JSX.Element {
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const cancelRef = useRef(null);

  return (
    <View style={styles.nutrition.mealCard}>
      <Text style={styles.nutrition.mealTitle}>{props.title}</Text>
      {props.meal?.length === 0 && (
        <Text style={styles.typography.muted}>No foods added yet</Text>
      )}
      {props.meal?.map((item: any) => {
        const nutrients = getMainNutrients({ ...item });
        return (
          <View
            key={item.UUID || item.fdcId || item.description}
            style={styles.nutrition.foodCard}
          >
            <HStack style={styles.nutrition.foodHeader}>
              <View style={{ flex: 1 }}>
                {!!item.brandName && (
                  <Text style={styles.nutrition.foodDetail}>
                    {item.brandName}
                  </Text>
                )}
                <Text style={styles.nutrition.foodName}>
                  {item.description}
                </Text>
                <Text style={styles.nutrition.foodDetail}>
                  Serving Size: {Number(item.servingSize)}{' '}
                  {item.servingSizeUnit}
                </Text>
                <Text style={styles.nutrition.foodDetail}>
                  Servings: {Number(item.servings)}
                </Text>
              </View>
              <View style={styles.nutrition.foodActions}>
                <Pressable
                  testID="Delete Icon"
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.description}`}
                  hitSlop={4}
                  style={styles.nutrition.actionButton}
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
                  style={styles.nutrition.actionButton}
                  onPress={() => props.edit(item, props.title)}
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
            <View style={styles.nutrition.nutrients}>
              <Text style={styles.nutrition.nutrientValue}>
                P: {nutrients.protein.value}
                {nutrients.protein.unitName}
              </Text>
              <Text style={styles.nutrition.nutrientValue}>
                C: {nutrients.carbs.value}
                {nutrients.carbs.unitName}
              </Text>
              <Text style={styles.nutrition.nutrientValue}>
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
                if (selectedFood) props.remove(selectedFood, props.title);
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
