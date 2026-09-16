import { useState } from 'react';
import { View, Text } from 'react-native';
import React from 'react';
import {Modal, ModalBackdrop, ModalContent, ModalCloseButton, ModalHeader, ModalBody} from '@/components/ui/modal'
import {Heading} from '@/components/ui/heading'
import {Button} from '@/components/ui/button'
import { store } from '../utils';
import styles from '../styles/styles';
import Goals from '../components/Goals';
import FoodCategories from '../components/FoodCategories';

export function Settings() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <View
      style={{ backgroundColor: styles.primaryBackgroundColor, height: '100%' }}
    >
      <Button
        size={'default'}
        onPress={() => {
          setVisible(prev => !prev);
          setSelected('catagories');
        }}
      >
        <Text>Customize Catagories</Text>
      </Button>
      <Button
        size={'default'}
        onPress={() => {
          setVisible(prev => !prev);
          setSelected('goals');
        }}
      >
        <Text>Set Goals</Text>
      </Button>
      <Button
        onPress={async () => {
          await store('customFood', JSON.stringify([]));
        }}
      >
        <Text>Reset Custom</Text>
      </Button>
      <Modal
        isOpen={visible}
        onClose={() => setVisible(prev => !prev)}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent className={`h-80 bg-${styles.primaryBackgroundColor}`} >
          <ModalHeader>
            <Heading size="lg" className="bg-white">
              {selected === 'catagories' ? 'Catagories' : 'Set Nutrient Goals'}
            </Heading>
            <ModalCloseButton
              className="bg-white"
              style={{ alignContent: 'center' }}
            />
            {selected === 'catagories' ? 'Catagories' : 'Goals'}
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
    </View>
  );
}
