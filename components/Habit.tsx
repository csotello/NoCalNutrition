import { ScrollView, Text } from 'react-native';
import React from 'react';
import { Box, Button, ButtonIcon, HStack } from '@gluestack-ui/themed';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import styles from '../styles/styles';
import { defaultDays, HabitDay, HabitDays, HabitType } from '../domain/habit';

interface HabitProps {
  habit: HabitType;
  setDays: (title: string, days: HabitDays) => void;
  edit: (habit: HabitType) => void;
  remove: (title: string) => void;
}

export function Habit(props: HabitProps) {
  const days = props.habit.days;
  const dayText: Record<HabitDay, string> = {
    Monday: 'M',
    Tuesday: 'T',
    Wednesday: 'W',
    Thursday: 'Th',
    Friday: 'F',
    Saturday: 'S',
    Sunday: 'Su',
  };
  function handleClick(day: HabitDay) {
    props.setDays(props.habit.title, {
      ...days,
      [day]: days[day] === 'Default' ? 'Complete' : 'Default',
    });
  }
  function reset() {
    props.setDays(props.habit.title, { ...defaultDays });
  }

  return (
    <ScrollView>
      <Box style={styles.habit.card}>
        <HStack w={'100%'} style={styles.row}>
          <Text style={styles.habit.title}>{props.habit.title}</Text>
          <Text style={styles.habit.category}>
            {props.habit.category || props.habit.catagory || ''}
          </Text>
          <Button testID="Edit Habit" onPress={() => props.edit(props.habit)}>
            <ButtonIcon
              as={FontAwesome5}
              iconStyle="solid"
              name="edit"
              size={30}
            />
          </Button>
          <Button
            testID="Remove Habit"
            onPress={() => props.remove(props.habit.title)}
          >
            <ButtonIcon
              as={FontAwesome5}
              iconStyle="solid"
              name="trash"
              size={30}
            />
          </Button>
          <Button testID="Reset Habit" onPress={() => reset()}>
            <ButtonIcon
              as={FontAwesome5}
              iconStyle="solid"
              name="undo"
              size={30}
            />
          </Button>
        </HStack>
        <HStack w={'100%'} style={{ flexWrap: 'wrap' }}>
          {(Object.keys(days) as HabitDay[]).map((day, i) => {
            return (
              <Button
                testID={`Habit Day ${day}`}
                style={styles.habit.day}
                key={i}
                onPress={() => handleClick(day)}
                bg={
                  days[day] === 'Default'
                    ? styles.colors.accent
                    : styles.colors.successDark
                }
              >
                <Text style={styles.habit.dayText}>{dayText[day]}</Text>
              </Button>
            );
          })}
        </HStack>
      </Box>
    </ScrollView>
  );
}
