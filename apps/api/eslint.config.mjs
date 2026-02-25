import { nestConfig } from "@gongin/eslint-config/nest";

export default [
  ...nestConfig,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];