import {Text} from 'react-native';
import {Flex, Modal} from 'native-base';
import CreateFood from '../components/CreateFood';
import SearchFood from '../components/SearchFood';
import CustomFoods from '../components/CustomFoods';
import EditFood from '../components/EditFood';
import styles from '../styles/styles';

const AddFood = props => {
  const setPage = page => {
    props.setInfo({...page});
  };

  const displayPage = page => {
    switch (page) {
      case 'search':
        return <SearchFood add={props.add} setPage={setPage} />;
      case 'custom':
        return <CustomFoods add={props.add} setPage={setPage} />;
      case 'create':
        return <CreateFood setPage={setPage} />;
      case 'edit':
        return (
          <EditFood
            food={props.info.data}
            add={props.add}
            close={props.close}
            edit={props.edit}
            isNew={props.info.isNew}
          />
        );
      default:
        return <Text>Error</Text>;
    }
  };

  return (
    <Modal
      isOpen={props.info.isVisible}
      onClose={() => props.close()}
      size="lg">
      <Modal.Content
        h={'100%'}
        background="#6fdc6f"
        paddingTop={10}
        width={'100%'}>
        <Modal.CloseButton />
        <Flex direction="row">
          <Text
            style={styles.modalTab}
            onPress={() =>
              setPage({
                ...props.info,
                page: 'search',
              })
            }>
            Search
          </Text>
          <Text
            style={styles.modalTab}
            onPress={() =>
              setPage({
                ...props.info,
                page: 'custom',
              })
            }>
            Custom Foods
          </Text>
          <Text
            style={styles.modalTab}
            onPress={() =>
              setPage({
                ...props.info,
                page: 'create',
              })
            }>
            Create
          </Text>
        </Flex>
        {displayPage(props.info.page)}
      </Modal.Content>
    </Modal>
  );
};

export default AddFood;
