import {render, screen, fireEvent} from '@testing-library/react-native';
import {AddFood} from '../screens/AddFood';

let info = {
  isVisible: true,
};

let navigation = jest.fn();
let route = {
  params: {
    food: {},
    date: '2022-01-01',
    page: 'edit',
    isNew: true,
    isCustom: true,
  },
};

it('renders', () => {
  render(<AddFood info={info} navigation={navigation} route={route} />);
});
