// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,

  env: {
    node: true
  },

  globals: {
    Vue: true,
    Get: true,
    Post: true,
    NProgress: true,
    Helper: true,
    baseURL: true,
    localStore: true,
    $: true
  },

  rules: {
    eqeqeq: 'off',
    'import/no-webpack-loader-syntax': 'off',
    'no-new': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  extends: ['plugin:vue/essential', '@vue/standard']
}
