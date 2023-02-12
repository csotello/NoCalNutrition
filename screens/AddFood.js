import React, {useState, useRef, useEffect} from 'react';
import {ScrollView, Text, View, TextInput, Button} from 'react-native';
import {Flex, Modal} from 'native-base';
import CreateFood from '../components/CreateFood';
import SearchFood from '../components/SearchFood';
import CustomFoods from '../components/CustomFoods';

const AddFood = props => {
  const [page, setPage] = useState('search');

  const displayPage = page => {
    if (page === 'search') return <SearchFood add={props.add} />;
    else if (page === 'custom') return <CustomFoods add={props.add} />;
    else if (page === 'create') return <CreateFood setPage={setPage} />;
  };
  const style = {
    tab: {
      width: '34%',
      padding: 10,
      justifyContent: 'center',
      marginBottom: 10,
      textAlign: 'center',
      borderColor: 'grey',
      elevation: 1,
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
            Custom Foods
          </Text>
          <Text style={style.tab} onPress={() => setPage('create')}>
            Create
          </Text>
        </Flex>
        {displayPage(page)}
      </Modal.Content>
    </Modal>
  );
};

export default AddFood;
