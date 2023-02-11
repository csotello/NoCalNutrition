import {Button, Center, ScrollView} from 'native-base';
import {useState, useEffect} from 'react';
import {Text, View, Modal, Input, IconButton} from 'native-base';
import {API_KEY} from '@env';
import {useNavigation} from '@react-navigation/native';
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
  const navigation = useNavigation();
  const displaySearch = () => {
    return (
      <>
        {searchResults &&
          searchResults.map((item, i) => {
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
                        <View style={{paddingLeft: 5}} key={i}>
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
    <View>
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
    </View>
  );
};

export default SearchFood;
