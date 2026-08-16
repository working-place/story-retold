import { defineConfig, devices } from '@playwright/test';

// Два режима (теги в spec-файлах):
//  @mock — POST /api/card/create перехватывается мок-роутом (быстрый, без бека)
//  @real — реальный бек https://digital-memory.ru/api (главный для разработки:
//          ловит «ложный контракт» бека)
// Скрипты:
//  npm run test:e2e        → только @real
//  npm run test:e2e-mock   → только @mock
//  npm run test:e2e-all    → оба
const mode = process.env.E2E_MODE || 'all';

const grepByMode: Record<string, RegExp> = {
  real: /@real/,
  mock: /@mock/,
  all: /.*/,
};

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'ru-RU',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  grep: grepByMode[mode] || /.*/,
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
