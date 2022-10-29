import React,{useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Keyboard,
  TextInput,
  Button,
  Dimensions,
} from 'react-native';
import Task from './components/Task'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [tasks,setTask] = useState([]);
  const [text,setText] = useState('');
  const add = (task) =>{
    if (task == null) return;
    setTask([...tasks,task]);
    Keyboard.dismiss();
  }
  const remove = (task) =>{
    setTask(tasks.filter((val,i) =>
      val != task
    ))
  } 
  return (
    <View style={styles.background}>
      <View>
        <Text>
          Tasks
        </Text>
        <ScrollView>{
          tasks.map((task,i) => {
            return(
              <View key={i}>
                <Task style={styles.task} task={task}></Task>
              </View>
            );
          })
        }
        </ScrollView>
      </View>
      <View>
       <TextInput 
          onChangeText={txt => setText(txt)}
          style={{height:50}}
          placeholder='text'>

        </TextInput>
        <Button 
          title="Add"
          color='#2db92d'
          onPress={(txt) => add(text)}
          style={styles.button}></Button>
        <Button 
          title="Remove"
          color='#2db92d'
          onPress={(txt) => remove(text)}
          style={styles.button}></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background:{
    backgroundColor:'#6fdc6f',
    width:width,
    height:height,
  },
  button:{
    width:width/4,
    height:50,
    // flex:1,
  },
  task:{
    backgroundColor:'#6fdc6f',
    width:500,
    height:50,
  }
});

export default App;
