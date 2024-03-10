import {render, screen, fireEvent} from '@testing-library/react-native';
import {CustomFoods} from '../components/CustomFoods';
import {NavigationContainer} from '@react-navigation/native';

it('renders correctly', () => {
  render(
    <NavigationContainer>
      <CustomFoods />
    </NavigationContainer>,
  );
});
