import {Button, Flex, Input, Select, CheckIcon} from 'native-base';
import {useEffect, useState} from 'react';
import {View, Text} from 'react-native';

const EditFood = props => {
  const [servings, setServings] = useState({
    value: 0,
    unit: 'g',
  });
  const [nutrients, setNutrients] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  useEffect(() => {
    const serving = Number(props.food.servingSize).toPrecision(4);
    setServings({...servings, value: serving});
    var cur = {...nutrients};
    props.food.foodNutrients.map((nutrient, i) => {
      switch (nutrient.nutrientName) {
        case 'Protein':
          cur.protein = nutrient.value;
          break;
        case 'Carbohydrate, by difference':
          cur.carbs = nutrient.value;
          break;
        case 'Total lipid (fat)':
          cur.fat = nutrient.value;
          break;
        default:
          break;
      }
    });
    setNutrients({...cur});
  }, [props.food]);
  return (
    <View>
      <Text>{props.food.description}</Text>
      <Text>{props.food.additionalDescriptions}</Text>
      <Flex direction="row" style={{marginBottom: 10}}>
        <Text style={{paddingTop: 10, paddingRight: 10}}>Serving:</Text>
        <Input
          value={servings.value.toString()}
          onChangeText={text =>
            setServings({...servings, value: Number(text) || 0})
          }
          w={100}
          h={10}
        />
        <Select
          minWidth={90}
          selectedValue={servings.unit}
          style={{fontSize: 15}}
          _selectedItem={{endIcon: <CheckIcon />}}
          onValueChange={itemValue =>
            setServings({...servings, unit: itemValue})
          }>
          <Select.Item label="g" value="g" />
          <Select.Item label="ml" value="ml" />
          <Select.Item label="lbs" value="lbs" />
          <Select.Item label="oz" value="oz" />
        </Select>
      </Flex>
      <Flex direction="row">
        <Text>Protein: </Text>
        <Input
          value={nutrients.protein.toString()}
          onChangeText={text =>
            setNutrients({...nutrients, protein: parseFloat(text) || 0})
          }
          w={100}
          h={10}
        />
        <Text>g</Text>
      </Flex>
      <Flex direction="row">
        <Text>Carbs: </Text>
        <Input
          value={nutrients.carbs.toString()}
          onChangeText={text =>
            setNutrients({...nutrients, carbs: parseFloat(text)})
          }
          w={100}
          h={10}
        />
        <Text>g</Text>
      </Flex>
      <Flex direction="row">
        <Text>Fat: </Text>
        <Input
          value={nutrients.fat.toString()}
          onChangeText={text =>
            setNutrients({...nutrients, fat: parseFloat(text)})
          }
          w={100}
          h={10}
        />
        <Text>g</Text>
      </Flex>
      <Button>Add</Button>
    </View>
  );
};

export default EditFood;
