import {render, screen, fireEvent} from '@testing-library/react-native';
import Food from '../components/Food';
import {NativeBaseProvider} from 'native-base';

it('renders', () => {
  render(
    <NativeBaseProvider>
      <Food />
    </NativeBaseProvider>,
  );
});
