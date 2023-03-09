import {View, Text, Button} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {backgroundColor} from '../utils';
const Food = props => {
  return (
    <View style={{padding: 10}}>
      <Text>{props.title}</Text>
      {props.meal?.map((item, i) => {
        // console.log(item);
        let nutrients = item.foodNutrients?.filter(item => {
          return item.nutrientName.match(
            /^(Protein|Carbohydrate, by difference|Total lipid \(fat\))$/,
          );
        });
        return (
          <View key={i} style={{paddingLeft: 10}}>
            <Text>
              {item.brandName} {item.description} {item.servingSize}{' '}
              {item.servingSizeUnit}
            </Text>
            <Text>
              {nutrients.map((nutrient, i) => {
                return (
                  <>
                    <View style={{paddingLeft: 5}} key={i}>
                      <Text>
                        {nutrient.nutrientName}
                        <Text>{nutrient.value} </Text>
                        <Text>{nutrient.unitName} </Text>
                      </Text>
                    </View>
                  </>
                );
              })}
            </Text>
            <Button
              w={50}
              top={-50}
              right={-250}
              padding={1}
              backgroundColor={backgroundColor}
              leftIcon={
                <Icon
                  name="trash-outline"
                  color={'black'}
                  size={20}
                  onPress={() => props.remove(item, props.title)}
                />
              }
            />
          </View>
        );
      })}
    </View>
  );
};

export default Food;
