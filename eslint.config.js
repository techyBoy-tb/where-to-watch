const group = (pattern) => ({
  pattern,
  group: 'external',
  position: 'after',
});

module.exports = {
  extends: ['universe/native', 'universe/shared/typescript-analysis'],
  plugins: ['react-hooks'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.__dirname,
      },
    },
    {
      // Don't enforce import/* for tests files
      files: ['*.test.ts', '*.test.tsx'],
      rules: {
        'import/first': 0,
        'import/order': 0,
      },
    },
  ],
  globals: {
    Intl: 'readonly',
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'import/order': [
      'warn',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'index', 'sibling'],
        ],
        pathGroups: [
          group('{@modules,expo-plugins}/**'),
          group('@navigators/**'),
          group('@screens/**'),
          group('@components/**'),
          group('@assets/**'),
          group('@{theme,theme/_palette,theme/typography}'),
          group('@{hooks,utils}/**'),
          group('@{api,data,graphql}/**'),
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
        },
      },
    ],
  },
};
