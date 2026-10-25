import App from '../App';
import {render, fireEvent} from '@testing-library/react-native';

async function renderApp() {
  return render(<App />);
}

it('renders the app with the Nutrition screen and main tabs', async () => {
  const {getAllByText} = await renderApp();

  expect(getAllByText('Nutrition').length).toBeGreaterThan(0);
  expect(getAllByText('Settings').length).toBeGreaterThan(0);
});

it('opens the AddFood search screen from Nutrition', async () => {
  const {getByTestId, getByPlaceholderText} = await renderApp();

  await fireEvent.press(getByTestId('Add Food'));

  expect(getByPlaceholderText('Cheese')).toBeTruthy();
});
