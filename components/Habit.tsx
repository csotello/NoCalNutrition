import { ScrollView, Text } from 'react-native';
import React from 'react';
import { Box, Button, ButtonIcon, HStack } from '@gluestack-ui/themed';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import { useState } from 'react';
import styles from '../styles/styles';
export function Habit(props: any) {
  const [days, setDays] = useState<{ [key: string]: string }>(props.habit.days);
  const dayText: { [key: string]: string } = {
    Monday: 'M',
    Tuesday: 'T',
    Wednesday: 'W',
    Thursday: 'Th',
    Friday: 'F',
    Saturday: 'S',
    Sunday: 'Su',
  };
  function handleClick(day: string) {
    let cur = days[day];
    days[day] = cur === 'Default' ? 'Complete' : 'Default';
    setDays({
      ...days,
    });
  }
  function reset() {
    props.setDays(props.habit.title);
    setDays({
      Monday: 'Default',
      Tuesday: 'Default',
      Wednesday: 'Default',
      Thursday: 'Default',
      Friday: 'Default',
      Saturday: 'Default',
      Sunday: 'Default',
    });
  }

  return (
    <ScrollView>
      <Box style={styles.habit.card}>
        <HStack w={'100%'} style={styles.row}>
          <Text style={styles.habit.title}>
            {props.habit.title}
          </Text>
          <Text style={styles.habit.category}>
            {props.habit.catagory}
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
          {Object.keys(days).map((day, i) => {
            return (
              <Button
                testID={`Habit Day ${day}`}
                style={styles.habit.day}
                key={i}
                onPress={() => handleClick(day)}
                bg={days[day] === 'Default' ? styles.colors.accent : styles.colors.successDark}
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
