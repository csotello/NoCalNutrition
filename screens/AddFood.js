import React, {useState, useRef, useEffect} from 'react';
import {ScrollView, Text, View, TextInput, Button} from 'react-native';
import {Flex, Modal} from 'native-base';
import CustomFood from '../components/CustomFood';
import SearchFood from '../components/SearchFood';

const AddFood = props => {
  const [page, setPage] = useState('search');

  const displayPage = page => {
    if (page === 'search') return <SearchFood add={props.add} />;
    else if (page === 'custom') return <CustomFood />;
  };
  const style = {
    tab: {
      width: '50%',
      borderWidth: 1,
      padding: 15,
      justifyContent: 'center',
      marginBottom: 10,
    },
  };
  return (
    <Modal isOpen={props.isOpen} onClose={() => props.close()} size="lg">
      <Modal.Content
        h={'100%'}
        background="#6fdc6f"
        paddingTop={10}
        width={'100%'}>
        <Modal.CloseButton />
        <Flex direction="row">
          <Text style={style.tab} onPress={() => setPage('search')}>
            Search
          </Text>
          <Text style={style.tab} onPress={() => setPage('custom')}>
            Custom
          </Text>
        </Flex>
        {displayPage(page)}
      </Modal.Content>
    </Modal>
  );
};

export default AddFood;
