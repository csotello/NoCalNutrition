import {render, fireEvent} from '@testing-library/react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {AddFood} from '../screens/AddFood';
import {defaultFood} from '../utils';

const date = '2022-01-01';

function createNavigation() {
  return {
    navigate: jest.fn(),
    reset: jest.fn(),
  };
}

function createRoute(page, params = {}) {
  return {
    params: {
      food: {
        ...defaultFood,
        foodNutrients: defaultFood.foodNutrients.map(nutrient => ({
          ...nutrient,
        })),
      },
      date,
      page,
      isNew: true,
      isCustom: false,
      ...params,
    },
  };
}

async function renderAddFood(page, params) {
  const navigation = createNavigation();
  const rendered = await render(
    <AddFood navigation={navigation} route={createRoute(page, params)} />,
  );
  return {...rendered, navigation};
}

it('renders the edit page for the selected food', async () => {
  const {getByDisplayValue} = await renderAddFood('edit');

  expect(getByDisplayValue('Kroger Mexican Cheese')).toBeTruthy();
});

it('shows the search page when requested', async () => {
  const {getByPlaceholderText} = await renderAddFood('search');

  expect(getByPlaceholderText('Cheese')).toBeTruthy();
});

it('shows the custom foods page when requested', async () => {
  const {getAllByText} = await renderAddFood('custom');

  expect(getAllByText('Custom Foods')).toHaveLength(2);
});

it('navigates to search, custom foods, and create pages from the tabs', async () => {
  const {getByText, navigation} = await renderAddFood('edit');

  await fireEvent.press(getByText('Search'));
  expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'AddFood', {
    page: 'search',
    isNew: true,
    date,
  });

  await fireEvent.press(getByText('Custom Foods'));
  expect(navigation.navigate).toHaveBeenNthCalledWith(2, 'AddFood', {
    page: 'custom',
    isNew: true,
    date,
  });

  await fireEvent.press(getByText('Create'));
  expect(navigation.navigate).toHaveBeenNthCalledWith(3, 'AddFood', {
    page: 'edit',
    isNew: true,
    food: {},
    date,
    isCustom: true,
  });
});

it('stores a new food and resets navigation to nutrition', async () => {
  EncryptedStorage.getItem.mockResolvedValue(
    JSON.stringify({
      Breakfast: [defaultFood],
      Lunch: [],
      Dinner: [],
      Snacks: [],
    }),
  );
  const {getByText, navigation} = await renderAddFood('edit');

  await fireEvent.press(getByText('Add'));

  expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
    `nutrition-${date}`,
    expect.any(String),
  );
  const storedValue = EncryptedStorage.setItem.mock.calls.find(
    ([key]) => key === `nutrition-${date}`,
  )[1];
  const storedNutrition = JSON.parse(storedValue);
  expect(storedNutrition.Breakfast).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        description: 'Kroger Mexican Cheese',
        UUID: expect.any(String),
      }),
    ]),
  );
  expect(navigation.reset).toHaveBeenCalledWith({
    index: 0,
    routes: [
      {
        name: 'Home',
        state: {routes: [{name: 'Nutrition', params: {date}}]},
      },
    ],
  });
});
