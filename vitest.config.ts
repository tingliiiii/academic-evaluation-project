import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    /**
     * 測試環境
     * - 'node': 用於 API 和單元測試
     * - 'jsdom': 用於 React 組件測試
     */
    environment: 'node',
    
    /**
     * 全域測試 API
     * 允許在測試文件中使用 describe、it、expect 而無需導入
     */
    globals: true,
    
    /**
     * 超時設置（毫秒）
     */
    testTimeout: 30000,
    
    /**
     * 覆蓋率設置
     */
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        'coverage/',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
