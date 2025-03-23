import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser'; // ✅ add this
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tailwindcss from 'eslint-plugin-tailwindcss';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      'node_modules',
      'dist/**',
      '.vite/**',
      'public/**',
      '*.log',
      '*.tmp',
      '.env*',
      'coverage/**',
    ],
  },
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser, // ✅ use vue-eslint-parser
      parserOptions: {
        parser: tsParser, // ✅ delegate <script> to TS parser
        ecmaVersion: 2020,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: {
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': tsPlugin,
      tailwindcss,
      prettier,
    },
    rules: {
      'vue/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'tailwindcss/no-custom-classname': 'off',
      'prettier/prettier': 'warn',
    },
  },
];
