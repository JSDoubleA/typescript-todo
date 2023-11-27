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
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-unused-vars': 0, // typescript의 no-unused-vars 사용
    'class-methods-use-this': 0, // 필수적으로 선언되어야 하나 구현이 필요없는 경우가 있어 해제
    '@typescript-eslint/no-explicit-any': 0,
    'comma-dangle': ['error', 'always-multiline'],
  },
  ignorePatterns: ['jest.config.ts'],
};
