import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Keyboard,
  TextInput,
  Pressable,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import uuid from 'uuid-random';
import styles from '../styles/styles';
import { Task } from '../components/Task.tsx';
import { isTaskType, TaskType } from '../domain/task.ts';

export function Tasks(): React.JSX.Element {
  const [tasks, setTask] = useState<TaskType[]>([]);
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const val = await EncryptedStorage.getItem('tasks');
        if (val) {
          const parsed: unknown = JSON.parse(val);
          if (Array.isArray(parsed)) {
            setTask(parsed.filter(isTaskType));
          }
        }
      } catch (error) {
        console.log('Failed to load tasks', error);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  async function store(nextTasks: TaskType[]) {
    try {
      await EncryptedStorage.setItem('tasks', JSON.stringify(nextTasks));
    } catch (error) {
      console.log('Failed to store', error);
    }
  }
  function add(task: string) {
    if (!loaded) return;
    if (!task.trim()) return;
    const current: TaskType[] = [
      ...tasks,
      { id: uuid(), title: task.trim(), completed: false },
    ];
    store(current);
    setTask(current);
    setText('');
    Keyboard.dismiss();
  }
  function remove(id: string) {
    if (!loaded) return;
    const current = tasks.filter(task => task.id !== id);
    store(current);
    setTask(current);
  }
  function complete(id: string) {
    if (!loaded) return;
    const current = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    store(current);
    setTask(current);
  }

  return (
    <View style={styles.task.screen}>
      <Text style={styles.screenHeading}>Tasks</Text>
      <ScrollView style={{ flex: 1 }}>
        {tasks?.map(task => (
          <Task key={task.id} task={task} delete={remove} complete={complete} />
        ))}
        {loaded && tasks.length === 0 && (
          <Text style={styles.typography.muted}>
            No tasks yet. Add one to get started.
          </Text>
        )}
      </ScrollView>
      <View style={styles.row}>
        <TextInput
          onChangeText={setText}
          editable={loaded}
          style={[styles.task.input, { flex: 1, marginRight: 8 }]}
          placeholder="text"
          placeholderTextColor={styles.colors.textMuted}
          value={text}
          accessibilityLabel="New task"
        />
        <Pressable
          disabled={!loaded}
          onPress={() => add(text)}
          style={styles.button}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}
