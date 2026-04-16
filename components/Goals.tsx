import { useEffect, useState } from 'react';
import React from 'react';
import {
  Button,
  HStack,
  Input,
  VStack,
  InputField,
  Box,
  View,
} from '@gluestack-ui/themed';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Text, ScrollView } from 'react-native';
import styles from '../styles/styles';
import { WhiteText } from '../styledComponents/WhiteText';

interface Goals {
  [key: string]: string;
  Protein: string;
  Fat: string;
  Carbs: string;
}

function Goals(props: any) {
  const [goals, setGoals] = useState<Goals>({
    Protein: '0',
    Fat: '0',
    Carbs: '0',
  });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    load();
  }, [loaded]);

  async function load() {
    if (!loaded) {
      let val = await EncryptedStorage.getItem('goals');
      let ret;
      if (val) ret = JSON.parse(val);
      else
        ret = {
          Protein: '200',
          Fat: '50',
          Carbs: '150',
        };
      setGoals(ret);
    }
    setLoaded(true);
  }
  async function update() {
    try {
      await EncryptedStorage.setItem('goals', JSON.stringify(goals));
    } catch (error) {
      console.log(error);
    }
    props.setVisible(false);
  }

  function handleInput(name: string, value: string) {
    value = value.replaceAll(/[^0-9.]/g, '');
    setGoals({ ...goals, [name]: value });
    console.log(goals);
  }

  function displayInput(nutrient: string) {
    return (
      <HStack space="xl" paddingBottom={20}>
        <WhiteText style={{ textAlignVertical: 'center', fontSize: 16 }}>
          {nutrient}
        </WhiteText>
        <Input width={'35%'} position="absolute" right={0}>
          <InputField
            value={goals[nutrient]}
            color={'white'}
            keyboardType="numeric"
            onChangeText={txt => {
              handleInput(nutrient, txt);
            }}
          />
        </Input>
      </HStack>
    );
  }

  return (
    <ScrollView>
      {displayInput('Protein')}
      {displayInput('Carbs')}
      {displayInput('Fat')}
      <Button onPress={update} marginTop={20}>
        <Text>Update</Text>
      </Button>
    </ScrollView>
  );
}

export default Goals;
