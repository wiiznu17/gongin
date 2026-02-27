import { mobileConfig } from '@gongin/eslint-config/mobile';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...mobileConfig,
  {
    // Override กฎเฉพาะหน้างานของแอป Mobile
    rules: {
      // 'no-console': 'error'
    },
  },
];
