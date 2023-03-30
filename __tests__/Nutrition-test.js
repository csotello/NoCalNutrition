import {render, screen, fireEvent} from '@testing-library/react-native';
import Nutrition from '../screens/Nutrition';
import {NativeBaseProvider} from 'native-base';

it('renders correctly', () => {
  render(
    <NativeBaseProvider>
      <Nutrition />
    </NativeBaseProvider>,
  );
});
