import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = `http://localhost:${port}`;

// Chama o Next direto do node_modules, sem depender do pnpm global.
const next = "node ./node_modules/next/dist/bin/next";

/** Specs que também rodam no Firefox e no WebKit. */
const crossBrowserSpecs = /(layout|i18n)\.spec\.ts$/;

/**
 * Testes end-to-end contra o build de produção (QA.md, seção 3.3).
 * Os testes sobem o app em uma porta própria e sempre testam um build novo.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // Menos workers que o padrão (50% dos núcleos): com três navegadores, a disputa
  // por CPU deixa instáveis os testes que dependem de tempo, como a degradação
  // da rede neural, que emula uma CPU mais lenta.
  workers: "35%",
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    // Chromium roda tudo; Firefox e WebKit (o motor do Safari) rodam só a
    // navegação, o menu mobile e o idioma (QA.md, seção 3.3).
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: crossBrowserSpecs,
      // Mais lentos que o Chromium nos testes com muitas navegações.
      timeout: 90_000,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch: crossBrowserSpecs,
      timeout: 90_000,
    },
  ],
  webServer: {
    command: `${next} build && ${next} start -p ${port}`,
    url: `${baseURL}/en`,
    // Canonical e Open Graph usam esta URL, definida em tempo de build.
    env: { NEXT_PUBLIC_SITE_URL: baseURL },
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
