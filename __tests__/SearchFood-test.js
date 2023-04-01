import {render, screen, fireEvent} from '@testing-library/react-native';
import SearchFood from '../components/SearchFood';
import {NativeBaseProvider} from 'native-base';

it('renders', () => {
  render(
    <NativeBaseProvider>
      <SearchFood />
    </NativeBaseProvider>,
  );
});
