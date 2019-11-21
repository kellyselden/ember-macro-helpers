module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'sane'
  ],
  env: {
    browser: true
  },
  rules: {
    'ember/no-arrow-function-computed-properties': ['error', {
      onlyThisContexts: true
    }]
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'node-tests/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script'
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

    {
      files: ['node-tests/**/*.js'],
      env: {
        mocha: true
      },
      plugins: ['mocha'],
      rules: require('eslint-plugin-mocha').configs.recommended.rules
    },

    {
      files: ['testem.js'],
      rules: {
        camelcase: 0
      }
    },

    {
      files: ['vendor/**/*.js'],
      parserOptions: {
        ecmaVersion: 5,
        sourceType: 'script'
      },
      env: {
        amd: true
      },
      globals: {
        Ember: 'readonly'
      },
      rules: Object.keys({
        ...require('eslint-config-sane').rules,
        ...require('eslint-plugin-ember').configs.recommended.rules
      }).reduce((rules, rule) => {
        rules[rule] = 0;
        return rules;
      }, {})
    }
  ]
};
