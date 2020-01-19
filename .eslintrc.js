module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'airbnb',
    'prettier',
    'eslint:recommended',
  ],
  env: {
    browser: true,
  },
  plugins: ['prettier', 'unused-imports', 'import'],
  rules: {
    'import/no-unresolved': [2, {commonjs: true, amd: true}],
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@react-native-firebase/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@react-native-community/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
      },
    ],
    'prettier/prettier': ['error'],
    'react/jsx-filename-extension': [1, {extensions: ['.js', '.jsx']}],
    'no-console': 1,
    'no-use-before-define': ['error', {variables: false}],
    'react/no-array-index-key': 0,
    'react/prop-types': 0,
    'consistent-return': 0,
    'global-require': 0,
    'require-await': 2,
    'max-lines': [
      'error',
      {max: 250, skipBlankLines: true, skipComments: true},
    ],
    'react-native/no-inline-styles': 0,
    'react-native/no-color-literals': 0,
    'padding-line-between-statements': [
      'error',
      {blankLine: 'always', prev: ['const', 'let', 'var'], next: '*'},
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
    ],
    'unused-imports/no-unused-imports': 2,
    'space-before-blocks': ['error', {functions: 'never', keywords: 'always'}],
  },
};
