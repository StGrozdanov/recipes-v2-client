import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  use: {
    baseURL: BASE_URL,
  },
  webServer: {
    command: 'npm start',
    url: BASE_URL,
    reuseExistingServer: !!process.env.CI,
  },
});