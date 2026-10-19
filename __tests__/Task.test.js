import {render, fireEvent} from '@testing-library/react-native';
import {Task} from '../components/Task';

const task = {id: 'task-1', title: 'Review pull request', completed: false};

it('renders the task title without completion styling', async () => {
  const {getByText} = await render(
    <Task task={task} complete={jest.fn()} delete={jest.fn()} />,
  );

  expect(getByText(task.title).props.style.textDecorationLine).toBe('none');
});

it('calls complete and delete with the task id', async () => {
  const complete = jest.fn();
  const remove = jest.fn();
  const {getByText, getByTestId} = await render(
    <Task task={{...task, completed: true}} complete={complete} delete={remove} />,
  );

  expect(getByText(task.title).props.style.textDecorationLine).toBe('line-through');
  await fireEvent.press(getByTestId('Complete Task'));
  await fireEvent.press(getByTestId('Delete Task'));

  expect(complete).toHaveBeenCalledWith(task.id);
  expect(remove).toHaveBeenCalledWith(task.id);
});
