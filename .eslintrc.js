module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true, // Add this line to enable Jest environment
  },
  extends: ['standard', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
}
