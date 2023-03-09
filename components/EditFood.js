import {View, Text} from 'react-native';

const EditFood = props => {
  console.log(props.food);
  console.log('Edit page');
  return (
    <View style={{zIndex: 99}}>
      <Text>Edit</Text>
      <Text>{props.food.description}</Text>
      {props.food.foodNutrients.map((nutrient, i) => {
        if (
          nutrient.nutrientName.match(
            /^(Protein|Carbohydrate, by difference|Total lipid \(fat\))$/,
          )
        ) {
          return (
            <>
              <View style={{paddingLeft: 5}} key={i}>
                <Text>
                  {nutrient.nutrientName} {nutrient.value} {nutrient.unitName}{' '}
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
};

export default EditFood;
