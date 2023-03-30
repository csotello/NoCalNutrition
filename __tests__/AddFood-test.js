import {render, screen, fireEvent} from '@testing-library/react-native';
import {NativeBaseProvider} from 'native-base';
import AddFood from '../screens/AddFood';

info = {
  isVisible: true,
};

it('renders', () => {
  render(
    <NativeBaseProvider>
      <AddFood info={info} />
    </NativeBaseProvider>,
  );
});
