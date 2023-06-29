import {Text} from 'react-native';

const WhiteText = ({children, style, ...rest}) => {
  return (
    <Text style={[{color: 'white'}, style]} {...rest}>
      {children}
    </Text>
  );
};

export default WhiteText;
