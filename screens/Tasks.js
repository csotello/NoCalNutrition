import React, {useState, useRef, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TextInput,
  Button,
  Dimensions,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Task from '../components/Task';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const Tasks = () => {
  const [tasks, setTask] = useState([]);
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    try {
      const val = await EncryptedStorage.getItem('tasks');
      if (val) {
        setTask(JSON.parse(val));
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

  const store = async tasks => {
    try {
      await EncryptedStorage.setItem('tasks', JSON.stringify(tasks));
      console.log('Stored:' + JSON.stringify(tasks));
    } catch (error) {
      console.log('Failed to store');
    }
  };

  const add = task => {
    if (task == null) return;
    var id = 0;
    tasks.forEach(task => {
      if (task.id > id) id = task.id;
    });
    id += 1;
    var current = [...tasks, {id: id, title: task, completed: false}];
    store(current);
    setTask(current);
    setText('');
    Keyboard.dismiss();
  };

  const remove = task => {
    setText('');
    var current = tasks.filter(val => val.id !== task);
    store(current);
    setTask(current);
  };

  const complete = task => {
    tasks.forEach(x => {
      if (x.id == task) {
        x.completed = !x.completed;
      }
    });
    store(tasks);
    setTask([...tasks]);
  };

  return (
    <View style={styles.background}>
      <View>
        <Text>Tasks</Text>
        <ScrollView>
          {tasks.map((task, i) => {
            return (
              <View key={i}>
                <Task
                  style={styles.task}
                  task={task}
                  delete={remove}
                  complete={complete}></Task>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View>
        <TextInput
          onChangeText={txt => setText(txt)}
          style={{height: 50}}
          placeholder="text"
          value={text}></TextInput>
        <Button
          title="Add"
          color="#2db92d"
          onPress={() => add(text)}
          style={styles.button}></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#6fdc6f',
    width: width,
    height: height,
  },
  button: {
    width: width / 4,
    height: 50,
  },
  task: {
    backgroundColor: '#6fdc6f',
    width: width,
    height: 50,
    paddingTop: 10,
    display: 'flex',
  },
});

export default Tasks;