import {
  Button,
  Flex,
  Input,
  Select,
  CheckIcon,
  Spacer,
  IconButton,
} from 'native-base';
import {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
const EditFood = props => {
  const [servings, setServings] = useState({
    value: 0,
    unit: props.food.servingSizeUnit || 'g',
  });
  const [nutrients, setNutrients] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [meal, setMeal] = useState(props.food.meal || 'Breakfast');

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

  const addFood = () => {
    var newFood = {...props.food};
    newFood.servingSize = servings.value;
    newFood.servingSizeUnit = servings.unit;
    newFood.foodNutrients.map((nutrient, i) => {
      switch (nutrient.nutrientName) {
        case 'Protein':
          nutrient.value = nutrients.protein;
          break;
        case 'Carbohydrate, by difference':
          nutrient.value = nutrients.carbs;
          break;
        case 'Total lipid (fat)':
          nutrient.value = nutrients.fat;
          break;
        default:
          break;
      }
    });
    if (props.isNew) props.add(newFood, meal);
    else props.edit(newFood, meal);
    props.close();
  };

  const displayNutrient = nutrient => {
    return (
      <View>
        <Text>{nutrient}: </Text>
        <IconButton
          icon={<Icon name="caret-up" size={10} />}
          variant="ghost"
          onPress={() => {
            cur = {...nutrients};
            cur[nutrient.toLowerCase()] += 1;
            setNutrients({...cur});
          }}
        />
        <Flex direction="row">
          <Input
            paddingLeft={10}
            marginRight={3}
            value={nutrients[nutrient.toLowerCase()].toString()}
            onChangeText={text => {
              let cur = {...nutrients};
              cur[nutrient.toLowerCase()] =
                parseFloat(text).toPrecision(4) || 0;
              setNutrients({...cur});
            }}
            w={100}
            h={10}
          />
          <Text>g</Text>
        </Flex>
        <IconButton
          icon={<Icon name="caret-down" size={10} />}
          variant="ghost"
          onPress={() => {
            cur = {...nutrients};
            cur[nutrient.toLowerCase()] -= 1;
            setNutrients({...cur});
          }}
        />
      </View>
    );
  };

  return (
    <View>
      <Text>{props.food.description}</Text>
      <Text>{props.food.additionalDescriptions}</Text>
      <Text>Meal:</Text>
      <Select
        minWidth={90}
        selectedValue={meal}
        style={{fontSize: 15}}
        _selectedItem={{endIcon: <CheckIcon />}}
        onValueChange={itemValue => setMeal(itemValue)}>
        <Select.Item label="Breakfast" value="Breakfast" />
        <Select.Item label="Lunch" value="Lunch" />
        <Select.Item label="Dinner" value="Dinner" />
        <Select.Item label="Snacks" value="Snacks" />
      </Select>
      <Flex direction="row" style={{marginBottom: 10}}>
        <Text style={{paddingTop: 10, paddingRight: 10}}>Amount:</Text>
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
        {displayNutrient('Protein')}
        <Spacer />
        {displayNutrient('Fat')}
        <Spacer />
        {displayNutrient('Carbs')}
      </Flex>
      <Button
        onPress={() => {
          addFood();
        }}>
        Add
      </Button>
    </View>
  );
};

export default EditFood;
