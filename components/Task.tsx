import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

export function Task(props: any): React.JSX.Element {
    return(
    <View style={props.style}>
      <Text
        id="1"
        style={{
          paddingLeft: 10,
          textDecorationLine: props.task.completed ? 'line-through' : 'none',
          textDecorationStyle: 'solid',
        }}>
        {props.task.title}
      </Text>
      <TouchableOpacity
        onPress={() => {
          props.complete(props.task.id);
        }}
        style={{width: 50, alignSelf: 'flex-end', top: -20, left: -50}}>
        <View>
          <Icon size={30} color="0x900" name="check" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.delete(props.task.id);
        }}
        style={{width: 50, alignSelf: 'flex-end', top: -45, left: -10}}>
        <View>
          <Icon size={30} color="0x900" name="trash" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

