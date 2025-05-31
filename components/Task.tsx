import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import {Button, ButtonIcon, CheckIcon, TrashIcon} from '@gluestack-ui/themed';
export function Task(props: any): React.JSX.Element {
  return (
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
          <ButtonIcon size={'md'} color="0x900" as={CheckIcon} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.delete(props.task.id);
        }}
        style={{width: 50, alignSelf: 'flex-end', top: -45, left: -10}}>
        <View>
          <ButtonIcon size={'md'} color="0x900" as={TrashIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
