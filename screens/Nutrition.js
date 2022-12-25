import {Button, ScrollView} from 'native-base';
import {useState} from 'react';
import {Text, View, Modal, Input, IconButton} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {API_KEY} from '@env';
import Food from '../components/Food';
const Nutrition = ({route}) => {
  const date = new Date().toDateString();
  const [visible, setVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [text, setText] = useState('');
  const [food, setFood] = useState({
    Breakfast: [{name: 'toast'}],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });
  const add = (item, meal) => {
    setFood({
      ...food,
      meal: [...food[meal], item],
    });
  };

  const search = food => {
    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${food}&api_key=${API_KEY}&pageSize=1`;
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        setSearchResults([...data.foods]);
      });
  };

  const displaySearch = () => {
    return (
      <>
        {searchResults &&
          searchResults.map(item => {
            return (
              <View>
                <Text>{item.brandName}</Text>
                <Text>{item.brandOwner}</Text>
                <Text>{item.description}</Text>
                {item.foodNutrients.map((nutrient, i) => {
                  if (
                    nutrient.nutrientName.match(
                      /^(Protein|Carbohydrate, by difference|Energy|Total lipid \(fat\))$/,
                    )
                  ) {
                    return (
                      <>
                        <View>
                          <Text>
                            {nutrient.nutrientName} {nutrient.value}{' '}
                            {nutrient.unitName}{' '}
                          </Text>
                        </View>
                      </>
                    );
                  } else {
                    return <></>;
                  }
                })}
              </View>
            );
          })}
      </>
    );
  };

  return (
    <>
      <Text>Nutrition</Text>
      <ScrollView>
        {Object.keys(food).map((meal, i) => {
          return <Food meal={food[meal]} title={meal} />;
        })}
      </ScrollView>
      <Modal
        isOpen={visible}
        onClose={() => setVisible(prev => !prev)}
        size="lg">
        <Modal.Content h={'80%'} background="#6fdc6f" paddingTop={10}>
          <Modal.CloseButton />
          <Text style={{fontSize: 20}}>New Food</Text>
          <Input
            value={text}
            onChangeText={txt => setText(txt)}
            placeholder={'Cheese'}></Input>
          <Button onPress={() => search(text)}>Search</Button>
          <ScrollView>
            {searchResults &&
              searchResults.map(item => {
                return (
                  <>
                    <Text>{JSON.stringify(item)}</Text>
                    {displaySearch()}
                  </>
                );
              })}
          </ScrollView>
        </Modal.Content>
      </Modal>
      <IconButton
        size={10}
        rounded="100"
        variant="solid"
        position={'absolute'}
        icon={<Icon name="plus" size={20} />}
        onPress={() => setVisible(prev => !prev)}
        right={15}
        top={450}
      />
    </>
  );
};

export default Nutrition;
