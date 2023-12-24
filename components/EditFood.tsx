import {
  Button,
  Input,
  Select,
  ChevronDownIcon,
  HStack,
  InputField,
  VStack,
  SelectIcon,
  SelectBackdrop,
  SelectItem,
  SelectContent,
  SelectPortal,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectTrigger,
  SelectInput,
} from '@gluestack-ui/themed';
import uuid from 'uuid-random';
import {useEffect, useState, useRef} from 'react';
import {View, Text, ScrollView, Pressable} from 'react-native';
import {WhiteText} from '../styledComponents/WhiteText';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  convertCustomFood,
  store,
  retrieve,
  Food,
  NutrientValues,
} from '../utils';
import styles from '../styles/styles';

export function EditFood(props: any): React.JSX.Element {
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
  const [nutrients, setNutrients] = useState<{[key: string]: number}>({
    protein: 0,
    carbs: 0,
    fat: 0,
    sodium: 0,
    cholesterol: 0,
    fiber: 0,
    sugar: 0,
    saturatedFat: 0,
  });
  const [meal, setMeal] = useState('Breakfast');
  const [dropdown, setDropdown] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollRef.current?.scrollToEnd({animated: true});
  }, [dropdown]);

  useEffect(() => {
    var serving = props.food.servingSize || 0;
    if (props.food.foodMeasures?.length > 0) {
      serving = props.food.foodMeasures[0].gramWeight || serving;
    }
    setServings({...servings, servingSize: serving});
    var cur = {...nutrients};
    props.food.foodNutrients?.map((nutrient: any, i: any) => {
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
  async function addFood() {
    var newFood = {...props.food};
    newFood.servingSize = servings.servingSize;
    newFood.servingSizeUnit = servings.servingSizeUnit;
    newFood.servings = servings.servings;
    newFood.brandName = descriptors.brandName;
    newFood.description = descriptors.description;
    newFood.additionalDescriptions = descriptors.additionalDescriptions;
    newFood.category = descriptors.category;
    newFood.foodNutrients?.map((nutrient: any, i: any) => {
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
  }

  /**
   * Creates a custom food
   *
   * @param {object} newFood - new food to create
   */
  async function createCustom(newFood: Food) {
    newFood['UUID'] = uuid();
    console.log('Create');
    console.log(newFood);
    let current = await retrieve('customFood');
    let val: Food[];
    if (!current) val = [];
    else val = JSON.parse(current);
    if (val) val.push(newFood);
    else val = [newFood];
    console.log('Custom After');
    console.log(val);
    await store('customFood', JSON.stringify(val));
  }

  /**
   * Renders a provided nutrient
   *
   * @param {object} nutrient - nutrient to display
   */
  function displayNutrient(nutrient: any) {
    return (
      <HStack alignItems={'center'}>
        <WhiteText>{nutrient}: </WhiteText>
        <VStack alignItems="center" pl={2} pr={2}>
          <Icon.Button
            name="caret-up"
            size={10}
            backgroundColor={styles.primaryBackgroundColor}
            onPress={() => {
              let cur: {[key: string]: number} = {...nutrients};
              cur[nutrient.toLowerCase()] += 1;
              setNutrients({...cur});
            }}
          />
          <HStack>
            <Input width={60}>
              <InputField
                color={'white'}
                keyboardType={'numeric'}
                value={nutrients[nutrient.toLowerCase()].toString()}
                onChangeText={(text: string) => {
                  let cur: {[key: string]: number} = {...nutrients};
                  cur[nutrient.toLowerCase()] =
                    Number(parseFloat(text).toPrecision(4)) || 0;
                  setNutrients({...cur});
                }}
              />
            </Input>
          </HStack>
          <Icon.Button
            name="caret-down"
            size={10}
            backgroundColor={styles.primaryBackgroundColor}
            onPress={() => {
              let cur: {[key: string]: number} = {...nutrients};
              cur[nutrient.toLowerCase()] -= 1;
              setNutrients({...cur});
            }}
          />
        </VStack>
        <WhiteText style={{fontSize: 15, alignSelf: 'center'}}>g</WhiteText>
      </HStack>
    );
  }

  return (
    <ScrollView ref={scrollRef}>
      <VStack style={{marginBottom: 10}}>
        <WhiteText>Brand Name:</WhiteText>
        <Input>
          <InputField
            color={'white'}
            value={descriptors.brandName}
            onChangeText={text =>
              setDescriptors({...descriptors, brandName: text})
            }
          />
        </Input>
        <WhiteText>Description:</WhiteText>
        <Input>
          <InputField
            color={'white'}
            value={descriptors.description}
            onChangeText={text =>
              setDescriptors({...descriptors, description: text})
            }
          />
        </Input>
        <WhiteText>Additional Description:</WhiteText>
        <Input>
          <InputField
            color={'white'}
            value={descriptors.additionalDescriptions}
            onChangeText={text =>
              setDescriptors({...descriptors, additionalDescriptions: text})
            }
          />
        </Input>
        <WhiteText>Category:</WhiteText>
        <Input>
          <InputField
            color={'white'}
            value={descriptors.category}
            onChangeText={text =>
              setDescriptors({...descriptors, category: text})
            }
          />
        </Input>
        <WhiteText>Meal:</WhiteText>
        <Select
          selectedValue={meal}
          defaultValue="Breakfast"
          onValueChange={itemValue => setMeal(itemValue)}>
          <SelectTrigger variant="outline">
            <SelectInput style={{color: 'white'}} />
            <SelectIcon>
              <ChevronDownIcon size={'sm'} color={'white'} />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Breakfast" value="Breakfast" />
              <SelectItem label="Lunch" value="Lunch" />
              <SelectItem label="Dinner" value="Dinner" />
              <SelectItem label="Snacks" value="Snacks" />
            </SelectContent>
          </SelectPortal>
        </Select>
        <WhiteText style={{paddingTop: 10, paddingRight: 10}}>
          Serving Size
        </WhiteText>
        <HStack>
          <Input width={60}>
            <InputField
              color={'white'}
              value={servings.servingSize.toString()}
              onChangeText={text =>
                setServings({...servings, servingSize: Number(text) || 0})
              }
            />
          </Input>
          <Select
            w={100}
            h={10}
            selectedValue={servings.servingSizeUnit}
            onValueChange={itemValue =>
              setServings({...servings, servingSizeUnit: itemValue})
            }>
            <SelectTrigger variant="outline">
              <SelectInput style={{color: 'white'}} />
              <SelectIcon>
                <ChevronDownIcon size={'sm'} color={'white'} />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <Select.Item label="g" value="g" />
                <Select.Item label="ml" value="ml" />
                <Select.Item label="lbs" value="lbs" />
                <Select.Item label="oz" value="oz" />
              </SelectContent>
            </SelectPortal>
          </Select>
        </HStack>
        <WhiteText>Number of servings</WhiteText>
        <Input>
          <InputField
            color={'white'}
            value={servings.servings.toString()}
            onChangeText={text =>
              setServings({...servings, servings: Number(text) || 0})
            }
            w={50}
            h={10}
          />
        </Input>
      </VStack>
      <HStack justifyContent="space-evenly">
        {displayNutrient('Protein')}
        {displayNutrient('Fat')}
        {displayNutrient('Carbs')}
      </HStack>
      <Pressable
        onPress={() => {
          setDropdown(!dropdown);
        }}>
        <HStack
          borderWidth={1}
          borderColor="gray.300"
          marginBottom={2}
          justifyContent="center">
          <WhiteText>Additional Nutrients</WhiteText>
          <Icon name="caret-down" size={20} />
        </HStack>
      </Pressable>
      <ScrollView
        style={{
          flex: 1,
          width: dropdown ? '100%' : 0,
          height: dropdown ? '100%' : 0,
        }}>
        <HStack>
          <WhiteText style={{textAlignVertical: 'center'}}>
            Saturated Fat
          </WhiteText>
          <Input>
            <InputField
              w={'30%'}
              keyboardType="number-pad"
              color={'white'}
              value={nutrients.saturatedFat.toString()}
              onChangeText={txt =>
                setNutrients({...nutrients, saturatedFat: Number(txt)})
              }
            />
          </Input>
          <WhiteText
            style={{
              marginLeft: 5,
              marginRight: 5,
              textAlignVertical: 'center',
              fontSize: 15,
            }}>
            g
          </WhiteText>
        </HStack>
        <HStack>
          <WhiteText style={{textAlignVertical: 'center'}}>
            Cholesterol
          </WhiteText>
          <Input>
            <InputField
              w={'30%'}
              keyboardType="number-pad"
              color={'white'}
              value={nutrients.cholesterol.toString()}
              onChangeText={txt =>
                setNutrients({...nutrients, cholesterol: Number(txt)})
              }
            />
          </Input>
          <WhiteText style={{marginLeft: 5, marginRight: 5, fontSize: 15}}>
            mg
          </WhiteText>
        </HStack>
        <HStack>
          <WhiteText style={{textAlignVertical: 'center'}}>Sodium</WhiteText>
          <Input>
            <InputField
              w={'30%'}
              keyboardType="number-pad"
              color={'white'}
              value={nutrients.sodium.toString()}
              onChangeText={txt =>
                setNutrients({...nutrients, sodium: Number(txt)})
              }
            />
          </Input>
          <WhiteText style={{marginLeft: 5, marginRight: 5, fontSize: 15}}>
            mg
          </WhiteText>
        </HStack>
        <HStack>
          <WhiteText style={{textAlignVertical: 'center'}}>
            Dietary Fibers
          </WhiteText>
          <Input>
            <InputField
              w={'30%'}
              keyboardType="number-pad"
              color={'white'}
              value={nutrients.fiber.toString()}
              onChangeText={txt =>
                setNutrients({...nutrients, fiber: Number(txt)})
              }
            />
          </Input>
          <WhiteText style={{marginLeft: 5, marginRight: 5, fontSize: 15}}>
            g
          </WhiteText>
        </HStack>
        <HStack>
          <WhiteText style={{textAlignVertical: 'center'}}>
            Total Sugars
          </WhiteText>
          <Input>
            <InputField
              w={'30%'}
              keyboardType="number-pad"
              color={'white'}
              value={nutrients.sugar.toString()}
              onChangeText={txt => {
                setNutrients({...nutrients, sugar: Number(txt)});
              }}
            />
          </Input>
          <WhiteText style={{marginLeft: 5, marginRight: 5, fontSize: 15}}>
            g
          </WhiteText>
        </HStack>
      </ScrollView>
      <Button
        onPress={async () => {
          await addFood();
        }}
        variant="link">
        <Text style={{color: 'white'}}>{props.isNew ? 'Add' : 'Apply'}</Text>
      </Button>
    </ScrollView>
  );
}
