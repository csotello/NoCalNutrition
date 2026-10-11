if (typeof window !== 'undefined' && !window.screen) {
  Object.defineProperty(window, 'screen', {
    configurable: true,
    value: {},
  });
}

require('react-native-gesture-handler/jestSetup');

jest.mock('@react-native-vector-icons/fontawesome5', () => {
  const React = require('react');
  const {Pressable} = require('react-native');
  const FontAwesome5 = (props) => React.createElement(Pressable, props);

  return {
    __esModule: true,
    default: FontAwesome5,
    FontAwesome5,
  };
});
