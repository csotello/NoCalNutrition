import {render, screen, fireEvent} from '@testing-library/react-native';
import {SearchFood} from '../components/SearchFood';
import {NavigationContainer} from '@react-navigation/native';
let navigation = jest.fn();

it('renders', () => {
  render(
    <NavigationContainer>
      <SearchFood navigation={navigation} />
    </NavigationContainer>,
  );
});
