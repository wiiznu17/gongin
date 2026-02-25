import { nextJsConfig } from "@gongin/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    // เพิ่มเติมกฎเฉพาะของ admin-web ถ้ามี
    rules: {
      // ตัวอย่าง: "no-console": "warn"
    },
  },
];