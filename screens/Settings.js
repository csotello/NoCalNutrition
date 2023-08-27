import {useState} from 'react';
import {View} from 'react-native';
import {Modal, Button} from 'native-base';
import {store} from '../utils';
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
      <Button
        onPress={async () => {
          await store('customFood', JSON.stringify([]));
        }}
        variant={'ghost'}>
        Reset Custom
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
