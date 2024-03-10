import {useState} from 'react';
import {View, Text} from 'react-native';
import React from 'react';
import {
  Modal,
  Button,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
} from '@gluestack-ui/themed';
import {store} from '../utils';
import styles from '../styles/styles';
import Goals from '../components/Goals';
import FoodCategories from '../components/FoodCategories';

export function Settings() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <View
      style={{backgroundColor: styles.primaryBackgroundColor, height: '100%'}}>
      <Button
        size={'md'}
        onPress={() => {
          setVisible(prev => !prev);
          setSelected('catagories');
        }}>
        <Text>Customize Catagories</Text>
      </Button>
      <Button
        size={'md'}
        onPress={() => {
          setVisible(prev => !prev);
          setSelected('goals');
        }}>
        <Text>Set Goals</Text>
      </Button>
      <Button
        onPress={async () => {
          await store('customFood', JSON.stringify([]));
        }}>
        <Text>Reset Custom</Text>
      </Button>
      <Modal
        isOpen={visible}
        onClose={() => setVisible(prev => !prev)}
        size="lg">
        <ModalBackdrop />
        <ModalContent h={'80%'}>
          <ModalHeader>
            <ModalCloseButton />
            {selected === 'catagories' ? 'Catagories' : 'Goals'}
          </ModalHeader>
          <ModalBody style={{backgroundColor: styles.primaryBackgroundColor}}>
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
