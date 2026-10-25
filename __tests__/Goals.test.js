import {render, fireEvent, waitFor} from '@testing-library/react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import Goals from '../components/Goals';

async function renderGoals(setVisible = jest.fn()) {
  return await render(
    <GluestackUIProvider config={config}>
      <Goals setVisible={setVisible} />
    </GluestackUIProvider>,
  );
}

it('loads default nutrient goals when none are stored', async () => {
  const {findByDisplayValue} = await renderGoals();

  expect(await findByDisplayValue('200')).toBeTruthy();
  expect(await findByDisplayValue('150')).toBeTruthy();
  expect(await findByDisplayValue('50')).toBeTruthy();
});

it('saves edited goals and closes the editor', async () => {
  const setVisible = jest.fn();
  const {findByDisplayValue, getByText} = await renderGoals(setVisible);

  await fireEvent.changeText(await findByDisplayValue('200'), '180');
  await fireEvent.press(getByText('Update'));

  await waitFor(() => {
    expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
      'goals',
      JSON.stringify({Protein: '180', Fat: '50', Carbs: '150'}),
    );
    expect(setVisible).toHaveBeenCalledWith(false);
  });
});
