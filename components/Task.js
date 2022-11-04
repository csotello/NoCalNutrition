import React from 'react';
import { View,Text, StyleSheet, Touchable, TouchableOpacity} from 'react-native';
import  Icon  from 'react-native-vector-icons/EvilIcons';
const Task = (props) =>{

    return(
        <View style={props.style}>
            <Text id='1' style={{paddingLeft:10}}>
                {props.task}
            </Text>
            <TouchableOpacity onPress={(evt) => {props.delete(props.id)}} style={{width:50,alignSelf:"flex-end",top:-20}} >
            <View>
                <Icon size={20} color='0x900' name="trash"/>
            </View>
            </TouchableOpacity>
        </View>
    )
}
export default Task