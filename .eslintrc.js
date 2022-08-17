module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error']
  }
}
