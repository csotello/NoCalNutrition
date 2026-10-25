import {render, fireEvent, waitFor} from '@testing-library/react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Tasks} from '../screens/Tasks';

it('renders the tasks screen and loads the saved task list', async () => {
  EncryptedStorage.getItem.mockResolvedValueOnce(
    JSON.stringify([{id: 'saved-1', title: 'Walk the dog', completed: false}]),
  );
  const {findByText} = await render(<Tasks />);

  expect(await findByText('Tasks')).toBeTruthy();
  expect(await findByText('Walk the dog')).toBeTruthy();
  expect(EncryptedStorage.getItem).toHaveBeenCalledWith('tasks');
});

it('adds a task and stores the updated list', async () => {
  const {getByPlaceholderText, getByText, findByText} = await render(<Tasks />);

  await fireEvent.changeText(getByPlaceholderText('text'), 'Plan dinner');
  await fireEvent.press(getByText('Add'));

  expect(await findByText('Plan dinner')).toBeTruthy();
  await waitFor(() => {
    const saved = JSON.parse(
      EncryptedStorage.setItem.mock.calls.find(([key]) => key === 'tasks')[1],
    );
    expect(saved).toEqual(
      expect.arrayContaining([
        expect.objectContaining({title: 'Plan dinner', completed: false}),
      ]),
    );
  });
});
