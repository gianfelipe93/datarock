import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      globals: globals.browser,
    },
    // ... other configuration options (if any)
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
