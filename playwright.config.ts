import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = `http://localhost:${port}`;

// Chama o Next direto do node_modules, sem depender do pnpm global.
const next = "node ./node_modules/next/dist/bin/next";

/**
 * Testes end-to-end contra o build de produção (QA.md, seção 3.3).
 * Os testes sobem o app em uma porta própria e sempre testam um build novo.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `${next} build && ${next} start -p ${port}`,
    url: `${baseURL}/en`,
    // Canonical e Open Graph usam esta URL, definida em tempo de build.
    env: { NEXT_PUBLIC_SITE_URL: baseURL },
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
