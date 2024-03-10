/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // presets: ['module:@react-native/babel-preset', '@babel/preset-typescript'],
  presets: [
    'module:metro-react-native-babel-preset',
    [
      '@babel/preset-env',
      {
        targets: {node: 'current'},
        loose: true,
        shippedProposals: true,
      },
    ],
    // 'module:@react-native/babel-preset',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-transform-private-methods',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-private-methods',
  ],
  // plugins: ['@babel/plugin-transform-modules-commonjs'],
};
// module.exports = {
//   presets: ['@babel/preset-env', '@babel/preset-typescript'],
// };
