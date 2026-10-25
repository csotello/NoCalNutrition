import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ToastAndroid } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { Nutrition } from '../screens/Nutrition';
import { defaultFood } from '../utils';

const date = new Date(2022, 0, 1).toDateString();

function createNavigation() {
  return { navigate: jest.fn() };
}

async function renderNutrition() {
  const navigation = createNavigation();
  const rendered = await render(
    <GluestackUIProvider config={config}>
      <Nutrition navigation={navigation} route={{ params: { date } }} />
    </GluestackUIProvider>,
  );
  await waitFor(() => {
    expect(rendered.getByText(/Kroger Mexican Cheese/)).toBeTruthy();
  });

  return { ...rendered, navigation };
}

it('renders the loaded meal and nutrient totals', async () => {
  const { getByText } = await renderNutrition();

  expect(getByText('Nutrition')).toBeTruthy();
  expect(getByText(date)).toBeTruthy();
  expect(getByText('Breakfast')).toBeTruthy();
  expect(getByText(/Kroger Mexican Cheese/)).toBeTruthy();
  expect(getByText(/Protein\s+12 \/ 0/)).toBeTruthy();
  expect(getByText(/Fat\s+8 \/ 0/)).toBeTruthy();
  expect(getByText(/Carbs\s+10 \/ 0/)).toBeTruthy();
});

it('shows the calculated daily calories', async () => {
  const showToast = jest.spyOn(ToastAndroid, 'show');
  const { getByText } = await renderNutrition();

  await fireEvent.press(getByText('Show Calories'));

  expect(showToast).toHaveBeenCalledWith(
    'Calories: 160.00',
    ToastAndroid.SHORT,
  );
});

it('opens the selected food for editing', async () => {
  const { getByTestId, navigation } = await renderNutrition();

  await fireEvent.press(getByTestId('Edit Icon'));

  expect(navigation.navigate).toHaveBeenCalledWith('AddFood', {
    page: 'edit',
    food: { ...defaultFood, meal: 'Breakfast' },
    isNew: false,
    date,
  });
});

it('removes a food from its meal and stores the updated nutrition', async () => {
  const { getByTestId, getByText } = await renderNutrition();

  await fireEvent.press(getByTestId('Delete Icon'));
  await fireEvent.press(getByText('Delete'));

  const savedNutrition = JSON.parse(
    EncryptedStorage.setItem.mock.calls.find(
      ([key]) => key === `nutrition-${date}`,
    )[1],
  );
  expect(savedNutrition.Breakfast).toEqual([]);
});

it('opens AddFood in search mode', async () => {
  const { getByTestId, navigation } = await renderNutrition();

  await fireEvent.press(getByTestId('Add Food'));

  expect(navigation.navigate).toHaveBeenCalledWith('AddFood', {
    page: 'search',
    isNew: true,
    date,
  });
});

it('stores the current nutrition and loads the following day', async () => {
  const { getByTestId, getByText } = await renderNutrition();

  await fireEvent.press(getByTestId('Next Day'));

  await waitFor(() => expect(getByText('Sun Jan 02 2022')).toBeTruthy());
  expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
    `nutrition-${date}`,
    expect.any(String),
  );
  expect(EncryptedStorage.getItem).toHaveBeenCalledWith(
    'nutrition-Sun Jan 02 2022',
  );
});

it('loads the previous day', async () => {
  const { getByTestId, getByText } = await renderNutrition();

  await fireEvent.press(getByTestId('Previous Day'));

  await waitFor(() => expect(getByText('Fri Dec 31 2021')).toBeTruthy());
  expect(EncryptedStorage.getItem).toHaveBeenCalledWith(
    'nutrition-Fri Dec 31 2021',
  );
});
