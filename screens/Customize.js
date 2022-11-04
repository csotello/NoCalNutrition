import { useState } from "react"
import { Button, Modal, TextInput, View, Text, ScrollView, TouchableOpacity } from "react-native"
import  Icon  from 'react-native-vector-icons/EvilIcons';

const Customize = () => {
    const [catagories,setCatagories] = useState([])
    const [visible,setVisible] = useState(false)
    const [text,setText] = useState('')

    const remove = (catagory) =>{
        setCatagories(catagories.filter(cat => cat != catagory))
    }
    return(
        <View>
            <Modal visible={visible} onRequestClose={() => setVisible(prev => !prev)}>
                <Text>Current Catagories</Text>
                <ScrollView>
                    {
                        catagories.map((cat,i) => {
                            return(
                                <View key={i}>
                                    <Text>{cat}</Text>
                                    <Icon size={20} name="trash" color='0x900' onPress={() => remove(cat)}/>  
                                </View>
                            )
                        })
                    }
                </ScrollView>
                <TextInput value={text} onChangeText={(txt) => setText(txt)}></TextInput>
                <Button onPress={() => setCatagories([...catagories,text])} title="Add"></Button>
            </Modal>
            <Button onPress={() => setVisible(prev => !prev)} title="Customize Catagories"></Button>
        </View>
    )
}

export default Customize