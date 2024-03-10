import {render, screen, fireEvent} from '@testing-library/react-native';
import {Nutrition} from '../screens/Nutrition';

let navigation = {
  navigate: jest.fn(),
};
let route = {
  params: {
    date: '2022-01-01',
  },
};

it('renders correctly', () => {
  render(<Nutrition navigation={navigation} route={route} />);
});
