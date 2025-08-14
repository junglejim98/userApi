import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  { ignores: ['node_modules/**', 'dist/**'] },
  ...tseslint.configs.recommended, // базовый пресет TS без type-check
  {
    files: ['**/*.{ts,tsx,js}'],
    plugins: { prettier: prettierPlugin },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
      'prettier/prettier': 'error',
    },
  },
];
