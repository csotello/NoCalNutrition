import {render, fireEvent, waitFor} from '@testing-library/react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import {Settings} from '../screens/Settings';

it('renders the settings actions', async () => {
  const {getByText} = await render(
    <GluestackUIProvider config={config}>
      <Settings />
    </GluestackUIProvider>,
  );

  expect(getByText('Customize Catagories')).toBeTruthy();
  expect(getByText('Set Goals')).toBeTruthy();
  expect(getByText('Reset Custom')).toBeTruthy();
});

it('resets stored custom foods', async () => {
  const {getByText} = await render(
    <GluestackUIProvider config={config}>
      <Settings />
    </GluestackUIProvider>,
  );

  await fireEvent.press(getByText('Reset Custom'));

  await waitFor(() =>
    expect(EncryptedStorage.setItem).toHaveBeenCalledWith('customFood', '[]'),
  );
});
