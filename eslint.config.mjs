import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import tsdoc from "eslint-plugin-tsdoc";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      tsdoc,
    },
  },
  {
    rules: {
      "tsdoc/syntax": "warn",
    },
  },
  { ignores: [
      "**/coverage/**",
      "**/build/**",
      "**/dist/**",
      "**/docs/**",
      "**/node_modules/**",
      ".eslintrc.json",
      ".eslint.config.mjs",
      "eslint.config.mjs",
      ".gitignore",
      ".prettierignore",
      ".prettierrc",
      ".prettierrc.json",
      "custom-styles.css",
      "package-lock.json",
      "package.json",
      "tsconfig.json",
      "tsdoc.json",
      "typedoc.json",
      ".vscode/**",
      ".github/workflows/**",
    ], 
  },
];
