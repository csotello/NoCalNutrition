import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import React from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Heading,
} from '@gluestack-ui/themed';
import { store } from '../utils';
import styles from '../styles/styles';
import Goals from '../components/Goals';
import FoodCategories from '../components/FoodCategories';

export function Settings() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <ScrollView style={styles.settings.screen} contentContainerStyle={{ paddingBottom: 28 }}>
      <Text style={styles.screenHeading}>Settings</Text>
      <Pressable
        style={styles.settings.action}
        onPress={() => {
          setVisible(prev => !prev);
          setSelected('catagories');
        }}
      >
        <Text style={styles.settings.actionText}>Customize Catagories</Text>
      </Pressable>
      <Pressable
        style={styles.settings.action}
        onPress={() => {
          setVisible(prev => !prev);
          setSelected('goals');
        }}
      >
        <Text style={styles.settings.actionText}>Set Goals</Text>
      </Pressable>
      <Pressable
        style={styles.settings.action}
        onPress={async () => {
          await store('customFood', JSON.stringify([]));
        }}
      >
        <Text style={styles.settings.actionText}>Reset Custom</Text>
      </Pressable>
      <Modal
        isOpen={visible}
        onClose={() => setVisible(prev => !prev)}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent h={'80%'} style={styles.dialogs.content}>
          <ModalHeader>
            <Heading size="lg" style={styles.dialogs.heading}>
              {selected === 'catagories' ? 'Catagories' : 'Set Nutrient Goals'}
            </Heading>
            <ModalCloseButton
              bgColor={styles.colors.surfaceRaised}
              style={{ alignContent: 'center' }}
            />
          </ModalHeader>
          <ModalBody>
            {selected === 'goals' ? (
              <Goals setVisible={setVisible} />
            ) : (
              <FoodCategories />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
}
