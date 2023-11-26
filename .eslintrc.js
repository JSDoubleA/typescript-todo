module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base/legacy',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        'webpack.config.js',
        '.eslintrc.{js,cjs}',
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-unused-vars': 0, // typescript의 no-unused-vars 사용
    'class-methods-use-this': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': ['error'],
    'comma-dangle': ['error', 'always-multiline'],
  },
};
