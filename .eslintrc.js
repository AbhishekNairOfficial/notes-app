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
  plugins: ['prettier', 'unused-imports'],
  rules: {
    'prettier/prettier': ['error'],
    'react/jsx-filename-extension': [1, {extensions: ['.js', '.jsx']}],
    'no-console': 0,
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
