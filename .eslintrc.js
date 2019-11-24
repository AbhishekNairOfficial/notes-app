module.exports = {
  root: true,
  "extends": [
    "@react-native-community",
    "airbnb",
    "prettier"
  ],
  "env":{
    "browser":true,
  },
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": ["error"],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "no-console": 0,
    "no-use-before-define": ["error", { "variables": false }],
    "react/no-array-index-key": 0,
    "react/prop-types":0,
    "consistent-return":0

  }
};