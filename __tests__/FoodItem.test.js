import {
  render,
  screen,
  cleanup,
  fireEvent,
} from '@testing-library/react-native';
import {Food} from '../components/Food';
import {defaultFood} from '../utils';

afterEach(cleanup);
const inset = {
  frame: {x: 0, y: 0, width: 0, height: 0},
  insets: {top: 0, left: 0, right: 0, bottom: 0},
};

let props = {
  meal: [],
  title: 'Breakfast',
  key: 0,
  remove: jest.fn(),
  edit: jest.fn(),
};

it('renders', () => {
  render(
    <Food
      meal={props.meal}
      title={props.title}
      key={props.key}
      remove={props.remove}
      edit={props.edit}
    />,
  );
});

it('Has functional edit icon', () => {
  let {rerender} = render(
    <Food
      edit={props.edit}
      remove={props.remove}
      meal={[{...defaultFood}]}
      title="Breakfast"
    />,
  );

  const editIcon = screen.getByTestId('Edit Icon');
  fireEvent.press(editIcon);

  expect(props.edit).toHaveBeenCalled();
});
