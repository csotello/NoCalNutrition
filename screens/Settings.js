import {useState} from 'react';
import {View, Text, ScrollView, ToastAndroid, Keyboard} from 'react-native';
import {Modal, Input, Button} from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import styles from '../styles/styles';
import Goals from '../components/Goals';
import FoodCategories from '../components/FoodCategories';

const Settings = () => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <View
      style={{backgroundColor: styles.primaryBackgroundColor, height: '100%'}}>
      <Button
        variant={'ghost'}
        size={'md'}
        onPress={() => {
          setVisible(prev => !prev);
          setSelected('catagories');
        }}>
        Customize Catagories
      </Button>
      <Button
        size={'md'}
        onPress={() => {
          setVisible(prev => !prev);
          setSelected('goals');
        }}
        variant={'ghost'}>
        Set Goals
      </Button>
      <Modal
        isOpen={visible}
        onClose={() => setVisible(prev => !prev)}
        size="lg">
        <Modal.Content h={'80%'} background={styles.primaryBackgroundColor}>
          <Modal.CloseButton />
          <Modal.Header
            background={styles.primaryBackgroundColor}
            _text={{
              color: 'white',
            }}>
            {selected === 'catagories' ? 'Catagories' : 'Goals'}
          </Modal.Header>
          <Modal.Body>
            {selected === 'goals' ? (
              <Goals setVisible={setVisible} />
            ) : (
              <FoodCategories />
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </View>
  );
};

export default Settings;
