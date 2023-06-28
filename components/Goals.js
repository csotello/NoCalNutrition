import {useEffect, useState} from 'react';
import {Button, Flex, Input, Spacer} from 'native-base';
import EncryptedStorage from 'react-native-encrypted-storage';
import styles from '../styles/styles';
import WhiteText from '../styledComponents/WhiteText';

const Goals = props => {
  const [goals, setGoals] = useState({
    Protein: '0',
    Fat: '0',
    Carbs: '0',
  });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    load();
  }, [loaded]);

  const load = async () => {
    if (!loaded) {
      const val = JSON.parse(await EncryptedStorage.getItem('goals'));
      if (val) setGoals(val);
    }
    setLoaded(true);
  };
  const update = async () => {
    try {
      await EncryptedStorage.setItem('goals', JSON.stringify(goals));
    } catch (error) {
      console.log(error);
    }
    props.setVisible(false);
  };

  const handleInput = (name, value) => {
    value = value.replaceAll(/[^0-9.]/g, '');
    setGoals({...goals, [name]: value});
    console.log(goals);
  };

  return (
    <Flex direction="column">
      <Flex direction="row" paddingBottom={2}>
        <WhiteText style={{textAlignVertical: 'center'}}>Protein</WhiteText>
        <Spacer />
        <Input
          value={goals.Protein}
          color={'white'}
          keyboardType="numeric"
          w={'50%'}
          onChangeText={txt => {
            handleInput('Protein', txt);
          }}
        />
      </Flex>
      <Flex direction="row" paddingBottom={2}>
        <WhiteText style={{textAlignVertical: 'center'}}>Carbs</WhiteText>
        <Spacer />
        <Input
          value={goals.Carbs}
          keyboardType="numeric"
          color={'white'}
          w={'50%'}
          onChangeText={txt => {
            handleInput('Carbs', txt);
          }}
        />
      </Flex>
      <Flex direction="row">
        <WhiteText style={{textAlignVertical: 'center'}}>Fat</WhiteText>
        <Spacer />
        <Input
          value={goals.Fat}
          color={'white'}
          w={'50%'}
          keyboardType="numeric"
          onChangeText={txt => {
            handleInput('Fat', txt);
          }}
        />
      </Flex>
      <Button onPress={update} variant={'ghost'} marginTop={2}>
        Update
      </Button>
    </Flex>
  );
};

export default Goals;
