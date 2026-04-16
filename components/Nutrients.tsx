import {
  Text,
  ScrollView,
  View,
  Center,
  Box,
  Progress,
  VStack,
  HStack,
} from '@gluestack-ui/themed';
import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../styles/styles';
import { retrieve } from '../utils';

interface Nutrients {
  [key: string]: string;
  Protein: string;
  Fat: string;
  Carbs: string;
}

export function Nutrients(props: Nutrients) {
  const [goals, setGoals] = useState<Nutrients>({
    Protein: '0',
    Fat: '0',
    Carbs: '0',
  });
  useEffect(() => {
    load();
  }, [props]);
  async function load() {
    let val = await retrieve('goals');
    let ret = val ? JSON.parse(val) : { Protein: '0', Fat: '0', Carbs: '0' };
    setGoals(ret);
  }

  function nutrient(name: string) {
    let color;
    switch (name) {
      case 'Protein':
        color = '#d10415';
        break;
      case 'Fat':
        color = '#c7d104';
        break;
      case 'Carbs':
        color = '#0426d1';
        break;
    }
    return (
      <HStack>
        <Text
          style={{
            ...styles.nutrient,
            color: color,
          }}
        >
          {name}
          {'  '}
          {props[name] || 0} / {goals[name]}
        </Text>
        <Center w="80%">
          <Box w="70%" marginRight={30}>
            <Progress value={(Number(props[name]) / Number(goals[name])) * 100}>
              <Progress.FilledTrack bg={color} />
            </Progress>
          </Box>
        </Center>
      </HStack>
    );
  }

  return (
    <VStack>
      {nutrient('Protein')}
      {nutrient('Fat')}
      {nutrient('Carbs')}
    </VStack>
  );
}

export default Nutrients;
