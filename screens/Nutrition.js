import {Button, Center, ScrollView} from 'native-base';
import {useState, useEffect} from 'react';
import {Text, View, Modal, Input, IconButton} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {API_KEY} from '@env';
import Food from '../components/Food';
import CustomFood from '../components/CustomFood';
const Nutrition = ({route}) => {
  const date = new Date().toDateString();
  const [visible, setVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [food, setFood] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });

  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [load]);

  const load = async () => {
    try {
      const val = await EncryptedStorage.getItem('nutrition');
      if (val) {
        setFood(JSON.parse(val));
        console.log('Loaded');
      }
    } catch (error) {
      console.log(error);
      console.log('Failed to load');
    }
  };
  if (!loaded) {
    load();
    setLoaded(true);
  }

  const store = async nutrition => {
    try {
      await EncryptedStorage.setItem('nutrition', JSON.stringify(tasks));
      console.log('Stored:' + JSON.stringify(nutrition));
    } catch (error) {
      console.log('Failed to store');
    }
  };

  const add = (item, meal) => {
    cur = {
      Breakfast: [...food.Breakfast],
      Lunch: [...food.Lunch],
      Dinner: [...food.Dinner],
      Snacks: [...food.Snacks],
    };
    Object.entries(cur).forEach(([key, value]) => {
      if (key === meal) {
        value = value === undefined ? [item] : [...value, item];
        cur[key] = [...value];
      }
    });
    setFood({...cur});
    store({...cur});
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
          searchResults.map((item, i) => {
            return (
              <View style={{padding: 10}} key={i}>
                <Text>{item.brandName}</Text>
                <Text>{item.description}</Text>
                {item.foodNutrients.map((nutrient, i) => {
                  if (
                    nutrient.nutrientName.match(
                      /^(Protein|Carbohydrate, by difference|Total lipid \(fat\))$/,
                    )
                  ) {
                    return (
                      <>
                        <View style={{paddingLeft: 5}}>
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
                <Button
                  h={10}
                  w={10}
                  borderRadius={50}
                  onPress={() => {
                    add({...item}, 'Lunch');
                  }}
                />
              </View>
            );
          })}
      </>
    );
  };

  return (
    <>
      <CustomFood isOpen={isOpen} close={() => setOpen(false)} />
      <Text>Nutrition</Text>
      <ScrollView>
        <Button
          w={100}
          h={10}
          position={'absolute'}
          left={300}
          onPress={() => setOpen(prev => !prev)}>
          Custom
        </Button>
        {Object.keys(food).map((meal, i) => {
          return <Food meal={[...food[meal]]} title={meal} />;
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
                return <>{displaySearch()}</>;
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
