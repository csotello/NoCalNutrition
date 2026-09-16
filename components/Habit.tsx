import { ScrollView, Text } from 'react-native';
import React from 'react';
import {Box} from '@/components/ui/box'
import {Button, ButtonIcon} from '@/components/ui/button'
import {HStack} from '@/components/ui/hstack'
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import { useState } from 'react';
import { ChevronLeftIcon, EditIcon, TrashIcon } from './ui/icon';
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
        <HStack className="w-100">
          <Text style={{ paddingLeft: 20, fontSize: 20 }}>
            {props.habit.title}
          </Text>
          <Text style={{ marginLeft: 40, fontSize: 20 }}>
            {props.habit.catagory}
          </Text>
          <Button onPress={() => props.edit(props.habit)}>
            <ButtonIcon as={EditIcon}/>
          </Button>
          <Button onPress={() => props.remove(props.habit.title)}>
            <ButtonIcon
              as={TrashIcon}
            />
          </Button>
          <Button onPress={() => reset()}>
            <ButtonIcon
              as={ChevronLeftIcon}
            />
          </Button>
        </HStack>
        <HStack className="w-100">
          {Object.keys(days).map((day, i) => {
            let color = days[day] == 'Default' ? '#6fdc6f' : '#178237';
            return (
              <Button className={`w-12 h-10 mr-2 mb-10 rounded-full border-amber-100 bg-${color?.replace('#', '')}`} 
                key={i}
                onPress={evt => handleClick(day)}
                // bg={days[day] == 'Default' ? '#6fdc6f' : '#178237'}
              >
                {dayText[day]}
              </Button>
            );
          })}
        </HStack>
      </Box>
    </ScrollView>
  );
}
