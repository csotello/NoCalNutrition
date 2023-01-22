import {Button, Center, ScrollView} from 'native-base';
import {useState, useEffect} from 'react';
import {Text, View, Modal, Input, IconButton} from 'native-base';
import {API_KEY} from '@env';
const SearchFood = props => {
  const [searchResults, setSearchResults] = useState([]);
  const [text, setText] = useState('');
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
            console.log(item);
            return (
              <View style={{padding: 10}} key={i}>
                <Text>{item.brandName}</Text>
                <Text>{item.brandOwner}</Text>
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
                    props.add({...item}, 'Lunch');
                  }}
                />
              </View>
            );
          })}
      </>
    );
  };

  return (
    <Modal isOpen={props.visible} onClose={() => props.close()} size="lg">
      <Modal.Content h={'80%'} background="#6fdc6f" paddingTop={10} w={'100%'}>
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
  );
};

export default SearchFood;
