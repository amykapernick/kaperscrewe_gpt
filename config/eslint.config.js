module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './config/tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    // Add your custom rules here
  },
};