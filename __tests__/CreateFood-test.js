import {render, screen, fireEvent} from '@testing-library/react-native';
import CreateFood from '../components/CreateFood';
import {NativeBaseProvider} from 'native-base';

it('renders', () => {
  render(
    <NativeBaseProvider>
      <CreateFood />
    </NativeBaseProvider>,
  );
});
