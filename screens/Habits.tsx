import { useEffect, useState } from 'react';
import React from 'react';
import { ScrollView, View, Text, Keyboard, ToastAndroid } from 'react-native';
import { Habit } from '../components/Habit';
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
import { FontAwesome5 } from '@react-native-vector-icons/fontawesome5';
import EncryptedStorage from 'react-native-encrypted-storage';
import styles from '../styles/styles';
import {
  isHabitType,
  defaultDays,
  HabitDayStatus,
  HabitDays,
  HabitType,
} from '../domain/habit';

export function Habits() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [editTitle, setEditTitle] = useState<string | null>(null);
  const [edit, setEdit] = useState<HabitType | null>(null);
  const [habits, setHabits] = useState<HabitType[]>([
    {
      title: 'Drink 100oz of Water',
      days: { ...defaultDays },
      category: 'goal',
    },
  ]);
  useEffect(() => {
    async function load() {
      try {
        const val = await EncryptedStorage.getItem('habits');
        if (val) {
          const parsed: unknown = JSON.parse(val);
          if (Array.isArray(parsed)) {
            setHabits(
              parsed.filter(isHabitType).map(habit => ({
                ...habit,
                category: habit.category || '',
              })),
            );
          }
        }
      } catch (error) {
        console.log('Failed to load habits', error);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);
  async function store(nextHabits: HabitType[]) {
    try {
      await EncryptedStorage.setItem('habits', JSON.stringify(nextHabits));
      console.log('Stored:' + JSON.stringify(nextHabits));
    } catch (error) {
      console.log('Failed to store');
      console.log(error);
    }
  }
  async function add(habit: string) {
    if (!loaded) return;
    if (!habit) return;
    console.log(habit);
    const cur: HabitType = {
      title: habit,
      days: { ...defaultDays },
      category,
    };
    let has = false;
    habits.forEach(habit => {
      if (habit.title === cur.title) has = true;
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
    if (!loaded) return;
    const cur = habits.filter(x => x.title !== title);
    setHabits(cur);
    store(cur);
  }

  function setDays(title: string, days: HabitDays) {
    if (!loaded) return;
    const cur = habits.map(habit =>
      habit.title === title ? { ...habit, days } : habit,
    );
    setHabits(cur);
    store(cur);
  }

  function openEditor(habit: HabitType) {
    setEdit({ ...habit });
    setEditTitle(habit.title);
  }

  return (
    <View style={styles.screen}>
      <Box style={[styles.screenContent, { flex: 1 }]}>
        <Text style={styles.screenHeading}>Habits</Text>
        <ScrollView>
          {loaded &&
            habits.map((habit, i) => {
              return (
                <Habit
                  habit={habit}
                  setDays={setDays}
                  key={i}
                  remove={remove}
                  edit={openEditor}
                />
              );
            })}
        </ScrollView>
        <Modal
          isOpen={visible}
          onClose={() => setVisible(prev => !prev)}
          size="lg"
        >
          <ModalBackdrop />
          <ModalContent
            h={'80%'}
            style={styles.dialogs.content}
            paddingTop={10}
          >
            <ModalHeader>
              <ModalCloseButton />
            </ModalHeader>
            <Text style={styles.screenHeading}>New Habit</Text>
            <Input style={styles.field}>
              <InputField
                value={text}
                onChangeText={txt => setText(txt)}
                placeholder={'habit'}
              />
            </Input>
            <Text style={styles.fieldLabel}>Category</Text>
            <Input style={styles.field}>
              <InputField
                value={category}
                onChangeText={txt => setCategory(txt)}
                placeholder={'category'}
              />
            </Input>
            <Button
              style={styles.dialogs.confirm}
              isDisabled={!loaded}
              onPress={() => add(text)}
            >
              <Text style={styles.buttonText}>Add Habit</Text>
            </Button>
          </ModalContent>
        </Modal>
        <Button
          style={styles.habits.addButton}
          isDisabled={!loaded}
          onPress={() => setVisible(prev => !prev)}
        >
          <ButtonIcon
            as={FontAwesome5}
            name="plus"
            iconStyle="solid"
            size={20}
          />
        </Button>
        {edit && (
          <View style={[styles.card, { width: '90%', alignSelf: 'center' }]}>
            <Text style={styles.fieldLabel}>Habit title</Text>
            <Input style={styles.field}>
              <InputField
                value={edit.title}
                onChangeText={txt => setEdit({ ...edit, title: txt })}
                size={'sm'}
                placeholder="Title"
              />
            </Input>
            <Text style={styles.fieldLabel}>Category</Text>
            <Input style={styles.field}>
              <InputField
                value={edit.category || ''}
                onChangeText={txt => setEdit({ ...edit, category: txt })}
                size={'sm'}
                placeholder="New Task"
              />
            </Input>
            <Button
              style={styles.dialogs.confirm}
              onPress={() => {
                if (!loaded) return;
                if (!edit) return;
                const nextHabits = habits.map(habit =>
                  habit.title === editTitle
                    ? {
                        ...habit,
                        title: edit.title,
                        category: edit.category,
                        catagory: undefined,
                      }
                    : habit,
                );
                setHabits(nextHabits);
                setEdit(null);
                store(nextHabits);
              }}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </Button>
          </View>
        )}
      </Box>
    </View>
  );
}
