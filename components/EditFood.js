import {
  Button,
  Flex,
  Input,
  Select,
  CheckIcon,
  Spacer,
  IconButton,
} from 'native-base';
import uuid from 'uuid-random';
import {useEffect, useState, useRef} from 'react';
import {View, Text, ScrollView, Pressable} from 'react-native';
import WhiteText from '../styledComponents/WhiteText';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {convertCustomFood, store, retrieve} from '../utils';

const EditFood = props => {
  const [servings, setServings] = useState({
    servingSize: 0,
    servings: 1,
    servingSizeUnit: props.food.servingSizeUnit || 'g',
  });
  const [descriptors, setDescriptors] = useState({
    brandName: props.food.brandName || '',
    description: props.food.description || '',
    additionalDescriptions: props.food.additionalDescriptions || '',
    category: props.food.category || '',
  });
  const [nutrients, setNutrients] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
    sodium: 0,
    cholesterol: 0,
    fiber: 0,
    sugar: 0,
    saturatedFat: 0,
    sodium: 0,
  });
  const [meal, setMeal] = useState('Breakfast');
  const [dropdown, setDropdown] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current.scrollToEnd({animated: true});
  }, [dropdown]);

  useEffect(() => {
    var serving = props.food.servingSize || 0;
    if (props.food.foodMeasures?.length > 0) {
      serving = props.food.foodMeasures[0].gramWeight || serving;
    }
    setServings({...servings, servingSize: serving});
    var cur = {...nutrients};
    props.food.foodNutrients?.map((nutrient, i) => {
      switch (nutrient.nutrientName) {
        case 'Protein':
          cur.protein = Number(nutrient.value);
          break;
        case 'Carbohydrate, by difference':
          cur.carbs = Number(nutrient.value);
          break;
        case 'Total lipid (fat)':
          cur.fat = Number(nutrient.value);
          break;
        case 'Sugars, total including NLEA':
          cur.sugar = Number(nutrient.value);
          break;
        case 'Fiber, total dietary':
          cur.fiber = Number(nutrient.value);
          break;
        case 'Sodium, Na':
          cur.sodium = Number(nutrient.value);
          break;
        case 'Cholesterol':
          cur.cholesterol = Number(nutrient.value);
          break;
        case 'Fatty acids, total saturated':
          cur.saturatedFat = Number(nutrient.value);
          break;
        default:
          break;
      }
    });
    setNutrients({...cur});
  }, [props.food]);

  /**
   * Adds or edits food item with current input
   */
  const addFood = async () => {
    var newFood = {...props.food};
    newFood.servingSize = servings.servingSize;
    newFood.servingSizeUnit = servings.servingSizeUnit;
    newFood.servings = servings.servings;
    newFood.brandName = descriptors.brandName;
    newFood.description = descriptors.description;
    newFood.additionalDescriptions = descriptors.additionalDescriptions;
    newFood.category = descriptors.category;
    newFood.foodNutrients?.map((nutrient, i) => {
      switch (nutrient.nutrientName) {
        case 'Protein':
          console.log('Protein: ', nutrients.protein);
          nutrient.value = nutrients.protein;
          break;
        case 'Carbohydrate, by difference':
          console.log('Carbohydrate, by difference: ', nutrients.carbs);
          nutrient.value = nutrients.carbs;
          break;
        case 'Total lipid (fat)':
          console.log('Total lipid (fat): ', nutrients.fat);
          nutrient.value = nutrients.fat;
          break;
        case 'Sugars, total including NLEA':
          console.log('Sugars, total including NLEA: ', nutrients.sugar);
          nutrient.value = nutrients.sugar;
          break;
        case 'Fiber, total dietary':
          console.log('Fiber, total dietary: ', nutrients.fiber);
          nutrient.value = nutrients.fiber;
          break;
        case 'Sodium, Na':
          nutrient.value = nutrients.sodium;
          break;
        case 'Cholesterol':
          nutrient.value = nutrients.cholesterol;
          break;
        case 'Fatty acids, total saturated':
          nutrient.value = nutrients.saturatedFat;
          break;
        default:
          break;
      }
    });
    console.log(props.isNew ? 'New' : 'Edit');
    console.log(props.isCustom ? 'Custom' : 'Normal');
    if (props.isNew) {
      // await props.add({...newFood}, meal);
      if (props.isCustom) {
        let custom = convertCustomFood({
          ...nutrients,
          ...descriptors,
          ...servings,
        });
        newFood = custom;
        console.log('Converted' + JSON.stringify(newFood));
        await createCustom(newFood);
      }
      await props.add({...newFood}, meal);
    } else {
      if (props.isCustom) {
        await props.editCustom({...newFood});
        return;
      }
      await props.edit({...newFood}, meal);
    }
  };

  /**
   * Creates a custom food
   *
   * @param {object} newFood - new food to create
   */
  const createCustom = async newFood => {
    newFood['UUID'] = uuid();
    console.log('Create');
    console.log(newFood);
    var val = JSON.parse(await retrieve('customFood'));
    if (val) val.push(newFood);
    else val = [newFood];
    console.log('Custom After');
    console.log(val);
    await store('customFood', JSON.stringify(val));
  };

  /**
   * Renders a provided nutrient
   *
   * @param {object} nutrient - nutrient to display
   */
  const displayNutrient = nutrient => {
    return (
      <View>
        <WhiteText>{nutrient}: </WhiteText>
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
            color={'white'}
            paddingLeft={10}
            marginRight={3}
            keyboardType="number-pad"
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
          <WhiteText style={{fontSize: 15, alignSelf: 'center'}}>g</WhiteText>
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
    <ScrollView ref={scrollRef}>
      <Flex direction="column" style={{marginBottom: 10}}>
        <WhiteText>Brand Name:</WhiteText>
        <Input
          color={'white'}
          value={descriptors.brandName}
          onChangeText={text =>
            setDescriptors({...descriptors, brandName: text})
          }
        />
        <WhiteText>Description:</WhiteText>
        <Input
          color={'white'}
          value={descriptors.description}
          onChangeText={text =>
            setDescriptors({...descriptors, description: text})
          }
        />
        <WhiteText>Additional Description:</WhiteText>
        <Input
          color={'white'}
          value={descriptors.additionalDescriptions}
          onChangeText={text =>
            setDescriptors({...descriptors, additionalDescriptions: text})
          }
        />
        <WhiteText>Category:</WhiteText>
        <Input
          color={'white'}
          value={descriptors.category}
          onChangeText={text =>
            setDescriptors({...descriptors, category: text})
          }
        />
        <WhiteText>Meal:</WhiteText>
        <Select
          minWidth={90}
          selectedValue={meal}
          color={'white'}
          style={{fontSize: 15}}
          _selectedItem={{endIcon: <CheckIcon />}}
          defaultValue="Breakfast"
          onValueChange={itemValue => setMeal(itemValue)}>
          <Select.Item label="Breakfast" value="Breakfast" />
          <Select.Item label="Lunch" value="Lunch" />
          <Select.Item label="Dinner" value="Dinner" />
          <Select.Item label="Snacks" value="Snacks" />
        </Select>
        <WhiteText style={{paddingTop: 10, paddingRight: 10}}>
          Serving Size
        </WhiteText>
        <Flex direction="row">
          <Input
            color={'white'}
            value={servings.servingSize.toString()}
            onChangeText={text =>
              setServings({...servings, servingSize: Number(text) || 0})
            }
            w={100}
            h={10}
          />
          <Select
            color={'white'}
            w={100}
            h={10}
            selectedValue={servings.servingSizeUnit}
            style={{fontSize: 15}}
            _selectedItem={{endIcon: <CheckIcon />}}
            onValueChange={itemValue =>
              setServings({...servings, servingSizeUnit: itemValue})
            }>
            <Select.Item label="g" value="g" />
            <Select.Item label="ml" value="ml" />
            <Select.Item label="lbs" value="lbs" />
            <Select.Item label="oz" value="oz" />
          </Select>
        </Flex>
        <WhiteText>Number of servings</WhiteText>
        <Input
          color={'white'}
          value={servings.servings.toString()}
          onChangeText={text =>
            setServings({...servings, servings: Number(text) || 0})
          }
          w={100}
          h={10}
        />
      </Flex>
      <Flex direction="row">
        {displayNutrient('Protein')}
        <Spacer />
        {displayNutrient('Fat')}
        <Spacer />
        {displayNutrient('Carbs')}
      </Flex>
      <Pressable
        onPress={() => {
          setDropdown(!dropdown);
        }}>
        <Flex
          direction="row"
          borderWidth={1}
          borderColor="gray.300"
          marginBottom={2}>
          <Spacer />
          <WhiteText>Additional Nutrients</WhiteText>
          <Spacer />
          <Icon name="caret-down" size={20} />
          <Spacer />
        </Flex>
      </Pressable>
      <ScrollView
        style={{
          flex: 1,
          width: dropdown ? '100%' : 0,
          height: dropdown ? '100%' : 0,
        }}>
        <Flex direction="row">
          <WhiteText style={{textAlignVertical: 'center'}}>
            Saturated Fat
          </WhiteText>
          <Spacer />
          <Input
            w={'30%'}
            keyboardType="number-pad"
            color={'white'}
            value={nutrients.saturatedFat.toString()}
            onChangeText={txt =>
              setNutrients({...nutrients, saturatedFat: Number(txt)})
            }
          />
          <WhiteText
            style={{
              marginLeft: 5,
              marginRight: 5,
              textAlignVertical: 'center',
              fontSize: 15,
            }}>
            g
          </WhiteText>
        </Flex>
        <Flex direction="row">
          <WhiteText style={{textAlignVertical: 'center'}}>
            Cholesterol
          </WhiteText>
          <Spacer />
          <Input
            w={'30%'}
            keyboardType="number-pad"
            color={'white'}
            value={nutrients.cholesterol.toString()}
            onChangeText={txt =>
              setNutrients({...nutrients, cholesterol: Number(txt)})
            }
          />
          <WhiteText style={{marginLeft: 5, marginRight: 5, fontSize: 15}}>
            mg
          </WhiteText>
        </Flex>
        <Flex direction="row">
          <WhiteText style={{textAlignVertical: 'center'}}>Sodium</WhiteText>
          <Spacer />
          <Input
            w={'30%'}
            keyboardType="number-pad"
            color={'white'}
            value={nutrients.sodium.toString()}
            onChangeText={txt =>
              setNutrients({...nutrients, sodium: Number(txt)})
            }
          />
          <WhiteText style={{marginLeft: 5, marginRight: 5, fontSize: 15}}>
            mg
          </WhiteText>
        </Flex>
        <Flex direction="row">
          <WhiteText style={{textAlignVertical: 'center'}}>
            Dietary Fibers
          </WhiteText>
          <Spacer />
          <Input
            w={'30%'}
            keyboardType="number-pad"
            color={'white'}
            value={nutrients.fiber.toString()}
            onChangeText={txt =>
              setNutrients({...nutrients, fiber: Number(txt)})
            }
          />
          <WhiteText style={{marginLeft: 5, marginRight: 5, fontSize: 15}}>
            g
          </WhiteText>
        </Flex>
        <Flex direction="row">
          <WhiteText style={{textAlignVertical: 'center'}}>
            Total Sugars
          </WhiteText>
          <Spacer />
          <Input
            w={'30%'}
            keyboardType="number-pad"
            color={'white'}
            value={nutrients.sugar.toString()}
            onChangeText={txt => {
              setNutrients({...nutrients, sugar: Number(txt)});
            }}></Input>
          <WhiteText style={{marginLeft: 5, marginRight: 5, fontSize: 15}}>
            g
          </WhiteText>
        </Flex>
      </ScrollView>
      <Button
        variant={'ghost'}
        onPress={async () => {
          await addFood();
        }}>
        {props.isNew ? 'Add' : 'Apply'}
      </Button>
    </ScrollView>
  );
};

export default EditFood;
