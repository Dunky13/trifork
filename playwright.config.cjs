const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './e2e', testMatch: '**/*.spec.cjs', workers: 1,
  use: { baseURL: 'http://127.0.0.1:4200' },
  webServer: { command: 'npm run start:test', url: 'http://127.0.0.1:4200', reuseExistingServer: false },
});
