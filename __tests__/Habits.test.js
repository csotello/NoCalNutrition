import { render, waitFor } from '@testing-library/react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { Habits } from '../screens/Habits';

it('renders the habits screen and loads the default habit list', async () => {
  const { findByText } = await render(
    <GluestackUIProvider config={config}>
      <Habits />
    </GluestackUIProvider>,
  );

  expect(await findByText('Habits')).toBeTruthy();
  expect(await findByText('Drink 100oz of Water')).toBeTruthy();
  await waitFor(() =>
    expect(EncryptedStorage.getItem).toHaveBeenCalledWith('habits'),
  );
});
