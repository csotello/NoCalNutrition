import {useEffect, useState} from 'react';
import React from 'react';
import {ScrollView, View, Text, Keyboard, ToastAndroid} from 'react-native';
import {Habit} from '../components/Habit';
import {
  Modal,
  Input,
  InputField,
  Button,
  Box,
  ModalBackdrop,
  ModalHeader,
  ButtonIcon,
  ModalCloseButton,
  ModalContent,
} from '@gluestack-ui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EncryptedStorage from 'react-native-encrypted-storage';
export function Habits() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [catagory, setCatagory] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [editTitle, setEditTitle] = useState(null);
  const [edit, setEdit] = useState<any>(null);
  const [habits, setHabits] = useState([
    {
      title: 'Drink 100oz of Water',
      days: {
        Monday: 'Default',
        Tuesday: 'Default',
        Wednesday: 'Default',
        Thursday: 'Finished',
        Friday: 'Default',
        Saturday: 'Default',
        Sunday: 'Default',
      },
      catagory: 'goal',
    },
  ]);
  async function load() {
    try {
      const val = await EncryptedStorage.getItem('habits');
      if (val) {
        setHabits(JSON.parse(val));
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
  async function store(habits: any) {
    try {
      await EncryptedStorage.setItem('habits', JSON.stringify(habits));
      console.log('Stored:' + JSON.stringify(habits));
    } catch (error) {
      console.log('Failed to store');
    }
  }
  async function add(habit: any) {
    if (!habit) return;
    console.log(habit.title);
    let cur = {
      title: habit,
      days: {
        Monday: 'Default',
        Tuesday: 'Default',
        Wednesday: 'Default',
        Thursday: 'Default',
        Friday: 'Default',
        Saturday: 'Default',
        Sunday: 'Default',
      },
      catagory: catagory,
    };
    let has = false;
    habits.forEach(habit => {
      if (habit.title == cur.title) has = true;
    });
    if (!has) {
      store([...habits, cur]);
      setHabits([...habits, cur]);
    } else {
      ToastAndroid.show('Habit already exists', ToastAndroid.TOP);
    }
    setText('');
    setVisible(false);
    Keyboard.dismiss();
  }

  function remove(title: string) {
    let cur = habits.filter(x => x.title != title);
    store(cur);
    setHabits(cur);
  }

  function setDays(habit: any) {
    habits.forEach(cur => {
      if (cur.title === habit.title) {
        cur.days = {
          Monday: 'Default',
          Tuesday: 'Default',
          Wednesday: 'Default',
          Thursday: 'Default',
          Friday: 'Default',
          Saturday: 'Default',
          Sunday: 'Default',
        };
      }
    });
    setHabits([...habits]);
  }

  function openEditor(habit: any) {
    setEdit({...habit});
    setEditTitle(habit.title);
  }

  return (
    <View>
      <Box>
        <Text style={{fontSize: 20, alignSelf: 'center', paddingBottom: 10}}>
          Habits
        </Text>
        <ScrollView>
          {habits.map((habit, i) => {
            return (
              <Habit
                habit={habit}
                setDays={setDays}
                key={i}
                remove={remove}
                edit={openEditor}></Habit>
            );
          })}
        </ScrollView>
        <Modal
          isOpen={visible}
          onClose={() => setVisible(prev => !prev)}
          size="lg">
          <ModalBackdrop />
          <ModalContent
            h={'80%'}
            style={{backgroundColor: '#6fdc6f'}}
            paddingTop={10}>
            <ModalHeader>
              <ModalCloseButton />
            </ModalHeader>
            <Text style={{fontSize: 20}}>New Habit</Text>
            <Input>
              <InputField
                value={text}
                onChangeText={txt => setText(txt)}
                placeholder={'habit'}></InputField>
            </Input>
            <Text style={{fontSize: 20}}>Catagory</Text>
            <Input>
              <InputField
                value={catagory}
                onChangeText={txt => setCatagory(txt)}
                placeholder={'catagory'}></InputField>
            </Input>
            <Button onPress={() => add(text)}>Add</Button>
          </ModalContent>
        </Modal>
        <Button
          position={'absolute'}
          onPress={() => setVisible(prev => !prev)}
          right={15}
          top={450}>
          <ButtonIcon as={<Icon name="plus" size={20} />} />
        </Button>
        {edit && (
          <View
            style={{
              width: '80%',
              height: '60%',
              zIndex: 50,
              borderRadius: 10,
              shadowColor: '#171717',
              elevation: 20,
              top: -200,
              backgroundColor: 'white',
              alignSelf: 'center',
            }}>
            <Text>Habit title</Text>
            <Input>
              <InputField
                value={edit.title}
                onChangeText={txt => setEdit({...edit, title: txt})}
                size={'sm'}
                placeholder="Title"
              />
            </Input>
            <Text>Catagory</Text>
            <Input>
              <InputField
                value={edit.catagory}
                onChangeText={txt => setEdit({...edit, catagory: txt})}
                size={'sm'}
                placeholder="New Task"
              />
            </Input>
            <Button
              onPress={() => {
                habits.forEach(habit => {
                  if (habit.title === editTitle) {
                    habit.title = edit.title;
                    habit.catagory = edit.catagory;
                  }
                });
                setHabits(prev => [...habits]);
                setEdit(null);
                store(habits);
              }}>
              Change
            </Button>
          </View>
        )}
      </Box>
    </View>
  );
}
