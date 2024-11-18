import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import tsParser from '@typescript-eslint/parser'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierPlugin from 'eslint-plugin-prettier'
import { fixupPluginRules } from '@eslint/compat'

const languageOptions = {
  globals: {
    ...globals.node,
    ...globals.jest,
    ...globals.browser,
  },
  ecmaVersion: 'latest',
  sourceType: 'module',
  parser: tsParser,
}

const pluginsOptions = {
  import: importPlugin,
  'import/parsers': tsParser,
  'react-hooks': fixupPluginRules(reactHooksPlugin),
  prettier: prettierPlugin,
}

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { ignores: ['**/node_modules', '**/dist'] },
  {
    plugins: {
      ...pluginsOptions,
    },
  },
  {
    languageOptions: {
      ...languageOptions,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'no-console': 1,
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
        },
      ],
      semi: ['error', 'never'],
      'no-useless-escape': 'off',
      'no-empty': 'off',
      'no-prototype-builtins': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
]
