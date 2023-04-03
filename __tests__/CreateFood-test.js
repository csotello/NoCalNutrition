import {
  render,
  screen,
  fireEvent,
  cleanup,
} from '@testing-library/react-native';
import CreateFood from '../components/CreateFood';
import {NativeBaseProvider} from 'native-base';
afterEach(cleanup);
const inset = {
  frame: {x: 0, y: 0, width: 0, height: 0},
  insets: {top: 0, left: 0, right: 0, bottom: 0},
};
it('renders', () => {
  render(
    <NativeBaseProvider>
      <CreateFood />
    </NativeBaseProvider>,
  );
});

it('Handles user input', () => {
  render(
    <NativeBaseProvider initialWindowMetrics={inset}>
      <CreateFood isNew={true} food={{}} />
    </NativeBaseProvider>,
  );
  const brandName = screen.getByPlaceholderText('Kroger');
  fireEvent.changeText(brandName, 'Kroger');
  expect(brandName.props.value).toBe('Kroger');
  const serving = screen.getByTestId('servingInput');
  fireEvent.changeText(serving, '28');
  expect(serving.props.value).toBe('28');
  const button = screen.getByText('Create');
  fireEvent.press(button);
});
