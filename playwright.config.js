const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: false,
    viewport: { width: 1280, height: 720 },
  },

  webServer: {
    command: 'echo "Services should be running"',
    port: 3000,
    reuseExistingServer: true,
  },
});