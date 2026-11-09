import { expect, test } from "@playwright/test";
import {
  findPhrases,
  forbiddenPhrases,
  withheldFromAbout,
} from "./support/content-rules";

type AboutPage = {
  locale: "en" | "pt-BR";
  path: string;
  title: string;
  description: string;
  openGraphLocale: string;
  h1: string;
  h2: string[];
  experience: { name: string; path: string };
  aiLab: { name: string; path: string };
  inProgress: string;
  alternates: Record<string, string>;
  otherLanguage: { name: string; path: string };
};

const pages: AboutPage[] = [
  {
    locale: "en",
    path: "/en/about",
    title: "About | Bruno Lucildo",
    description:
      "Bruno Lucildo's path from full-stack developer to backend technical lead, how he works, and his study of AI systems.",
    openGraphLocale: "en_US",
    h1: "About",
    h2: [
      "How I got here",
      "Development and leadership",
      "Exploring AI",
      "Education",
    ],
    experience: { name: "View experience", path: "/en/experience" },
    aiLab: { name: "Explore the AI Lab", path: "/en/ai-lab" },
    inProgress: "In progress",
    alternates: {
      en: "/en/about",
      "pt-BR": "/pt-BR/sobre",
      "x-default": "/en/about",
    },
    otherLanguage: { name: "PT, Português", path: "/pt-BR/sobre" },
  },
  {
    locale: "pt-BR",
    path: "/pt-BR/sobre",
    title: "Sobre | Bruno Lucildo",
    description:
      "A trajetória de Bruno Lucildo de desenvolvedor full-stack a líder técnico backend, como ele trabalha e seus estudos em sistemas de IA.",
    openGraphLocale: "pt_BR",
    h1: "Sobre",
    h2: [
      "Minha trajetória",
      "Desenvolvimento e liderança",
      "Explorando IA",
      "Formação",
    ],
    experience: { name: "Ver experiência", path: "/pt-BR/experiencia" },
    aiLab: { name: "Explorar o AI Lab", path: "/pt-BR/ai-lab" },
    inProgress: "Em andamento",
    alternates: {
      en: "/en/about",
      "pt-BR": "/pt-BR/sobre",
      "x-default": "/en/about",
    },
    otherLanguage: { name: "EN, English", path: "/en/about" },
  },
];

const viewportWidths = [360, 390, 768, 1366, 1440, 1920];

for (const about of pages) {
  test.describe(`About (${about.locale})`, () => {
    test("tem um h1 e as quatro seções na ordem prevista", async ({ page }) => {
      await page.goto(about.path);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        about.h1,
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(
        page.getByRole("main").getByRole("heading", { level: 2 }),
      ).toHaveText(about.h2);
    });

    test("define metadados indexáveis para o idioma", async ({ page }) => {
      await page.goto(about.path);

      await expect(page.locator("html")).toHaveAttribute("lang", about.locale);
      await expect(page).toHaveTitle(about.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        about.description,
      );
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        about.openGraphLocale,
      );
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(new URL(canonical ?? "").pathname).toBe(about.path);

      for (const [hreflang, path] of Object.entries(about.alternates)) {
        const href = await page
          .locator(`link[rel="alternate"][hreflang="${hreflang}"]`)
          .getAttribute("href");
        expect(new URL(href ?? "").pathname, `hreflang ${hreflang}`).toBe(path);
      }
    });

    test("lista cada curso com nome, instituição e período", async ({
      page,
    }) => {
      await page.goto(about.path);

      const items = page.locator("#education li");
      await expect(items).toHaveCount(2);
      for (const item of await items.all()) {
        await expect(item.locator("p")).toHaveCount(3);
      }
      await expect(items.last()).toContainText(about.inProgress);
    });

    test("link de experiência leva à rota do idioma", async ({ page }) => {
      await page.goto(about.path);
      await page.getByRole("link", { name: about.experience.name }).click();
      await expect(page).toHaveURL(new RegExp(`${about.experience.path}/?$`));
    });

    test("link do AI Lab leva à rota do idioma", async ({ page }) => {
      await page.goto(about.path);
      await page.getByRole("link", { name: about.aiLab.name }).click();
      await expect(page).toHaveURL(new RegExp(`${about.aiLab.path}/?$`));
    });

    test("a troca de idioma abre a página equivalente", async ({ page }) => {
      await page.goto(about.path);
      await page
        .getByRole("link", { name: about.otherLanguage.name, exact: true })
        .click();
      await expect(page).toHaveURL(
        new RegExp(`${about.otherLanguage.path}/?$`),
      );
    });

    test("não tem expressões proibidas, imagens nem animações", async ({
      page,
    }) => {
      await page.goto(about.path);
      const main = page.getByRole("main");

      const text = (await main.textContent()) ?? "";
      expect(findPhrases(text, forbiddenPhrases)).toEqual([]);
      expect(findPhrases(text, withheldFromAbout)).toEqual([]);

      await expect(main.locator("img")).toHaveCount(0);
      await expect(
        main.locator('[class*="animate-"], [class*="parallax"]'),
      ).toHaveCount(0);
    });

    test("o teclado percorre skip link, header, links da página e footer", async ({
      page,
    }) => {
      await page.goto(about.path);

      const hrefs: string[] = [];
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        const href = await page.evaluate(
          () => document.activeElement?.getAttribute("href") ?? "",
        );
        hrefs.push(href);
        if (href.startsWith("mailto:")) break;
      }

      const experience = hrefs.indexOf(about.experience.path);
      const aiLab = hrefs.indexOf(about.aiLab.path);
      const footer = hrefs.findIndex((href) => href.startsWith("mailto:"));

      expect(hrefs[0]).toBe("#main");
      expect(hrefs.indexOf(about.path)).toBeGreaterThan(0);
      expect(hrefs.indexOf(about.path)).toBeLessThan(experience);
      expect(experience).toBeGreaterThan(-1);
      expect(aiLab).toBeGreaterThan(experience);
      expect(footer).toBeGreaterThan(aiLab);
    });

    test("o foco é visível nos links da página", async ({ page }) => {
      await page.goto(about.path);
      const link = page.getByRole("link", { name: about.experience.name });

      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        if (await link.evaluate((el) => el === document.activeElement)) break;
      }

      await expect(link).toBeFocused();
      await expect(link).toHaveCSS("outline-style", "solid");
      await expect(link).toHaveCSS("outline-width", "2px");
    });

    test("os links têm alvo de toque de pelo menos 44 px", async ({ page }) => {
      await page.goto(about.path);
      for (const link of await page.getByRole("main").getByRole("link").all()) {
        const box = await link.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }
    });

    test("o texto tem no máximo 760 px e 80 caracteres por linha", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1366, height: 900 });
      await page.goto(about.path);

      const measures = await page.evaluate(() => {
        const paragraphs = [...document.querySelectorAll("main p")].filter(
          (p) => (p.textContent ?? "").length > 120,
        );

        return paragraphs.map((p) => {
          const node = p.firstChild as Text;
          const text = node.textContent ?? "";
          const range = document.createRange();
          const lines: number[] = [];
          let top: number | null = null;
          let count = 0;

          for (let i = 0; i < text.length; i++) {
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const rect = range.getClientRects()[0];
            if (!rect) {
              count++;
              continue;
            }
            const y = Math.round(rect.top);
            if (top === null) top = y;
            if (y !== top) {
              lines.push(count);
              count = 0;
              top = y;
            }
            count++;
          }
          lines.push(count);

          return {
            width: p.getBoundingClientRect().width,
            longestLine: Math.max(...lines),
          };
        });
      });

      expect(measures.length).toBeGreaterThanOrEqual(4);
      for (const { width, longestLine } of measures) {
        expect(width).toBeLessThanOrEqual(760);
        expect(longestLine).toBeLessThanOrEqual(80);
      }
    });

    for (const width of viewportWidths) {
      test(`não rola na horizontal com ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(about.path);

        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}
