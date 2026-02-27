import expo from "eslint-config-expo/flat.js";
import eslintConfigPrettier from "eslint-config-prettier";
import { config as baseConfig } from "./base.js";

/**
 * คอนฟิก ESLint สำหรับ Expo / React Native
 * @type {import("eslint").Linter.Config[]}
 */
export const mobileConfig = [
  ...baseConfig,
  ...expo,
  {
    ignores: ["dist/**", ".expo/**", "babel.config.js", "metro.config.js"],
  },
  {
    rules: {
      // "prettier/prettier": "warn",
    },
  },
  eslintConfigPrettier,
];
