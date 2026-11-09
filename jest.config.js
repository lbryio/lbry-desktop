module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js'],
  roots: ['<rootDir>/ui'],
  // Mirror webpack's resolve.modules so bare imports like 'util/lbryURI' work.
  modulePaths: ['<rootDir>/ui'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // Mirror the webpack aliases the source imports rely on.
  moduleNameMapper: {
    '^config$': '<rootDir>/ui/__tests__/__mocks__/config.js',
  },
};
