import {render, fireEvent} from '@testing-library/react-native';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import {Food} from '../components/Food';
import {defaultFood} from '../utils';

async function renderFood(overrides = {}) {
  const food = {
    ...defaultFood,
    brandName: 'Kroger',
    foodNutrients: defaultFood.foodNutrients.map(nutrient => ({
      ...nutrient,
      unitName: 'G',
    })),
  };
  const props = {
    meal: [food],
    title: 'Breakfast',
    remove: jest.fn(),
    edit: jest.fn(),
    ...overrides,
  };
  const rendered = await render(
    <GluestackUIProvider config={config}>
      <Food {...props} />
    </GluestackUIProvider>,
  );

  return {...rendered, props, food};
}

it('renders an empty meal without food details', async () => {
  const {getByText, queryByTestId} = await renderFood({meal: []});

  expect(getByText('Breakfast')).toBeTruthy();
  expect(queryByTestId('Edit Icon')).toBeNull();
  expect(queryByTestId('Delete Icon')).toBeNull();
});

it('renders food details and nutrient amounts', async () => {
  const {getByText} = await renderFood();

  expect(getByText(/Kroger Mexican Cheese/)).toBeTruthy();
  expect(getByText(/Amount: 28 G/)).toBeTruthy();
  expect(getByText(/P:\s*12\s*G/)).toBeTruthy();
  expect(getByText(/C:\s*10\s*G/)).toBeTruthy();
  expect(getByText(/F:\s*8\s*G/)).toBeTruthy();
});

it('calls edit with the selected food and meal name', async () => {
  const {getByTestId, props, food} = await renderFood();

  await fireEvent.press(getByTestId('Edit Icon'));

  expect(props.edit).toHaveBeenCalledWith(food, 'Breakfast');
});

it('opens a delete confirmation without removing the food', async () => {
  const {getByTestId, getByText, props} = await renderFood();

  expect(() => getByText('Delete Food')).toThrow();
  await fireEvent.press(getByTestId('Delete Icon'));

  expect(getByText('Delete Food')).toBeTruthy();
  expect(getByText(/permanently delete the food item/i)).toBeTruthy();
  expect(props.remove).not.toHaveBeenCalled();
});

it('removes the selected food after confirming deletion', async () => {
  const {getByTestId, queryByText, props, food} = await renderFood();

  await fireEvent.press(getByTestId('Delete Icon'));
  await fireEvent.press(getByTestId('Delete Button'));

  expect(props.remove).toHaveBeenCalledWith(food, 'Breakfast');
  expect(queryByText('Delete Food')).toBeNull();
});
