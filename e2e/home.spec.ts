import { expect, type Page, test } from "@playwright/test";
import { findPhrases, forbiddenPhrases } from "./support/content-rules";

type HomePage = {
  locale: "en" | "pt-BR";
  path: string;
  headline: string;
  facts: string[];
  projectStatus: string;
  repositoryLink: string;
  aiLab: { name: string; path: string };
};

const pages: HomePage[] = [
  {
    locale: "en",
    path: "/en",
    headline: "Engineering beyond code.",
    facts: [
      "10+ years of experience",
      "Backend development and technical leadership",
      "Leading a team of five developers",
    ],
    projectStatus: "In development",
    repositoryLink: "View on GitHub",
    aiLab: { name: "Explore the AI Lab", path: "/en/ai-lab" },
  },
  {
    locale: "pt-BR",
    path: "/pt-BR",
    headline: "Engenharia além do código.",
    facts: [
      "Mais de 10 anos de experiência",
      "Desenvolvimento backend e liderança técnica",
      "Liderando uma equipe de cinco desenvolvedores",
    ],
    projectStatus: "Em desenvolvimento",
    repositoryLink: "Ver no GitHub",
    aiLab: { name: "Explorar o AI Lab", path: "/pt-BR/ai-lab" },
  },
];

const repositories = [
  "https://github.com/brunolucildo/football-stat-analytics-cli",
  "https://github.com/brunolucildo/reelix",
];

test("a raiz redireciona para o idioma padrão", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/?$/);
});

test.describe("Parallax do Hero", () => {
  /** Deslocamento vertical (px) de cada camada, na ordem fundo, meio e frente. */
  async function layerOffsets(page: Page): Promise<number[]> {
    return page.evaluate(() =>
      [...document.querySelectorAll(".hero-parallax")].map((layer) => {
        const { transform } = getComputedStyle(layer);
        return transform === "none" ? 0 : new DOMMatrix(transform).m42;
      }),
    );
  }

  test("as camadas se movem com o scroll, mais rápido quanto mais à frente", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en");
    expect(await layerOffsets(page)).toEqual([0, 0, 0]);

    await page.evaluate(() => window.scrollTo(0, 400));
    await expect
      .poll(async () => (await layerOffsets(page))[0])
      .toBeLessThan(-60);

    const [back = 0, mid = 0, front = 0] = await layerOffsets(page);
    expect(mid).toBeLessThan(back);
    expect(front).toBeLessThan(mid);
    // Movimento perceptível: a camada da frente sobe mais de 200 px.
    expect(front).toBeLessThan(-200);
  });

  test("não há parallax com movimento reduzido", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en");

    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(300);
    expect(await layerOffsets(page)).toEqual([0, 0, 0]);
  });

  test("não há parallax abaixo de 1024 px", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/en");

    for (const layer of await page.locator(".hero-parallax").all()) {
      await expect(layer).toBeHidden();
    }
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(300);
    expect(await layerOffsets(page)).toEqual([0, 0, 0]);
  });

  test("onde o CSS é suportado, o fallback em JavaScript não é ativado", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en");
    await page.waitForTimeout(300);

    await expect(page.locator("[data-parallax-fallback]")).toHaveCount(0);
  });

  // HOME-CA-18: o Chromium suporta scroll-driven animations, então estes testes
  // simulam um navegador sem suporte (ex.: Firefox): `CSS.supports` nega
  // `animation-timeline` e as animações CSS são anuladas, de modo que só o
  // JavaScript consegue mover as camadas.
  test.describe("fallback em JavaScript (navegador sem scroll-driven animations)", () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        const supports = CSS.supports.bind(CSS);
        CSS.supports = (property: string, value?: string) => {
          if (property.includes("animation-timeline")) return false;
          return value === undefined
            ? supports(property)
            : supports(property, value);
        };
      });
    });

    async function openWithoutCssParallax(page: Page, width = 1440) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/en");
      await page.addStyleTag({
        content: ".hero-parallax { animation: none !important; }",
      });
    }

    /** Rotação (graus) da camada da frente. */
    async function frontRotation(page: Page): Promise<number> {
      return page.evaluate(() =>
        Number.parseFloat(
          getComputedStyle(
            document.querySelector('[data-parallax-layer="front"]') as Element,
          ).rotate,
        ),
      );
    }

    const active = (page: Page) => page.locator("[data-parallax-fallback]");

    test("as camadas se movem e giram com o scroll, como no CSS", async ({
      page,
    }) => {
      await openWithoutCssParallax(page);
      await expect(active(page)).toHaveCount(1);
      expect(await layerOffsets(page)).toEqual([0, 0, 0]);
      expect(await frontRotation(page)).toBeCloseTo(12, 1);

      await page.evaluate(() => window.scrollTo(0, 400));
      await expect
        .poll(async () => (await layerOffsets(page))[2])
        .toBeLessThan(-200);

      const [back = 0, mid = 0, front = 0] = await layerOffsets(page);
      expect(mid).toBeLessThan(back);
      expect(front).toBeLessThan(mid);
      expect(await frontRotation(page)).toBeGreaterThan(40);

      // Após 80vh (720 px) o movimento termina nos valores finais do CSS.
      await page.evaluate(() => window.scrollTo(0, 2000));
      await expect
        .poll(async () => (await layerOffsets(page))[2])
        .toBeCloseTo(-520, 0);
      const [endBack = 0, endMid = 0] = await layerOffsets(page);
      expect(endBack).toBeCloseTo(-140, 0);
      expect(endMid).toBeCloseTo(-300, 0);
      expect(await frontRotation(page)).toBeCloseTo(100, 0);
    });

    test("não é ativado com movimento reduzido", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await openWithoutCssParallax(page);

      await page.evaluate(() => window.scrollTo(0, 400));
      await page.waitForTimeout(300);
      await expect(active(page)).toHaveCount(0);
      expect(await layerOffsets(page)).toEqual([0, 0, 0]);
    });

    test("não é ativado abaixo de 1024 px", async ({ page }) => {
      await openWithoutCssParallax(page, 768);

      await page.evaluate(() => window.scrollTo(0, 400));
      await page.waitForTimeout(300);
      await expect(active(page)).toHaveCount(0);
      expect(await layerOffsets(page)).toEqual([0, 0, 0]);
    });

    test("liga e desliga ao mudar as condições, sem recarregar a página", async ({
      page,
    }) => {
      await openWithoutCssParallax(page);
      await expect(active(page)).toHaveCount(1);
      await page.evaluate(() => window.scrollTo(0, 400));
      await expect
        .poll(async () => (await layerOffsets(page))[2])
        .toBeLessThan(-200);

      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(active(page)).toHaveCount(0);
      // A regra global de movimento reduzido deixa uma transição de 0,01 ms ao
      // devolver as camadas à posição original; por isso a leitura aguarda.
      await expect.poll(() => layerOffsets(page)).toEqual([0, 0, 0]);

      await page.emulateMedia({ reducedMotion: "no-preference" });
      await expect(active(page)).toHaveCount(1);
      await expect
        .poll(async () => (await layerOffsets(page))[2])
        .toBeLessThan(-200);

      await page.setViewportSize({ width: 800, height: 900 });
      await expect(active(page)).toHaveCount(0);
      expect(await layerOffsets(page)).toEqual([0, 0, 0]);

      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(active(page)).toHaveCount(1);
    });
  });
});

for (const home of pages) {
  test.describe(`Home (${home.locale})`, () => {
    test("apresenta o posicionamento e os fatos aprovados", async ({
      page,
    }) => {
      await page.goto(home.path);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        home.headline,
      );
      for (const fact of home.facts) {
        await expect(page.getByRole("main")).toContainText(fact);
      }
    });

    test("destaca dois projetos em desenvolvimento com link para o GitHub", async ({
      page,
    }) => {
      await page.goto(home.path);

      const projects = page.locator("#featured-projects li");
      await expect(projects).toHaveCount(2);
      for (const project of await projects.all()) {
        await expect(project).toContainText(home.projectStatus);
      }

      const links = page
        .locator("#featured-projects")
        .getByRole("link", { name: home.repositoryLink });
      await expect(links).toHaveCount(2);
      expect(
        await links.evaluateAll((els) =>
          els.map((a) => a.getAttribute("href")),
        ),
      ).toEqual(repositories);
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
      }
    });

    test("o link do AI Lab leva à rota do idioma", async ({ page }) => {
      await page.goto(home.path);
      await page.getByRole("link", { name: home.aiLab.name }).click();
      await expect(page).toHaveURL(new RegExp(`${home.aiLab.path}/?$`));
    });

    test("não usa mensagens de disponibilidade profissional", async ({
      page,
    }) => {
      await page.goto(home.path);
      const text = (await page.getByRole("main").textContent()) ?? "";
      expect(findPhrases(text, forbiddenPhrases)).toEqual([]);
    });
  });
}
