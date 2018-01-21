module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
  },
  overrides: [
    // node files
    {
      files: [
        'index.js',
        'testem.js',
        'ember-cli-build.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js',
        'lib/**/*.js',
      ],
      excludedFiles: [
        'app/**',
        'addon/**',
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here
      })
    },

    // test files
    {
      files: ['tests/**/*.js'],
      excludedFiles: ['tests/dummy/**/*.js'],
      env: {
        embertest: true
      },
      rules: Object.assign({}, require('eslint-plugin-ember').configs.recommended.rules, {
        "ember/named-functions-in-promises": "off",
      })
    },

    // node test files
    {
      files: ['node-tests/*.js', 'node-tests/**/*.js'],
      excludedFiles: ['node-tests/fixtures/**/*.js'],
      env: {
        node: true,
        mocha: true,
      },
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        "node/no-unpublished-require": "off",
        "node/no-extraneous-require": "off",
      })
    }
  ]
};
