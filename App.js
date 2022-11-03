import React,{useState,useRef, useEffect} from 'react';
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
import EncryptedStorage from 'react-native-encrypted-storage'
import Task from './components/Task'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const App = () => {
  const [tasks,setTask] = useState([]);
  const [text,setText] = useState('');
  const [loaded,setLoaded] = useState(false)
  const load = async () => {
    try {
      const val = await EncryptedStorage.getItem("tasks")
      if(val){
        setTask(JSON.parse(val))
        console.log("Loaded")
      }
    } catch (error) {
      console.log(error)
      console.log("Failed to load")
    }
  }
  if(!loaded){
    load()
    setLoaded(true)
  }
  const store = async (tasks)=>{
    try {
      await EncryptedStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
      )
      console.log("Stored:" + JSON.stringify(tasks))
    } catch (error) {
      console.log("Failed to store")
    }
  }
  const add = (task) =>{
    if (task == null) return;
    var current = [...tasks,task]
    store(current)
    setTask([...tasks,task]);
    setText("");
    Keyboard.dismiss();
  }
  const remove = (task) =>{
    setText("");
    var current = tasks.filter((val,i) =>
    val != task
  )
    store(current)
    setTask(current)
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
                <Task style={styles.task} task={task} delete={remove}></Task>
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
          placeholder='text'
          value={text}>

        </TextInput>
        <Button 
          title="Add"
          color='#2db92d'
          onPress={() => add(text)}
          style={styles.button}></Button>
        <Button 
          title="Remove"
          color='#2db92d'
          onPress={() => remove(text)}
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
  },
  task:{
    backgroundColor:'#6fdc6f',
    width:width,
    height:50,
    paddingTop:10,
    display:'flex',
  }
});

export default App;
