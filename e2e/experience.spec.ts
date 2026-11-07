import { expect, test } from "@playwright/test";
import {
  companyNames,
  findPhrases,
  forbiddenPhrases,
  jobSeekingPhrases,
} from "./support/content-rules";

type RoleExpectation = {
  title: string;
  /** Valores de `datetime` dos elementos `<time>` da entrada. */
  datetimes: string[];
  responsibilities: number;
  achievements: number;
  technologies: string[];
};

type ExperiencePage = {
  locale: "en" | "pt-BR";
  path: string;
  title: string;
  description: string;
  openGraphLocale: string;
  h1: string;
  labels: {
    responsibilities: string;
    achievements: string;
    technologies: string;
  };
  currentPeriod: RegExp;
  teamAttribution: RegExp;
  alternates: Record<string, string>;
  otherLanguage: { name: string; path: string };
  roles: RoleExpectation[];
};

const technologies = {
  techLead: [
    ".NET",
    "C#",
    "Clean Architecture",
    "SOLID",
    "PostgreSQL",
    "RabbitMQ",
  ],
  seniorBackend: [
    "C#",
    "ASP.NET Core",
    "PostgreSQL",
    "SQL Server",
    "MongoDB",
    "Redis",
    "RabbitMQ",
    "Entity Framework",
    "Dapper",
  ],
  fullStack2020: [
    "InterSystems Caché",
    "Azure Data Factory",
    "SQL Server",
    "JavaScript",
    "Node.js",
  ],
  fullStackEarly: ["InterSystems Caché", "SQL Server", "JavaScript"],
};

function roles(titles: {
  techLead: string;
  seniorBackend: string;
  fullStack: string;
}): RoleExpectation[] {
  return [
    {
      title: titles.techLead,
      datetimes: ["2023-05"],
      responsibilities: 4,
      achievements: 3,
      technologies: technologies.techLead,
    },
    {
      title: titles.seniorBackend,
      datetimes: ["2022-09", "2023-05"],
      responsibilities: 5,
      achievements: 0,
      technologies: technologies.seniorBackend,
    },
    {
      title: titles.fullStack,
      datetimes: ["2020-03", "2022-08"],
      responsibilities: 5,
      achievements: 0,
      technologies: technologies.fullStack2020,
    },
    {
      title: titles.fullStack,
      datetimes: ["2018-06", "2020-03"],
      responsibilities: 2,
      achievements: 0,
      technologies: technologies.fullStackEarly,
    },
    {
      title: titles.fullStack,
      datetimes: ["2016-07", "2018-06"],
      responsibilities: 2,
      achievements: 0,
      technologies: technologies.fullStackEarly,
    },
  ];
}

const pages: ExperiencePage[] = [
  {
    locale: "en",
    path: "/en/experience",
    title: "Experience | Bruno Lucildo",
    description:
      "Bruno Lucildo's career path from full-stack developer to backend technical lead: roles, responsibilities and results across more than ten years of enterprise software.",
    openGraphLocale: "en_US",
    h1: "Experience",
    labels: {
      responsibilities: "Responsibilities",
      achievements: "Achievements",
      technologies: "Technologies",
    },
    currentPeriod: /^May 2023 – Present$/,
    teamAttribution: /my team .* 80%.* before and after .* in production/,
    alternates: {
      en: "/en/experience",
      "pt-BR": "/pt-BR/experiencia",
      "x-default": "/en/experience",
    },
    otherLanguage: { name: "Português", path: "/pt-BR/experiencia" },
    roles: roles({
      techLead: "Technical Lead",
      seniorBackend: "Senior Backend Engineer",
      fullStack: "Full Stack Software Engineer",
    }),
  },
  {
    locale: "pt-BR",
    path: "/pt-BR/experiencia",
    title: "Experiência | Bruno Lucildo",
    description:
      "A trajetória profissional de Bruno Lucildo de desenvolvedor full stack a líder técnico backend: cargos, responsabilidades e resultados em mais de dez anos de software corporativo.",
    openGraphLocale: "pt_BR",
    h1: "Experiência",
    labels: {
      responsibilities: "Responsabilidades",
      achievements: "Conquistas",
      technologies: "Tecnologias",
    },
    currentPeriod: /^mai\.? 2023 – atual$/,
    teamAttribution:
      /minha equipe .* 80% .* antes e depois da mudança, em produção/,
    alternates: {
      en: "/en/experience",
      "pt-BR": "/pt-BR/experiencia",
      "x-default": "/en/experience",
    },
    otherLanguage: { name: "English", path: "/en/experience" },
    roles: roles({
      techLead: "Líder Técnico",
      seniorBackend: "Engenheiro Backend Sênior",
      fullStack: "Engenheiro de Software Full Stack",
    }),
  },
];

const viewportWidths = [360, 390, 768, 1366, 1440, 1920];

for (const experience of pages) {
  test.describe(`Experience (${experience.locale})`, () => {
    test("tem um h1 e cinco cargos do mais recente ao mais antigo", async ({
      page,
    }) => {
      await page.goto(experience.path);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        experience.h1,
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(
        page.getByRole("main").getByRole("heading", { level: 2 }),
      ).toHaveText(experience.roles.map((role) => role.title));
    });

    test("a linha do tempo é uma lista ordenada com cinco entradas", async ({
      page,
    }) => {
      await page.goto(experience.path);

      await expect(page.locator("main ol")).toHaveCount(1);
      await expect(page.locator("main ol > li")).toHaveCount(5);
    });

    test("os períodos usam <time> e o cargo atual termina em 'atual'", async ({
      page,
    }) => {
      await page.goto(experience.path);
      const items = page.locator("main ol > li");

      for (const [index, role] of experience.roles.entries()) {
        const times = items.nth(index).locator("time");
        expect(
          await times.evaluateAll((els) =>
            els.map((el) => el.getAttribute("datetime")),
          ),
        ).toEqual(role.datetimes);
      }

      const currentPeriod = (
        (await items.first().locator("p").first().textContent()) ?? ""
      ).trim();
      expect(currentPeriod).toMatch(experience.currentPeriod);
    });

    test("cada entrada mostra responsabilidades e tecnologias; só o cargo atual tem conquistas", async ({
      page,
    }) => {
      await page.goto(experience.path);
      const items = page.locator("main ol > li");

      for (const [index, role] of experience.roles.entries()) {
        const item = items.nth(index);
        const headings = await item
          .getByRole("heading", { level: 3 })
          .allTextContents();

        expect(headings).toEqual(
          role.achievements > 0
            ? [
                experience.labels.responsibilities,
                experience.labels.achievements,
                experience.labels.technologies,
              ]
            : [
                experience.labels.responsibilities,
                experience.labels.technologies,
              ],
        );

        const lists = item.locator("ul");
        await expect(lists.first().locator("li")).toHaveCount(
          role.responsibilities,
        );
        if (role.achievements > 0) {
          await expect(lists.nth(1).locator("li")).toHaveCount(
            role.achievements,
          );
        }
        await expect(item.locator("p").nth(1)).not.toBeEmpty();
      }
    });

    test("as tecnologias de cada cargo são as aprovadas", async ({ page }) => {
      await page.goto(experience.path);
      const items = page.locator("main ol > li");

      for (const [index, role] of experience.roles.entries()) {
        const lists = items.nth(index).locator("ul");
        const last = lists.nth((await lists.count()) - 1);
        expect(await last.locator("li").allTextContents()).toEqual(
          role.technologies,
        );
      }
    });

    test("atribui os 80% à equipe e informa como foram medidos", async ({
      page,
    }) => {
      await page.goto(experience.path);
      const achievements = await page
        .locator("main ol > li")
        .first()
        .locator("ul")
        .nth(1)
        .locator("li")
        .allTextContents();

      const rabbit = achievements.filter((text) => text.includes("RabbitMQ"));
      expect(rabbit).toHaveLength(1);
      expect(rabbit[0]).toMatch(experience.teamAttribution);
    });

    test("só publica as métricas autorizadas", async ({ page }) => {
      await page.goto(experience.path);
      const text = (await page.getByRole("main").textContent()) ?? "";

      expect(text.match(/\d+\s?%/g)).toEqual(["80%"]);
      expect(text).not.toContain("40%");
      expect(text.match(/200/g)).toHaveLength(1);
    });

    test("não cita a empresa nem usa expressões proibidas", async ({
      page,
    }) => {
      await page.goto(experience.path);

      const text = (await page.getByRole("main").textContent()) ?? "";
      const metadata = [
        await page.title(),
        (await page
          .locator('meta[name="description"]')
          .getAttribute("content")) ?? "",
        (await page
          .locator('meta[property="og:title"]')
          .getAttribute("content")) ?? "",
        (await page
          .locator('meta[property="og:description"]')
          .getAttribute("content")) ?? "",
      ].join("\n");

      for (const haystack of [text, metadata]) {
        expect(findPhrases(haystack, companyNames)).toEqual([]);
        expect(findPhrases(haystack, forbiddenPhrases)).toEqual([]);
        expect(findPhrases(haystack, jobSeekingPhrases)).toEqual([]);
      }
    });

    test("define metadados indexáveis para o idioma", async ({ page }) => {
      await page.goto(experience.path);

      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        experience.locale,
      );
      await expect(page).toHaveTitle(experience.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        experience.description,
      );
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        experience.openGraphLocale,
      );
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(new URL(canonical ?? "").pathname).toBe(experience.path);

      for (const [hreflang, path] of Object.entries(experience.alternates)) {
        const href = await page
          .locator(`link[rel="alternate"][hreflang="${hreflang}"]`)
          .getAttribute("href");
        expect(new URL(href ?? "").pathname, `hreflang ${hreflang}`).toBe(path);
      }
    });

    test("não tem imagens, animações, nem links na página", async ({
      page,
    }) => {
      await page.goto(experience.path);
      const main = page.getByRole("main");

      await expect(main.locator("img")).toHaveCount(0);
      await expect(
        main.locator('[class*="animate-"], [class*="parallax"]'),
      ).toHaveCount(0);
      // EXP-RF-13: sem estudos de caso na v1, não há links no conteúdo.
      await expect(main.locator("a, button")).toHaveCount(0);
    });

    test("os títulos não pulam níveis", async ({ page }) => {
      await page.goto(experience.path);

      const levels = await page
        .locator("main")
        .evaluate((main) =>
          [...main.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((h) =>
            Number(h.tagName.slice(1)),
          ),
        );

      expect(levels[0]).toBe(1);
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] ?? 0).toBeLessThanOrEqual((levels[i - 1] ?? 0) + 1);
      }
    });

    test("o teclado percorre skip link, header e footer", async ({ page }) => {
      await page.goto(experience.path);

      const hrefs: string[] = [];
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        const href = await page.evaluate(
          () => document.activeElement?.getAttribute("href") ?? "",
        );
        hrefs.push(href);
        if (href.startsWith("mailto:")) break;
      }

      expect(hrefs[0]).toBe("#main");
      expect(hrefs.indexOf(experience.path)).toBeGreaterThan(0);
      expect(
        hrefs.findIndex((href) => href.startsWith("mailto:")),
      ).toBeGreaterThan(hrefs.indexOf(experience.path));
    });

    test("a troca de idioma abre a página equivalente", async ({ page }) => {
      await page.goto(experience.path);
      await page
        .getByRole("link", { name: experience.otherLanguage.name, exact: true })
        .click();
      await expect(page).toHaveURL(
        new RegExp(`${experience.otherLanguage.path}/?$`),
      );
    });

    test("o texto tem no máximo 760 px e 80 caracteres por linha", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1366, height: 900 });
      await page.goto(experience.path);

      const measures = await page.evaluate(() => {
        const blocks = [...document.querySelectorAll("main p, main li")].filter(
          (el) => (el.firstChild?.textContent ?? "").length > 90,
        );

        return blocks.map((el) => {
          const node = el.firstChild as Text;
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
            width: el.getBoundingClientRect().width,
            longestLine: Math.max(...lines),
          };
        });
      });

      expect(measures.length).toBeGreaterThanOrEqual(10);
      for (const { width, longestLine } of measures) {
        expect(width).toBeLessThanOrEqual(760);
        expect(longestLine).toBeLessThanOrEqual(80);
      }
    });

    for (const width of viewportWidths) {
      test(`não rola na horizontal com ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(experience.path);

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
