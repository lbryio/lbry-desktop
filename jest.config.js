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
  // @noble and @scure 2.x ship ES modules only, so Jest has to transform them.
  transformIgnorePatterns: ['/node_modules/(?!(@noble|@scure)/)'],
  moduleNameMapper: {
    // The vendored wallet code (extras/lbc) imports its own files as './x.js'; resolve them to the .ts.
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^config$': '<rootDir>/ui/__tests__/__mocks__/config.js',
    // webpack resolves a bare 'package.json' through resolve.modules [..., __dirname].
    '^package\\.json$': '<rootDir>/package.json',
    '^lbryinc$': '<rootDir>/extras/lbryinc',
    // Electron APIs aren't available under Jest.
    '^electron$': '<rootDir>/ui/__tests__/__mocks__/electron.js',
    // jsdom's browser condition resolves uuid to its ESM build, which Jest can't parse.
    '^uuid$': '<rootDir>/node_modules/uuid/dist/cjs/index.js',
    '\\.(scss|css)$': '<rootDir>/ui/__tests__/__mocks__/style.js',
  },
};
