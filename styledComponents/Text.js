import {Text as TextRN} from 'react-native';

const Text = props => {
  return (
    <TextRN style={[props.style, {color: 'white'}]}>{props.children}</TextRN>
  );
};

export default Text;
