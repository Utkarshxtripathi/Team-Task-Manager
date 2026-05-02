import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";

export default [
  eslint.configs.recommended,
  prettierConfig,
  {
    ignores: [
      "node_modules/",
      "client/node_modules/",
      "client/dist/",
      "server/node_modules/"
    ],
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
    },
  },
];

