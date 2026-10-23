import { ScrollView, Text } from 'react-native';
import React from 'react';
import { Box, Button, ButtonIcon, HStack } from '@gluestack-ui/themed';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import { useState } from 'react';
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
    days[day] = cur == 'Default' ? 'Complete' : 'Default';
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
      <Box style={{ borderRadius: 10 }}>
        <HStack w={'100%'}>
          <Text style={{ paddingLeft: 20, fontSize: 20 }}>
            {props.habit.title}
          </Text>
          <Text style={{ marginLeft: 40, fontSize: 20 }}>
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
        <HStack w={'100%'}>
          {Object.keys(days).map((day, i) => {
            return (
              <Button
                testID={`Habit Day ${day}`}
                borderRadius={100}
                variant="outline"
                borderColor={'amber.100'}
                marginBottom={10}
                marginRight={2}
                w={'12%'}
                h={10}
                key={i}
                onPress={() => handleClick(day)}
                bg={days[day] == 'Default' ? '#6fdc6f' : '#178237'}
              >
                <Text>{dayText[day]}</Text>
              </Button>
            );
          })}
        </HStack>
      </Box>
    </ScrollView>
  );
}
