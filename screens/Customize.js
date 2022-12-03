import {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import {Modal, Input, Button} from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';
import EncryptedStorage from 'react-native-encrypted-storage';

const Customize = () => {
  const [catagories, setCatagories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const load = async () => {
    try {
      const val = await EncryptedStorage.getItem('catagories');
      if (val) {
        setCatagories(JSON.parse(val));
        console.log('Loaded');
      }
    } catch (error) {
      console.log(error);
      console.log('Failed to load');
    }
  };
  if (!loaded) {
    load();
    setLoaded(true);
  }
  const store = async catagories => {
    try {
      await EncryptedStorage.setItem('catagories', JSON.stringify(catagories));
      console.log('Stored:' + JSON.stringify(catagories));
    } catch (error) {
      console.log('Failed to store');
    }
  };
  const add = catagory => {
    if (!catagories.includes(catagory)) {
      let current = [...catagories, catagory];
      setCatagories(current);
      store(current);
    } else ToastAndroid.show('Catagory already exists', ToastAndroid.TOP);
    Keyboard.dismiss();
    setText('');
  };

  const remove = catagory => {
    let current = catagories.filter(cat => cat != catagory);
    setCatagories(current);
    store(current);
  };

  return (
    <View>
      <Modal
        isOpen={visible}
        onClose={() => setVisible(prev => !prev)}
        size="lg">
        <Modal.Content h={'80%'} background="#6fdc6f">
          <Modal.CloseButton />
          <Modal.Header background={'#6fdc6f'}>Current Catagories</Modal.Header>
          <Modal.Body>
            <ScrollView>
              {catagories.map((cat, i) => {
                return (
                  <View key={i}>
                    <Text>{cat}</Text>
                    <Icon
                      size={20}
                      name="trash"
                      color="0x900"
                      onPress={() => remove(cat)}
                      style={{alignSelf: 'flex-end', top: -20}}
                    />
                  </View>
                );
              })}
            </ScrollView>
            <Input
              value={text}
              onChangeText={txt => setText(txt)}
              variant="outline"
              size={'sm'}
              placeholder="New Task"></Input>
            <Button w={'100%'} alignSelf={'center'} onPress={() => add(text)}>
              Add
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Button top={200} size={'md'} onPress={() => setVisible(prev => !prev)}>
        Customize Catagories
      </Button>
    </View>
  );
};

export default Customize;
