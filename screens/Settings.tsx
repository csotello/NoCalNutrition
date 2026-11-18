import { useRef, useState } from 'react';
import { Text, Pressable, ScrollView } from 'react-native';
import React from 'react';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  Heading,
} from '@gluestack-ui/themed';
import { saveCustomFoods } from '../storage/foodRepository';
import styles from '../styles/styles';
import Goals from '../components/Goals';
import FoodCategories from '../components/FoodCategories';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
export function Settings() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('');
  const cancelRef = useRef(null);

  return (
    <ScrollView
      style={styles.settings.screen}
      contentContainerStyle={{ paddingBottom: 28 }}
    >
      <Text style={styles.screenHeading}>Settings</Text>
      <Pressable
        style={styles.settings.action}
        onPress={() => {
          setVisible(true);
          setSelected('catagories');
        }}
      >
        <Text style={styles.settings.actionText}>Customize Catagories</Text>
      </Pressable>
      <Pressable
        style={styles.settings.action}
        onPress={() => {
          setVisible(true);
          setSelected('goals');
        }}
      >
        <Text style={styles.settings.actionText}>Set Goals</Text>
      </Pressable>
      <Pressable
        style={styles.settings.action}
        onPress={() =>
          saveCustomFoods([]).catch(error =>
            console.error('Failed to reset custom foods', error),
          )
        }
      >
        <Text style={styles.settings.actionText}>Reset Custom</Text>
      </Pressable>
      <AlertDialog
        isOpen={visible}
        onClose={() => setVisible(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent h={'80%'} style={styles.dialogs.content}>
          <AlertDialogHeader>
            <Heading size="lg" style={styles.dialogs.heading}>
              {selected === 'catagories' ? 'Catagories' : 'Set Nutrient Goals'}
            </Heading>
            <AlertDialogCloseButton
              ref={cancelRef}
              bgColor={styles.colors.surfaceRaised}
              style={{ alignContent: 'center' }}
            >
              <FontAwesome5
                name="times"
                iconStyle="solid"
                size={16}
                color={styles.colors.textMuted}
              />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            {selected === 'goals' ? (
              <Goals setVisible={setVisible} />
            ) : (
              <FoodCategories />
            )}
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollView>
  );
}
