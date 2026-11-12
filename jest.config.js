// Run every test in UTC so date formatting doesn't depend on the machine's zone.
// Set here, before workers start, because Node caches the zone on first use.
process.env.TZ = 'UTC';

module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js'],
  roots: ['<rootDir>/ui'],
  // Mirror webpack's resolve.modules so bare imports like 'util/lbryURI' work.
  modulePaths: ['<rootDir>/ui'],
  // Count every source file, not just the ones a test happens to import, so the
  // coverage number isn't inflated.
  collectCoverageFrom: ['ui/**/*.{ts,tsx}', '!ui/__tests__/**', '!**/*.d.ts'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // Mirror the webpack aliases the source imports rely on.
  moduleNameMapper: {
    '^config$': '<rootDir>/ui/__tests__/__mocks__/config.js',
    '^lbryinc$': '<rootDir>/extras/lbryinc',
    // Electron APIs aren't available under Jest.
    '^electron$': '<rootDir>/ui/__tests__/__mocks__/electron.js',
    // jsdom's browser condition resolves uuid to its ESM build, which Jest can't parse.
    '^uuid$': '<rootDir>/node_modules/uuid/dist/cjs/index.js',
    '\\.(scss|css)$': '<rootDir>/ui/__tests__/__mocks__/style.js',
  },
};
