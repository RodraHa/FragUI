// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, prettierConfig, {
  files: ["src/**/*.{ts,tsx}"],
  plugins: {
    react,
    "react-hooks": reactHooks,
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
  settings: {
    react: { version: "detect" },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
}, {
  ignores: ["dist/", "node_modules/", "storybook-static/"],
}, storybook.configs["flat/recommended"]);
