import { Text } from 'react-native';
import React from 'react';
import styles from '../styles/styles';

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
  const customStyle = { ...style, color: styles.colors.white };
  return (
    <Text style={customStyle} {...rest}>
      {children}
    </Text>
  );
}
