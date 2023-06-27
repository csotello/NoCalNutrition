import {Text} from 'react-native';

const WhiteText = props => {
  return <Text style={[props.style, {color: 'white'}]}>{props.children}</Text>;
};

export default WhiteText;
