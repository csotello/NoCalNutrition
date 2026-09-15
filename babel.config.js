module.exports = {
  presets: ['module:metro-react-native-babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './',
        },
      },
    ],
    "react-native-worklets/plugin",
    'module:react-native-dotenv',
    '@babel/plugin-transform-class-static-block',
  ],
};
