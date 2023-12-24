import {
  View,
  Button,
  AlertDialog,
  Heading,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  HStack,
  VStack,
  ButtonIcon,
} from '@gluestack-ui/themed';
import {Text} from 'react-native';
import {WhiteText} from '../styledComponents/WhiteText';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../styles/styles';
import {getMainNutrients} from '../utils';
import {useState, useRef} from 'react';
export function Food(props: any): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef(null);
  const alertDialog = (food: any, section: string) => {
    return (
      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        leastDestructiveRef={cancelRef}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogCloseButton />
          <AlertDialogHeader>
            <Heading>Delete Food</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>
              This will permanently delete the food item. Data cannot be
              recovered.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              testID="Delete Button"
              onPress={() => {
                props.remove(food, section);
                setIsOpen(false);
              }}>
              <WhiteText>Delete</WhiteText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <View style={{padding: 10}}>
      <WhiteText style={{paddingBottom: 10}}>{props.title}</WhiteText>
      {props.meal?.map((item: any, i: any) => {
        let nutrients = getMainNutrients({...item});
        return (
          <View
            key={i}
            style={{paddingLeft: 10, marginBottom: 10, paddingBottom: 10}}>
            <HStack space={'4xl'}>
              <VStack justifyContent="flex-start" paddingRight={'30%'}>
                <View style={{maxWidth: '80%'}}>
                  <WhiteText>
                    {item.brandName} {'\n'}
                    {item.description} {'\n'}
                    Amount: {Number(item.servingSize)} {item.servingSizeUnit}
                  </WhiteText>
                </View>
                <HStack
                  space={'md'}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <WhiteText>
                    P: {nutrients.protein.value}
                    {nutrients.protein.unitName}
                  </WhiteText>
                  <WhiteText>
                    C: {nutrients.carbs.value}
                    {nutrients.carbs.unitName}
                  </WhiteText>
                  <WhiteText>
                    F: {nutrients.fat.value}
                    {nutrients.fat.unitName}
                  </WhiteText>
                </HStack>
              </VStack>
              {alertDialog(item, props.title)}
              <HStack
                style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                <Icon.Button
                  name="trash-alt"
                  color={'white'}
                  backgroundColor={styles.primaryBackgroundColor}
                  onPress={() => setIsOpen(true)}
                  style={{marginLeft: 10}}
                />
                <Icon.Button
                  name="pencil-alt"
                  color={'white'}
                  backgroundColor={styles.primaryBackgroundColor}
                  onPress={() => props.edit(item, props.title)}
                  style={{marginLeft: 10}}
                />
              </HStack>
            </HStack>
          </View>
        );
      })}
    </View>
  );
}
