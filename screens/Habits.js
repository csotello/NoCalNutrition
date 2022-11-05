import { useState } from "react"
import { ScrollView, View, Text, Keyboard, ToastAndroid } from "react-native"
import {Box} from "native-base"
import Habit from "../components/Habit"
import { IconButton, Modal, Input, Button } from "native-base"
import  Icon  from "react-native-vector-icons/FontAwesome5"
import EncryptedStorage from 'react-native-encrypted-storage'
const Habits = ({route}) => {
    const [visible,setVisible] = useState(false)
    const [text,setText] = useState("")
    const [loaded,setLoaded] = useState(false)
    const [habits,setHabits] = useState([{
        title:"Drink 100oz of Water",
        days:{
            Monday:"Default",
            Tuesday:"Default",
            Wednesday:"Default",
            Thursday:"Finished",
            Friday:"Default",
            Saturday:"Default",
            Sunday:"Default",
        }
    }])
    const load = async () => {
        try {
          const val = await EncryptedStorage.getItem("habits")
          if(val){
            setHabits(JSON.parse(val))
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
    const store = async (habits)=>{
        try {
          await EncryptedStorage.setItem(
            "habits",
            JSON.stringify(habits)
          )
          console.log("Stored:" + JSON.stringify(habits))
        } catch (error) {
          console.log("Failed to store")
        }
    }
    const add = (habit) =>{
        if(!habit) return;
        console.log(habit.title)
        let cur = {
            title:habit,
            days:{
                Monday:"Default",
                Tuesday:"Default",
                Wednesday:"Default",
                Thursday:"Default",
                Friday:"Default",
                Saturday:"Default",
                Sunday:"Default",
            }
        }
        let has = false
        habits.forEach(habit=>{
            if(habit.title == cur.title)
                has = true
        })
        if(!has){
            store([...habits,cur])
            setHabits([...habits,cur])
        }
        else{
            ToastAndroid.show("Habit already exists",ToastAndroid.TOP)
        }
        setText("")
        setVisible(false)
        Keyboard.dismiss()
    }
    
    const remove = (title) =>{
        console.log(title)
        let cur = habits.filter(x => x.title != title)
        store(cur)
        setHabits(cur)
    }
    return(
        <View>
            <Box>
                <Text style={{fontSize:20,alignSelf:"center", paddingBottom:10}}>Habits</Text>
                <ScrollView>
                    {habits.map((habit,i) => {
                        return <Habit title={habit.title} days={habit.days} key={i} remove={remove}></Habit>
                    })}
                </ScrollView>
                <Modal isOpen={visible} onClose={() => setVisible(prev => !prev)} size="lg">
                    <Modal.Content h={"80%"} background="#6fdc6f" paddingTop={10}>
                        <Modal.CloseButton/>
                        <Text style={{fontSize:20}}>New Habit</Text>
                        <Input value={text} onChangeText={(txt) => setText(txt)} placeholder={"habit"}></Input>
                        <Button onPress={() => add(text)}>Add</Button>
                    </Modal.Content>
                </Modal>
                <IconButton
                    size={10}
                    rounded="100"
                    variant="solid"
                    position={"absolute"}
                    icon={<Icon name="plus" size={20}/>}
                    onPress={() => setVisible(prev => !prev)}
                    right={15}
                    top={450}
                    />
            </Box>
        </View>
    )
}

export default Habits