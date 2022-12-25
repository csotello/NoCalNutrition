import {View, Text} from 'native-base';

const Food = props => {
  return (
    <View style={{padding: 10}}>
      <Text>{props.title}</Text>
      {props.meal.map((item, i) => {
        return (
          <View key={i} style={{paddingLeft: 10}}>
            <Text>{item.name}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default Food;
