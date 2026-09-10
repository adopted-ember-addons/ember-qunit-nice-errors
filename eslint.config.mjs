import js from '@eslint/js';
import n from 'eslint-plugin-n';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', 'coverage/', 'dist/', '*.log'] },
  js.configs.recommended,
  n.configs['flat/recommended-script'],
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      'n/no-unpublished-require': ['error', { allowModules: ['@babel/core'] }],
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: { sourceType: 'module' },
  },
  prettier,
];
