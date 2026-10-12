import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

const noAxios = {
  name: 'axios',
  message: 'axios를 직접 import 하지 않는다. @/api/axios의 api를 쓴다.',
};

// 검사는 @/features/ 경로를 보고 동작한다. 같은 도메인은 상대 경로로 import 한다
const noOtherFeature = {
  group: ['@/features/**'],
  allowImportNamePattern: 'Keys$',
  message:
    '다른 도메인을 import 하지 않는다. 같이 쓰는 코드는 components·hooks·utils로 올린다. queryKey 객체(xxxKeys)만 예외다.',
};

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // JSX에서만 쓰는 컴포넌트를 안 쓴 변수로 보지 않게 한다
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message: 'fetch를 쓰지 않는다. @/api/axios의 api를 쓴다.',
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'window',
          property: 'fetch',
          message: 'fetch를 쓰지 않는다. @/api/axios의 api를 쓴다.',
        },
      ],
      'no-restricted-imports': ['error', { paths: [noAxios] }],
    },
  },
  {
    files: ['src/features/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { paths: [noAxios], patterns: [noOtherFeature] },
      ],
    },
  },
  {
    files: ['src/api/axios.js'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },
  prettier,
]);
