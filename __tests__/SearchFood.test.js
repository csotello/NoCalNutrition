import {render, fireEvent} from '@testing-library/react-native';
import {SearchFood} from '../components/SearchFood';

const props = {
  date: '2023-01-01',
};

const searchResult = {
  fdcId: 123,
  description: 'Cheddar Cheese',
  brandName: 'Test Brand',
  servingSize: 28,
  servingSizeUnit: 'g',
  householdServingFullText: '1 slice',
  foodNutrients: [
    {nutrientName: 'Protein', value: 7},
    {nutrientName: 'Carbohydrate, by difference', value: 1},
    {nutrientName: 'Total lipid (fat)', value: 9},
  ],
};

async function renderSearchFood() {
  return render(<SearchFood date={props.date} />);
}

beforeEach(() => {
  global.mockPush.mockClear();
});

it('renders the search field and button', async () => {
  const {getByPlaceholderText, getByText} = await renderSearchFood();

  expect(getByPlaceholderText('Cheese')).toBeTruthy();
  expect(getByText('Search')).toBeTruthy();
});

it('searches the API and displays returned food details', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => ({foods: [searchResult]}),
  });
  const {getByPlaceholderText, getByText} = await renderSearchFood();

  await fireEvent.changeText(getByPlaceholderText('Cheese'), 'cheddar');
  await fireEvent.press(getByText('Search'));

  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining(
      'https://api.nal.usda.gov/fdc/v1/foods/search?query=cheddar',
    ),
  );
  expect(fetchMock.mock.calls[0][0]).toContain('pageSize=8');
  expect(getByText('Cheddar Cheese')).toBeTruthy();
  expect(getByText('Test Brand')).toBeTruthy();
  expect(getByText('28.00 g')).toBeTruthy();
  expect(getByText('7')).toBeTruthy();
  expect(getByText('1')).toBeTruthy();
  expect(getByText('9')).toBeTruthy();
});

it('opens the selected food in AddFood', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => ({foods: [searchResult]}),
  });
  const {getByPlaceholderText, getByText} = await renderSearchFood();

  await fireEvent.changeText(getByPlaceholderText('Cheese'), 'cheddar');
  await fireEvent.press(getByText('Search'));
  await fireEvent.press(getByText('Cheddar Cheese'));

  expect(mockPush).toHaveBeenCalledWith('AddFood', {
    page: 'edit',
    food: searchResult,
    isNew: true,
    date: props.date,
  });
});

it('renders no results when the search response has no foods', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => ({foods: []}),
  });
  const {getByPlaceholderText, getByText, queryByText} =
    await renderSearchFood();

  await fireEvent.changeText(getByPlaceholderText('Cheese'), 'unknown food');
  await fireEvent.press(getByText('Search'));

  expect(queryByText('Cheddar Cheese')).toBeNull();
});
