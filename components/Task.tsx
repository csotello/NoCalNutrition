import React from 'react';
import { View, Text, Pressable } from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import styles from '../styles/styles';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskProps {
  task: Task;
  complete: (id: string) => void;
  delete: (id: string) => void;
  style?: any;
}

export function Task(props: TaskProps): React.JSX.Element {
  return (
    <View style={[styles.task.row, props.style]}>
      <Text
        style={{
          ...styles.task.title,
          textDecorationLine: props.task.completed ? 'line-through' : 'none',
        }}
      >
        {props.task.title}
      </Text>
      <Pressable
        testID="Complete Task"
        accessibilityRole="button"
        accessibilityLabel={`${
          props.task.completed ? 'Mark incomplete' : 'Complete'
        } ${props.task.title}`}
        style={styles.iconButton}
        onPress={() => props.complete(props.task.id)}
      >
        <FontAwesome5
          iconStyle="solid"
          size={18}
          color={styles.colors.accent}
          name="check"
        />
      </Pressable>
      <Pressable
        testID="Delete Task"
        accessibilityRole="button"
        accessibilityLabel={`Delete ${props.task.title}`}
        style={styles.iconButton}
        onPress={() => props.delete(props.task.id)}
      >
        <FontAwesome5
          iconStyle="solid"
          size={18}
          color={styles.colors.textMuted}
          name="trash"
        />
      </Pressable>
    </View>
  );
}
