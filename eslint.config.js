import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['dist/**', 'public/**'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      // prettier: eslintPluginPrettier
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-this-alias': 'warn',
      'no-redeclare': 'warn',
      'no-undef': 'warn',
      'no-cond-assign': 'warn',
      'no-useless-escape': 'warn',
      'no-control-regex': 'warn',
      'no-constant-binary-expression': 'warn',
      'no-prototype-builtins': 'warn',
      'no-empty': 'warn',
      'no-self-assign': 'warn'
      // 'prettier/prettier': [
      //   'warn',
      //   {
      //     arrowParens: 'always',
      //     semi: true,
      //     trailingComma: 'none',
      //     tabWidth: 2,
      //     endOfLine: 'auto',
      //     useTabs: false,
      //     singleQuote: true,
      //     printWidth: 120,
      //     jsxSingleQuote: true
      //   }
      // ]
    },
    ignores: ['**/node_modules/', '**/dist/']
  }
];
