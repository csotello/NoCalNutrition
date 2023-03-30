module.exports = async () => {
  return {
    preset: 'react-native',
    setupFiles: ['<rootDir>/tests/setup.js'],
    transformIgnorePatterns: [
      'node_modules/(?!(@react-native|native-base|react-native|react-native-vector-icons|react-navigation|@react-navigation|react-native-paper|react-native-iphone-x-helper)/)',
    ],
  };
};
