import globals from 'globals'
import pluginJs from '@eslint/js'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { ignores: ['**/node_modules', '**/dist'] },
  {
    languageOptions: { globals: { ...globals.node }, sourceType: 'module', ecmaVersion: 'latest' },
  },
  { plugins: { prettier: prettierPlugin } },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-case-declarations': 'off',
      semi: ['error', 'never'],
    },
  },
]
