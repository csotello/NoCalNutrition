import {
  Text,
  Flex,
  ScrollView,
  Spacer,
  View,
  IconButton,
  Center,
  Box,
  Progress,
} from 'native-base';
import {useState, useEffect} from 'react';
import styles from '../styles/styles';
import {retrieve} from '../utils';

const Nutrients = props => {
  const [goals, setGoals] = useState({
    Protein: '0',
    Fat: '0',
    Carbs: '0',
  });
  useEffect(() => {
    load();
  }, [props]);
  const load = async () => {
    let val = await retrieve('goals');
    setGoals(JSON.parse(val));
  };

  return (
    <Flex direction="column">
      <Flex direction="row">
        <Text
          style={{
            ...styles.nutrient,
            color: '#d10415',
            marginLeft: 5,
            minWidth: '20%',
          }}>
          P{'\n'}
          {props.protein || 0} / {goals?.Protein}
        </Text>
        <Center w="90%">
          <Box w="70%" marginRight={10} minWidth={'80%'}>
            <Progress
              value={(props.protein / goals?.Protein) * 100}
              _filledTrack={{bg: '#d10415'}}
              size={'xs'}
            />
          </Box>
        </Center>
      </Flex>
      <Flex direction="row">
        <Text
          style={{
            ...styles.nutrient,
            color: '#0426d1',
            minWidth: '20%',
            marginLeft: 5,
          }}>
          C{'\n'}
          {props.carbs || 0} / {goals?.Carbs}
        </Text>
        <Center w="90%">
          <Box w="70%" marginRight={10} minWidth={'80%'}>
            <Progress
              value={(props.carbs / goals?.Carbs) * 100}
              _filledTrack={{bg: '#0426d1'}}
              size={'xs'}
            />
          </Box>
        </Center>
      </Flex>
      <Flex direction="row">
        <Text
          style={{
            ...styles.nutrient,
            color: '#c7d104',
            minWidth: '20%',
            marginLeft: 5,
          }}>
          F{'\n'}
          {props.fat || 0} / {goals?.Fat}
        </Text>
        <Center w="90%">
          <Box w="70%" marginRight={10} minWidth={'80%'}>
            <Progress
              value={(props.fat / goals?.Fat) * 100}
              _filledTrack={{bg: '#c7d104'}}
              size={'xs'}
            />
          </Box>
        </Center>
      </Flex>
      <Spacer />
    </Flex>
  );
};

export default Nutrients;
