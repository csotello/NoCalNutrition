import {Button, ScrollView} from 'native-base';
import {useState} from 'react';
import {View, Input} from 'native-base';
import {API_KEY} from '@env';
import {useNavigation} from '@react-navigation/native';
import Text from '../styledComponents/Text';

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
            console.log(item);
            return (
              <View style={{padding: 10}} key={i}>
                {item.brandName && <Text>{item.brandName}</Text>}
                {item.brandOwner && <Text>{item.brandOwner}</Text>}
                <Text>{item.description}</Text>
                {item.servingSize && item.servingSizeUnit && (
                  <Text>
                    {item.servingSize} {item.servingSizeUnit}
                  </Text>
                )}
                {item.householdServingFullText && (
                  <Text>{item.householdServingFullText}</Text>
                )}
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
                    props.setPage({
                      page: 'edit',
                      data: {...item},
                      isVisible: true,
                      isNew: true,
                    });
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
        color="white"
        placeholder={'Cheese'}
      />
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
