import {
  Button,
  ScrollView,
  Input,
  InputField,
  View,
  HStack,
} from '@gluestack-ui/themed';
import {useState} from 'react';
// import {API_KEY} from '@env';
import {useNavigation} from '@react-navigation/native';
import {WhiteText} from '../styledComponents/WhiteText';
import {getMainNutrients} from '../utils';
import {Keyboard, Pressable, Text} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

export function SearchFood(props: any) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [text, setText] = useState('');

  /**
   * Makes API call and sets resulting data
   *
   * @param {string} food - User input to search
   */
  function search(food: string) {
    let api_key = process.env.API_KEY;
    let url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${food}&api_key=${api_key}&pageSize=8&dataType=Branded`;
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        console.log(JSON.stringify(data));
        setSearchResults([...data.foods]);
        Keyboard.dismiss();
      });
  }
  const navigation = useNavigation<StackNavigationProp<any>>();
  /**
   * Renders the search results in a list.
   *
   * @return {ReactElement} The rendered search results list.
   */
  function displaySearch() {
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
                <View
                  style={{
                    padding: 10,
                    paddingBottom: 0,
                    borderColor: 'black',
                    borderWidth: 1,
                  }}
                  key={i}>
                  {/* {item.brandOwner && <WhiteText>{item.brandOwner}</WhiteText>} */}
                  <WhiteText>{item.description}</WhiteText>
                  {item.brandName && (
                    <WhiteText style={{fontSize: 12}}>
                      {item.brandName}
                    </WhiteText>
                  )}
                  <HStack>
                    {item.servingSize && item.servingSizeUnit && (
                      <WhiteText>
                        {item.servingSize} {item.servingSizeUnit}
                      </WhiteText>
                    )}
                    {item.householdServingFullText && (
                      <WhiteText>({item.householdServingFullText})</WhiteText>
                    )}
                    <View style={{flexDirection: 'row', top: -20}}>
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
                  </HStack>
                </View>
              </Pressable>
            );
          })}
      </ScrollView>
    );
  }

  return (
    <View style={{flex: 1}}>
      <WhiteText style={{fontSize: 20}}>New Food</WhiteText>
      <Input>
        <InputField
          value={text}
          onChangeText={txt => setText(txt)}
          color="white"
          placeholder={'Cheese'}
        />
      </Input>
      <Button onPress={() => search(text)}>
        <Text>Search</Text>
      </Button>
      {searchResults && displaySearch()}
    </View>
  );
}
