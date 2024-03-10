const {defaults: tsjPreset} = require('ts-jest/presets');

/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  workerIdleMemoryLimit: '5120MB',

  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],

  fakeTimers: {
    enableGlobally: true,
  },
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  cacheDirectory: '.cache/jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@gluestack-ui/*|@gluestack-style/react|react-native-svg|react-native-vector-icons|react-native-screens|react-native-safe-area-context|react-native-paper|react-native-gesture-handler|react-native-encrypted-storage|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|)',
  ],
};
