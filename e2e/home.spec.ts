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
