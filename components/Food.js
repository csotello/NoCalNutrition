import {View, Text, Button, IconButton, Flex, Spacer} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {backgroundColor} from '../utils';
const Food = props => {
  return (
    <View style={{padding: 10}}>
      <Text>{props.title}</Text>
      {props.meal?.map((item, i) => {
        let nutrients = item.foodNutrients?.filter(item => {
          return item.nutrientName.match(
            /^(Protein|Carbohydrate, by difference|Total lipid \(fat\))$/,
          );
        });
        return (
          <View
            key={i}
            style={{paddingLeft: 10, marginBottom: 10, paddingBottom: 10}}>
            <Flex direction="row">
              <Flex direction="column">
                <View>
                  <Text>
                    {item.brandName} {item.description}
                  </Text>
                  <Text>
                    Amount: {Number(item.servingSize)} {item.servingSizeUnit}
                  </Text>

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
                </View>
              </Flex>
              <Spacer />
              <IconButton
                backgroundColor={backgroundColor}
                icon={<Icon size={16} name="trash-alt" />}
                onPress={() => props.remove(item, props.title)}
              />
              <Spacer />
              <IconButton
                backgroundColor={backgroundColor}
                icon={<Icon size={16} name="pencil-alt" />}
                onPress={() => {
                  props.edit(item, props.title);
                }}
              />
              <Spacer />
            </Flex>
          </View>
        );
      })}
    </View>
  );
};

export default Food;
