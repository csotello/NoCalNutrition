import {Button, ScrollView, Flex, Spacer, Input, View} from 'native-base';
import {useState} from 'react';
import {API_KEY} from '@env';
import {useNavigation} from '@react-navigation/native';
import WhiteText from '../styledComponents/WhiteText';
import {getMainNutrients} from '../utils';
import {Pressable} from 'react-native';

const SearchFood = props => {
  const [searchResults, setSearchResults] = useState([]);
  const [text, setText] = useState('');

  /**
   * Makes API call to and sets result data
   *
   * @param {string} food - User input to search
   */
  const search = food => {
    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${food}&api_key=${API_KEY}&pageSize=8&dataType=Branded`;
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        console.log(JSON.stringify(data));
        setSearchResults([...data.foods]);
      });
  };
  const navigation = useNavigation();
  /**
   * Renders the search results in a list.
   *
   * @return {ReactElement} The rendered search results list.
   */
  const displaySearch = () => {
    return (
      <ScrollView>
        {searchResults &&
          searchResults.map((item, i) => {
            console.log(JSON.stringify(item));
            let nutrients = getMainNutrients(item);
            return (
              <Pressable
                onPress={() =>
                  navigation.push('AddFood', {
                    page: 'edit',
                    food: item,
                    isNew: true,
                    date: props.date,
                  })
                }>
                <View style={{padding: 10}} key={i}>
                  {/* {item.brandOwner && <WhiteText>{item.brandOwner}</WhiteText>} */}
                  <WhiteText>{item.description}</WhiteText>
                  {item.brandName && (
                    <WhiteText style={{fontSize: 12}}>
                      {item.brandName}
                    </WhiteText>
                  )}
                  <Flex direction="row">
                    {item.servingSize && item.servingSizeUnit && (
                      <WhiteText>
                        {item.servingSize} {item.servingSizeUnit}
                      </WhiteText>
                    )}
                    {item.householdServingFullText && (
                      <WhiteText>({item.householdServingFullText})</WhiteText>
                    )}
                    <Spacer />
                    <View style={{flexDirection: 'row'}}>
                      <View style={{marginLeft: 20, minWidth: 28}}>
                        <WhiteText>P</WhiteText>
                        <WhiteText>{nutrients.protein?.value || 0}</WhiteText>
                      </View>
                      <View style={{marginLeft: 20, minWidth: 28}}>
                        <WhiteText>C</WhiteText>
                        <WhiteText>{nutrients.carbs?.value || 0}</WhiteText>
                      </View>
                      <View style={{marginLeft: 20, minWidth: 28}}>
                        <WhiteText>F</WhiteText>
                        <WhiteText>{nutrients.fat?.value || 0}</WhiteText>
                      </View>
                    </View>
                  </Flex>
                </View>
              </Pressable>
            );
          })}
      </ScrollView>
    );
  };

  return (
    <View style={{flex: 1}}>
      <WhiteText style={{fontSize: 20}}>New Food</WhiteText>
      <Input
        value={text}
        onChangeText={txt => setText(txt)}
        color="white"
        placeholder={'Cheese'}
      />
      <Button onPress={() => search(text)}>Search</Button>
      {searchResults && displaySearch()}
    </View>
  );
};

export default SearchFood;
