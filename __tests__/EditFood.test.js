import {render, fireEvent} from '@testing-library/react-native';
import {EditFood} from '../components/EditFood';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {defaultFood} from '../utils';

let props = {
  food: defaultFood,
  add: jest.fn(),
  edit: jest.fn(),
  editCustom: jest.fn(),
  isNew: true,
  isCustom: true,
};

async function renderEditFood(overrides = {}) {
  const testProps = {
    ...props,
    food: {
      ...defaultFood,
      foodNutrients: defaultFood.foodNutrients.map(nutrient => ({
        ...nutrient,
      })),
    },
    add: jest.fn().mockResolvedValue(undefined),
    edit: jest.fn().mockResolvedValue(undefined),
    editCustom: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };

  const rendered = await render(
    <GluestackUIProvider config={config}>
      <EditFood {...testProps} />
    </GluestackUIProvider>,
  );

  return {...rendered, props: testProps};
}

it('renders', async () => {
  const {getByDisplayValue} = await renderEditFood();

  expect(getByDisplayValue('Kroger Mexican Cheese')).toBeTruthy();
  expect(getByDisplayValue('28')).toBeTruthy();
  expect(getByDisplayValue('12')).toBeTruthy();
});

it('adds a new food with the edited form values', async () => {
  const {
    props: testProps,
    getByDisplayValue,
    getByTestId,
  } = await renderEditFood({isNew: true, isCustom: false});

  await fireEvent.changeText(
    getByDisplayValue('Kroger Mexican Cheese'),
    'Updated Cheese',
  );
  await fireEvent.changeText(getByDisplayValue('12'), '15');
  await fireEvent.press(getByTestId('SaveButton'));

  expect(testProps.add).toHaveBeenCalledWith(
    expect.objectContaining({
      description: 'Updated Cheese',
      servingSize: 28,
      servingSizeUnit: 'G',
      servings: '1',
      foodNutrients: expect.arrayContaining([
        expect.objectContaining({nutrientName: 'Protein', value: 15}),
      ]),
    }),
    'Breakfast',
  );
  expect(testProps.edit).not.toHaveBeenCalled();
  expect(testProps.editCustom).not.toHaveBeenCalled();
});

it('creates and adds a new custom food', async () => {
  const {props: testProps, getByTestId} = await renderEditFood({
    isNew: true,
    isCustom: true,
  });

  await fireEvent.press(getByTestId('SaveButton'));

  expect(testProps.add).toHaveBeenCalledWith(
    expect.objectContaining({
      description: 'Kroger Mexican Cheese',
      UUID: expect.any(String),
    }),
    'Breakfast',
  );
  expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
    'customFood',
    expect.any(String),
  );
});

it('edits an existing standard food', async () => {
  const {props: testProps, getByTestId} = await renderEditFood({
    isNew: false,
    isCustom: false,
  });

  await fireEvent.press(getByTestId('SaveButton'));

  expect(testProps.edit).toHaveBeenCalledWith(
    expect.objectContaining({description: 'Kroger Mexican Cheese'}),
    'Breakfast',
  );
  expect(testProps.add).not.toHaveBeenCalled();
  expect(testProps.editCustom).not.toHaveBeenCalled();
});

it('edits an existing custom food', async () => {
  const {props: testProps, getByTestId} = await renderEditFood({
    isNew: false,
    isCustom: true,
  });

  await fireEvent.press(getByTestId('SaveButton'));

  expect(testProps.editCustom).toHaveBeenCalledWith(
    expect.objectContaining({description: 'Kroger Mexican Cheese'}),
  );
  expect(testProps.add).not.toHaveBeenCalled();
  expect(testProps.edit).not.toHaveBeenCalled();
});
