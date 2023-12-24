import React, {useState, useRef, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TextInput,
  Dimensions,
  Pressable,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Task} from '../components/Task';
import uuid from 'uuid-random';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export function Tasks(): React.JSX.Element {
  const [tasks, setTask] = useState<
    {id: string; title: string; completed: boolean}[]
  >([{id: '0', title: 'Loading...', completed: false}]);
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    try {
      const val = await EncryptedStorage.getItem('tasks');
      if (val) {
        setTask(JSON.parse(val));
        console.log('Loaded Tasks');
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

  async function store(tasks: any) {
    try {
      await EncryptedStorage.setItem('tasks', JSON.stringify(tasks));
      // await storage.setItem('tasks', JSON.stringify(tasks));
      console.log('Stored:' + JSON.stringify(tasks));
    } catch (error) {
      console.log('Failed to store');
      console.log(error);
    }
  }

  function add(task: any) {
    if (task == null) return;
    let current: any[] = [
      ...tasks,
      {id: uuid(), title: task, completed: false},
    ];
    store(current);
    setTask(current);
    setText('');
    Keyboard.dismiss();
  }

  function remove(task: any) {
    setText('');
    var current = tasks.filter(val => val.id !== task);
    store(current);
    setTask(current);
  }

  function complete(task: any) {
    tasks.forEach(x => {
      if (x.id == task) {
        x.completed = !x.completed;
      }
    });
    store(tasks);
    setTask([...tasks]);
  }

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
        <Pressable onPress={() => add(text)} style={styles.button}>
          <Text>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#6fdc6f',
    width: width,
    height: height,
  },
  button: {
    width: width / 4,
    height: 50,
    color: '#2db92d',
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
