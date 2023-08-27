import {Text} from 'react-native';

const WhiteText = ({children, style, ...rest}) => {
  customStyle = {...style, color: 'white'};
  return (
    <Text style={customStyle} {...rest}>
      {children}
    </Text>
  );
};

export default WhiteText;
