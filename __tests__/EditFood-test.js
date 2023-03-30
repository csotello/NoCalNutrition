import {render, screen, fireEvent} from '@testing-library/react-native';
import EditFood from '../components/EditFood';
import {NativeBaseProvider} from 'native-base';

it('renders', () => {
  render(
    <NativeBaseProvider>
      <EditFood />
    </NativeBaseProvider>,
  );
});
