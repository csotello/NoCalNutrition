import {render, screen, fireEvent} from '@testing-library/react-native';
import {CustomFoods} from '../components/CustomFoods';
import {NavigationContainer} from '@react-navigation/native';


const props = {
  date: new Date(),
};

it('renders correctly', () => {
  render(
    <NavigationContainer>
      <CustomFoods date={props.date} />
    </NavigationContainer>,
  );
});

it('has functional add button', async () => {
  await render(
    <NavigationContainer>
      <CustomFoods date={props.date} />
    </NavigationContainer>,
  );
  const addButton = await screen.getByTestId('Add Icon');
  fireEvent.press(addButton);
  expect(mockPush).toHaveBeenCalled()})

it('has functional delete button', async () => {
  await render(
    <NavigationContainer>
      <CustomFoods date={props.date} />
    </NavigationContainer>,
  );
  const deleteButton = await screen.getByTestId('Delete Icon');
  fireEvent.press(deleteButton);
})

it('has functional edit button', async () => {
  await render(
    <NavigationContainer>
      <CustomFoods date={props.date} />
    </NavigationContainer>,
  );
  const editButton = await screen.getByTestId('Edit Icon');
  fireEvent.press(editButton);
  expect(mockPush).toHaveBeenCalled()
})