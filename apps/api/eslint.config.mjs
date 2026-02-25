import { nestConfig } from "@gongin/eslint-config/nest";
import tseslint from "typescript-eslint";

export default [
  // 1. กำหนด Ignores เป็น Global (ต้องอยู่บนสุดและไม่มี Key อื่น)
  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.mjs"],
  },
  // 2. นำ Config หลักมาใช้
  ...nestConfig,
  // 3. กำหนดค่า Parser เฉพาะสำหรับไฟล์ TypeScript ของ NestJS
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // 4. ปิด Type-check สำหรับไฟล์ config ที่เป็น JS/MJS เพื่อป้องกันอาการ Crash
  {
    files: ["**/*.js", "**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },
];