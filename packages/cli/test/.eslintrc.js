module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['plugin:prettier/recommended'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'error',
    'no-undef': 'error',
    'prettier/prettier': 'warn',
  },
}
