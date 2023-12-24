import {useEffect, useState} from 'react';
import {Button, HStack, Input, VStack, InputField} from '@gluestack-ui/themed';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Text} from 'react-native';
import styles from '../styles/styles';
import {WhiteText} from '../styledComponents/WhiteText';

function Goals(props: any) {
  const [goals, setGoals] = useState({
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
    setGoals({...goals, [name]: value});
    console.log(goals);
  }

  return (
    <VStack>
      <HStack>
        <WhiteText style={{textAlignVertical: 'center'}}>Protein</WhiteText>
        <Input>
          <InputField
            value={goals.Protein}
            color={'white'}
            keyboardType="numeric"
            w={'50%'}
            onChangeText={txt => {
              handleInput('Protein', txt);
            }}
          />
        </Input>
      </HStack>
      <HStack>
        <WhiteText style={{textAlignVertical: 'center'}}>Carbs</WhiteText>
        <Input>
          <InputField
            value={goals.Carbs}
            keyboardType="numeric"
            color={'white'}
            w={'50%'}
            onChangeText={txt => {
              handleInput('Carbs', txt);
            }}
          />
        </Input>
      </HStack>
      <HStack>
        <WhiteText style={{textAlignVertical: 'center'}}>Fat</WhiteText>
        <Input>
          <InputField
            value={goals.Fat}
            color={'white'}
            w={'50%'}
            keyboardType="numeric"
            onChangeText={txt => {
              handleInput('Fat', txt);
            }}
          />
        </Input>
      </HStack>
      <Button onPress={update} marginTop={2}>
        <Text>Update</Text>
      </Button>
    </VStack>
  );
}

export default Goals;
