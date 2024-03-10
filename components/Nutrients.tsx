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
import {useState, useEffect} from 'react';
import styles from '../styles/styles';
import {retrieve} from '../utils';

export function Nutrients(props: any) {
  const [goals, setGoals] = useState({
    Protein: '0',
    Fat: '0',
    Carbs: '0',
  });
  useEffect(() => {
    load();
  }, [props]);
  async function load() {
    let val = await retrieve('goals');
    let ret;
    if (val) ret = JSON.parse(val);
    else
      ret = {
        Protein: '0',
        Fat: '0',
        Carbs: '0',
      };
    setGoals(ret);
  }

  return (
    <VStack>
      <HStack>
        <Text
          style={{
            ...styles.nutrient,
            color: '#d10415',
          }}>
          Protein{'  '}
          {props.protein || 0} / {goals?.Protein}
        </Text>
        <Center w="80%">
          <Box w="70%" marginRight={30}>
            <Progress value={(props.protein / Number(goals?.Protein)) * 100}>
              <Progress.FilledTrack bg="#d10415" />
            </Progress>
          </Box>
        </Center>
      </HStack>
      <HStack>
        <Text
          style={{
            ...styles.nutrient,
            color: '#0426d1',
          }}>
          Carbs{'  '} {props.carbs || 0} / {goals?.Carbs}
        </Text>
        <Center w="80%">
          <Box w="70%" marginRight={30}>
            <Progress value={(props.carbs / Number(goals?.Carbs)) * 100}>
              <Progress.FilledTrack bg="#0426d1" />
            </Progress>
          </Box>
        </Center>
      </HStack>
      <HStack>
        <Text
          style={{
            ...styles.nutrient,
            color: '#c7d104',
          }}>
          Fat{'  '}
          {props.fat || 0} / {goals?.Fat}
        </Text>
        <Center w="80%">
          <Box w="70%" marginRight={30}>
            <Progress value={(props.fat / Number(goals?.Fat)) * 100}>
              <Progress.FilledTrack bg="#c7d104" />
            </Progress>
          </Box>
        </Center>
      </HStack>
    </VStack>
  );
}

export default Nutrients;
