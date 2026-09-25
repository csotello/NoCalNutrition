import { Text } from 'react-native';
import React from 'react';

type Props = {
  children?: React.ReactNode;
  style?: any;
  [key: string]: any;
};

export function WhiteText({
  children,
  style,
  ...rest
}: Props): React.JSX.Element {
  const customStyle = { ...style, color: 'white' };
  return (
    <Text style={customStyle} {...rest}>
      {children}
    </Text>
  );
}
