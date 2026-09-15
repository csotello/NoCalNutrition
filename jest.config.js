module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    './node_modules/(?!(jest-)?@gluestack-ui|react-native|@react-native|@gluestack-ui/themed/*|@gluestack-style)/)'
  ],
};
