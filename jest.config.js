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
    // Electron APIs aren't available under Jest.
    '^electron$': '<rootDir>/ui/__tests__/__mocks__/electron.js',
    // jsdom's browser condition resolves uuid to its ESM build, which Jest can't parse.
    '^uuid$': '<rootDir>/node_modules/uuid/dist/cjs/index.js',
    '\\.(scss|css)$': '<rootDir>/ui/__tests__/__mocks__/style.js',
  },
};
