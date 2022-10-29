import React from 'react';
import { View,Text, StyleSheet} from 'react-native';
const Task = (props) =>{

    return(
        <View style={props.style}>
            <Text>{props.task}</Text>
        </View>
    )
}
export default Task