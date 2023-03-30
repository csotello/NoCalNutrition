import {render, screen, fireEvent} from '@testing-library/react-native';
import CustomFoods from '../components/CustomFoods';
import {NativeBaseProvider} from 'native-base';

it('renders correctly', () => {
  render(
    <NativeBaseProvider>
      <CustomFoods />
    </NativeBaseProvider>,
  );
});
