// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,

  env: {
    node: true
  },

  globals: {
    baseURL: true,
    commonAPI: true
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-unused-vars': 'off'
  },

  extends: ['@vue/standard']
}
