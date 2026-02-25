import expo from 'eslint-config-expo/flat';
import { config as baseConfig } from './base.js';

/**
 * คอนฟิก ESLint สำหรับ Expo / React Native
 * @type {import("eslint").Linter.Config[]}
 */
export const mobileConfig = [
  ...baseConfig, // ใช้กฎพื้นฐานจาก base.js เช่น Turbo และ Prettier
  ...expo,       // ใช้คอนฟิกมาตรฐานของ Expo
  {
    ignores: ['dist/**', '.expo/**', 'babel.config.js', 'metro.config.js'],
  },
  {
    rules: {
      // ปรับแต่งกฎเพิ่มเติมสำหรับ Mobile ถ้าต้องการ
      'react-native/no-inline-styles': 'warn',
    },
  },
];