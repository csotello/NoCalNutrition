import { render, fireEvent } from '@testing-library/react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { Habit } from '../components/Habit';

const habit = {
  title: 'Drink water',
  catagory: 'Health',
  days: {
    Monday: 'Default',
    Tuesday: 'Default',
    Wednesday: 'Default',
    Thursday: 'Default',
    Friday: 'Default',
    Saturday: 'Default',
    Sunday: 'Default',
  },
};

async function renderHabit(props = {}) {
  return await render(
    <GluestackUIProvider config={config}>
      <Habit
        habit={habit}
        edit={jest.fn()}
        remove={jest.fn()}
        setDays={jest.fn()}
        {...props}
      />
    </GluestackUIProvider>,
  );
}

it('renders the habit title, category, and weekday controls', async () => {
  const { getByText } = await renderHabit();

  expect(getByText('Drink water')).toBeTruthy();
  expect(getByText('Health')).toBeTruthy();
  for (const day of ['M', 'T', 'W', 'Th', 'F', 'S', 'Su']) {
    expect(getByText(day)).toBeTruthy();
  }
});

it('calls edit, remove, and reset handlers with the habit title', async () => {
  const edit = jest.fn();
  const remove = jest.fn();
  const setDays = jest.fn();
  const { getByTestId } = await renderHabit({ edit, remove, setDays });

  expect(getByTestId('Habit Day Monday').props.sx.bg).toBe('#6fdc6f');
  await fireEvent.press(getByTestId('Habit Day Monday'));
  expect(getByTestId('Habit Day Monday').props.sx.bg).toBe('#178237');

  await fireEvent.press(getByTestId('Edit Habit'));
  await fireEvent.press(getByTestId('Remove Habit'));
  await fireEvent.press(getByTestId('Reset Habit'));

  expect(edit).toHaveBeenCalledWith(habit);
  expect(remove).toHaveBeenCalledWith(habit.title);
  expect(setDays).toHaveBeenCalledWith(habit.title);
  expect(getByTestId('Habit Day Monday').props.sx.bg).toBe('#6fdc6f');
});
