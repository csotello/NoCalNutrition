module.exports = async () => {
  return {
    preset: 'react-native',
    // rootDir: './',
    setupFiles: ['<rootDir>/tests/setup.js'],
    // setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  };
};
