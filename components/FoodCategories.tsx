import { useState } from 'react';
import React from 'react';
import { View, Text, ScrollView, ToastAndroid, Keyboard } from 'react-native';
import { Input, Button, InputField } from '@gluestack-ui/themed';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import EncryptedStorage from 'react-native-encrypted-storage';
import styles from '../styles/styles';
import { WhiteText } from '../styledComponents/WhiteText';

function FoodCategories(): React.JSX.Element {
  const [categories, setCategories] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  async function load() {
    try {
      const val = await EncryptedStorage.getItem('catagories');
      if (val) {
        setCategories(JSON.parse(val));
        console.log('Loaded');
      }
    } catch (error) {
      console.log(error);
      console.log('Failed to load');
    }
  }
  if (!loaded) {
    load();
    setLoaded(true);
  }
  async function store(categories: any) {
    try {
      await EncryptedStorage.setItem('catagories', JSON.stringify(categories));
      console.log('Stored:' + JSON.stringify(categories));
    } catch (error) {
      console.log('Failed to store');
    }
  }
  function add(category: string) {
    if (!categories.includes(category)) {
      let current = [...categories, category];
      setCategories(current);
      store(current);
    } else ToastAndroid.show('Category already exists', ToastAndroid.TOP);
    Keyboard.dismiss();
    setText('');
  }

  function remove(category: string) {
    let current = categories.filter(cat => cat !== category);
    setCategories(current);
    store(current);
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {categories.map((cat, i) => {
          return (
            <View key={i} style={[styles.listItem, styles.row]}>
              <WhiteText style={{ flex: 1 }}>{cat}</WhiteText>
              <FontAwesome5
                size={20}
                name="trash"
                iconStyle="solid"
                color={styles.colors.textMuted}
                onPress={() => remove(cat)}
                style={styles.iconButton}
              />
            </View>
          );
        })}
      </ScrollView>
      <Input style={[styles.field, { marginBottom: 10 }]}>
        <InputField
          value={text}
          onChangeText={txt => setText(txt)}
          size={'sm'}
          color={styles.colors.white}
          placeholder="New Category"
        />
      </Input>
      <Button w={'100%'} alignSelf={'center'} style={styles.dialogs.confirm} onPress={() => add(text)}>
        <Text style={styles.buttonText}>Add Category</Text>
      </Button>
    </View>
  );
}

export default FoodCategories;
