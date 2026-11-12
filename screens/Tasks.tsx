import React, { useState } from 'react';
import { ScrollView, Text, View, Keyboard, TextInput, Pressable } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Task } from '../components/Task';
import uuid from 'uuid-random';
import styles from '../styles/styles';

export function Tasks(): React.JSX.Element {
  const [tasks, setTask] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    EncryptedStorage.getItem('tasks').then(val => {
      if (val) setTask(JSON.parse(val));
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }

  async function store(nextTasks: any) {
    try { await EncryptedStorage.setItem('tasks', JSON.stringify(nextTasks)); }
    catch (error) { console.log('Failed to store', error); }
  }
  function add(task: string) {
    if (!task.trim()) return;
    const current = [...tasks, { id: uuid(), title: task.trim(), completed: false }];
    store(current); setTask(current); setText(''); Keyboard.dismiss();
  }
  function remove(id: string) {
    const current = tasks.filter(task => task.id !== id);
    store(current); setTask(current);
  }
  function complete(id: string) {
    const current = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    store(current); setTask(current);
  }

  return (
    <View style={styles.task.screen}>
      <Text style={styles.screenHeading}>Tasks</Text>
      <ScrollView style={{ flex: 1 }}>
        {tasks.map(task => <Task key={task.id} task={task} delete={remove} complete={complete} />)}
        {loaded && tasks.length === 0 && <Text style={styles.typography.muted}>No tasks yet. Add one to get started.</Text>}
      </ScrollView>
      <View style={styles.row}>
        <TextInput
          onChangeText={setText}
          style={[styles.task.input, { flex: 1, marginRight: 8 }]}
          placeholder="text"
          placeholderTextColor={styles.colors.textMuted}
          value={text}
          accessibilityLabel="New task"
        />
        <Pressable onPress={() => add(text)} style={styles.button} accessibilityRole="button">
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Tasks;
