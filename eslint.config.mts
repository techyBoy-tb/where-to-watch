// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   {
//     files:
//       [
//         "**/*.{js,mjs,cjs,ts,mts,cts}"
//       ],
//     plugins: {
//       js
//     },
//     extends: [
//       "js/recommended"
//     ],
//     languageOptions: {
//       globals: globals.browser
//     }
//   },
//   tseslint.configs.recommended,
// ]);

import { fileURLToPath } from "node:url";

const group = (pattern: string) => ({
  pattern,
  group: "external",
  position: "after",
});

// __dirname replacement for ESM
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default [
  {
    extends: ["universe/native", "universe/shared/typescript-analysis"],
    plugins: ["react-hooks"],
    overrides: [
      {
        files: ["*.ts", "*.tsx", "*.d.ts"],
        parserOptions: {
          project: "./tsconfig.json",
          tsconfigRootDir: __dirname,
        },
      },
      {
        files: ["*.test.ts", "*.test.tsx"],
        rules: {
          "import/first": "off",
          "import/order": "off",
        },
      },
    ],
    globals: {
      Intl: "readonly",
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "import/order": [
        "warn",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            ["parent", "index", "sibling"],
          ],
          pathGroups: [
            group("{@modules,expo-plugins}/**"),
            group("@navigators/**"),
            group("@screens/**"),
            group("@components/**"),
            group("@assets/**"),
            group("@{theme,theme/_palette,theme/typography}"),
            group("@{hooks,utils}/**"),
            group("@{api,data,graphql}/**"),
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
          },
        },
      ],
    },
  },
];
