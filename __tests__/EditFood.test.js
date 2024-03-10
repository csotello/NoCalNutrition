import {render, screen, fireEvent} from '@testing-library/react-native';
import {EditFood} from '../components/EditFood';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';

let props = {
  food: {},
  add: jest.fn(),
  edit: jest.fn(),
  editCustom: jest.fn(),
  isNew: true,
  isCustom: true,
};

it('renders', () => {
  render(
    <GluestackUIProvider config={config}>
      <EditFood
        food={props.food}
        add={props.add}
        edit={props.edit}
        editCustom={props.editCustom}
        isNew={props.isNew}
        isCustom={props.isCustom}
      />
    </GluestackUIProvider>,
  );
});
