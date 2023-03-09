import React, {useState, useRef, useEffect} from 'react';
import {ScrollView, Text, View, TextInput, Button} from 'react-native';
import {Flex, Modal} from 'native-base';
import CreateFood from '../components/CreateFood';
import SearchFood from '../components/SearchFood';
import CustomFoods from '../components/CustomFoods';
import EditFood from '../components/EditFood';

const AddFood = props => {
  const [page, setPage] = useState({title: 'search', data: {}});

  const displayPage = page => {
    if (page.title === 'search')
      return <SearchFood add={props.add} setPage={setPage} />;
    else if (page.title === 'custom') return <CustomFoods add={props.add} />;
    else if (page.title === 'create') return <CreateFood setPage={setPage} />;
    else if (page.title === 'edit')
      return <EditFood food={page.data} setPage={setPage} add={props.add} />;
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
          <Text
            style={style.tab}
            onPress={() => setPage({title: 'search', data: {}})}>
            Search
          </Text>
          <Text
            style={style.tab}
            onPress={() => setPage({title: 'custom', data: {}})}>
            Custom Foods
          </Text>
          <Text
            style={style.tab}
            onPress={() => setPage({title: 'create', data: {}})}>
            Create
          </Text>
        </Flex>
        {displayPage(page)}
      </Modal.Content>
    </Modal>
  );
};

export default AddFood;
