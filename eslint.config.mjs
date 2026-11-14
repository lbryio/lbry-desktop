// Flat config for ESLint 10 + typescript-eslint. Deliberately loose to match
// the loose-mode TypeScript migration (#618): correctness rules on, style
// left to prettier, `any`-related rules off until the strictness ratchet.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'homepages/**', 'build/**', 'static/**', 'web/**', '*.js', '*.mjs', 'config.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  prettier,
  {
    files: ['ui/**/*.{ts,tsx}', 'electron/**/*.ts', 'extras/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        __: 'readonly', // i18n, provided by webpack ProvidePlugin
        IS_WEB: 'readonly', // DefinePlugin
      },
    },
    settings: { react: { version: '16.14' } },
    rules: {
      // Loose-mode migration debt: these fire thousands of times on the
      // converted codebase. Re-enable tier by tier with the ratchet (#618).
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
      'no-empty': 'off',
      'no-prototype-builtins': 'off',
      'no-async-promise-executor': 'off',
      'no-case-declarations': 'off',
      'no-useless-escape': 'off',
      'no-control-regex': 'off',
      'no-undef': 'off', // tsc owns undefined-name checking for TS files
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'off',
      // New compiler-powered hooks rules and small correctness/style rules:
      // genuine findings on pre-existing code, tracked as ratchet debt (#618).
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/use-memo': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',
      'no-useless-assignment': 'warn',
      'preserve-caught-error': 'warn',
      'no-constant-binary-expression': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
    },
  },
  {
    files: ['ui/__tests__/**'],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
  }
);
