/* eslint-disable no-undef */
if (typeof window !== 'undefined' && !window.screen) {
  Object.defineProperty(window, 'screen', {
    configurable: true,
    value: {},
  });
}

require('react-native-gesture-handler/jestSetup');

jest.mock('@react-native-vector-icons/fontawesome5', () => {
  const React = require('react');
  const { Pressable } = require('react-native');
  const FontAwesome5 = props => React.createElement(Pressable, props);

  return {
    __esModule: true,
    default: FontAwesome5,
    FontAwesome5,
  };
});

global.mockPush = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      push: mockPush,
    }),
  };
});

jest.mock('react-native-encrypted-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));

beforeEach(() => {
  const encryptedStorage = require('react-native-encrypted-storage').default;
  const { defaultFood } = require('./utils');
  encryptedStorage.setItem.mockResolvedValue(undefined);
  encryptedStorage.getItem.mockImplementation(async key => {
    if (key === 'customFood') return JSON.stringify([defaultFood]);
    if (key.startsWith('nutrition-')) {
      return JSON.stringify({
        Breakfast: [defaultFood],
        Lunch: [],
        Dinner: [],
        Snacks: [],
      });
    }
    return null;
  });
  encryptedStorage.removeItem.mockResolvedValue(undefined);
  encryptedStorage.clear.mockResolvedValue(undefined);
});
