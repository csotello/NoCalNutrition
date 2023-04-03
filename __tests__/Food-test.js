import {
  render,
  screen,
  cleanup,
  fireEvent,
} from '@testing-library/react-native';
import Food from '../components/Food';
import {NativeBaseProvider} from 'native-base';
import {defaultFood} from '../utils';

afterEach(cleanup);
const inset = {
  frame: {x: 0, y: 0, width: 0, height: 0},
  insets: {top: 0, left: 0, right: 0, bottom: 0},
};

it('renders', () => {
  render(
    <NativeBaseProvider initialWindowMetrics={inset}>
      <Food />
    </NativeBaseProvider>,
  );
});

it('Has functional Icons', () => {
  let edit = jest.fn();
  let remove = jest.fn();

  render(
    <NativeBaseProvider initialWindowMetrics={inset}>
      <Food
        edit={edit}
        remove={remove}
        meal={[{...defaultFood}]}
        title="Breakfast"
      />
    </NativeBaseProvider>,
  );

  const deleteIcon = screen.getByTestId('Delete Icon');
  const editIcon = screen.queryByTestId('Edit Icon');

  fireEvent.press(editIcon[0]);
  fireEvent.press(deleteIcon[0]);
  const deleteButton = screen.getByTestId('Delete Button');
  fireEvent.press(deleteButton);
  expect(remove).toHaveBeenCalled();
  expect(edit).toHaveBeenCalled();
});
