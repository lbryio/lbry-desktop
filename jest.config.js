module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/ui'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // Mirror the webpack aliases the source imports rely on.
  moduleNameMapper: {
    '^config$': '<rootDir>/ui/__tests__/__mocks__/config.js',
  },
};
