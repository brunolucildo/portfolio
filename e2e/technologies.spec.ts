import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { experienceRoles } from "../src/config/experience";
import { projects } from "../src/config/projects";
import {
  technologyAliases,
  technologyCategories,
} from "../src/config/technologies";
import {
  companyNames,
  findPhrases,
  forbiddenPhrases,
  jobSeekingPhrases,
} from "./support/content-rules";

type Context = "experience" | "football" | "reelix" | "rondo" | "fintalab";

/** Ícone esperado: arquivo de marca, monograma ou nenhum. */
type IconExpectation = { brand: string } | { monogram: string } | "none";

type ItemExpectation = {
  name: string;
  icon: IconExpectation;
  context: Context[];
};

type CategoryExpectation = {
  key: string;
  items: ItemExpectation[];
};

/** Conteúdo esperado da seção 7.1 da SPEC-005, independente de `technologies.ts`. */
const categories: CategoryExpectation[] = [
  {
    key: "languages",
    items: [
      { name: "C#", icon: { brand: "csharp" }, context: ["experience"] },
      {
        name: "JavaScript",
        icon: { brand: "javascript" },
        context: ["experience"],
      },
      {
        name: "TypeScript",
        icon: { brand: "typescript" },
        context: ["football", "reelix", "rondo", "fintalab"],
      },
      {
        name: "InterSystems Caché",
        icon: { monogram: "IC" },
        context: ["experience"],
      },
    ],
  },
  {
    key: "backend",
    items: [
      {
        name: ".NET",
        icon: { brand: "dotnetcore" },
        context: ["experience", "reelix"],
      },
      {
        name: "ASP.NET Core",
        icon: { monogram: "AS" },
        context: ["experience", "reelix"],
      },
      {
        name: "Node.js",
        icon: { brand: "nodejs" },
        context: ["experience", "football", "rondo"],
      },
      {
        name: "Entity Framework Core",
        icon: { brand: "entityframeworkcore" },
        context: ["experience", "reelix"],
      },
      { name: "Dapper", icon: { monogram: "Da" }, context: ["experience"] },
    ],
  },
  {
    key: "databases",
    items: [
      {
        name: "PostgreSQL",
        icon: { brand: "postgresql" },
        context: ["experience", "reelix", "rondo"],
      },
      {
        name: "SQL Server",
        icon: { brand: "microsoftsqlserver" },
        context: ["experience"],
      },
      {
        name: "MongoDB",
        icon: { brand: "mongodb" },
        context: ["experience"],
      },
      {
        name: "SQLite",
        icon: { brand: "sqlite" },
        context: ["football", "fintalab"],
      },
    ],
  },
  {
    key: "messaging",
    items: [
      {
        name: "RabbitMQ",
        icon: { brand: "rabbitmq" },
        context: ["experience"],
      },
      { name: "Redis", icon: { brand: "redis" }, context: ["experience"] },
      { name: "Azure Service Bus", icon: { monogram: "SB" }, context: [] },
    ],
  },
  {
    key: "architecture",
    items: [
      { name: "REST APIs", icon: "none", context: ["experience", "reelix"] },
      { name: "Microservices", icon: "none", context: ["experience"] },
      { name: "Clean Architecture", icon: "none", context: ["experience"] },
      { name: "SOLID", icon: "none", context: ["experience"] },
      {
        name: "Event-Driven Architecture",
        icon: "none",
        context: ["experience"],
      },
      { name: "Automated testing", icon: "none", context: ["football"] },
    ],
  },
  {
    key: "ai",
    items: [
      {
        name: "OpenAI API",
        icon: { monogram: "OA" },
        context: ["football", "fintalab"],
      },
      { name: "RAG", icon: { monogram: "RG" }, context: ["football"] },
    ],
  },
  {
    key: "frontend",
    items: [
      {
        name: "React Native",
        icon: { brand: "reactnative" },
        context: ["reelix"],
      },
      { name: "Expo", icon: { brand: "expo" }, context: ["reelix"] },
    ],
  },
  {
    key: "tools",
    items: [
      {
        name: "Azure Data Factory",
        icon: { brand: "azuredatafactory" },
        context: ["experience"],
      },
      {
        name: "Supabase Auth",
        icon: { brand: "supabase" },
        context: ["reelix"],
      },
      {
        name: "TMDB",
        icon: { brand: "themoviedatabase" },
        context: ["reelix"],
      },
    ],
  },
];

type TechnologiesPage = {
  locale: "en" | "pt-BR";
  path: string;
  title: string;
  description: string;
  openGraphLocale: string;
  h1: string;
  intro: string;
  note: string;
  categoryTitles: string[];
  contextLabels: Record<Context, string>;
  /** Destino de cada item de contexto (TECH-RF-10). */
  contextPaths: Record<Context, string>;
  navigation: {
    label: string;
    footer: string;
    names: string[];
    paths: string[];
  };
  alternates: Record<string, string>;
  otherLanguage: { name: string; path: string };
};

const pages: TechnologiesPage[] = [
  {
    locale: "en",
    path: "/en/technologies",
    title: "Technologies | Bruno Lucildo",
    description:
      "Technologies and practices Bruno Lucildo works with, from .NET and PostgreSQL to RabbitMQ and AI, grouped by category and linked to where they were used.",
    openGraphLocale: "en_US",
    h1: "Technologies",
    intro:
      "The languages, frameworks, data stores and practices I work with, by category, with where each one was used.",
    note: '"Experience" refers to my professional work. The other names are personal, academic and conceptual projects.',
    categoryTitles: [
      "Languages",
      "Backend",
      "Databases",
      "Messaging and Caching",
      "Architecture",
      "AI and Machine Learning",
      "Frontend and Mobile",
      "Tools and Infrastructure",
    ],
    contextLabels: {
      experience: "Experience",
      football: "Football Stat Analytics",
      reelix: "Reelix",
      rondo: "Rondo",
      fintalab: "FintaLab",
    },
    contextPaths: {
      experience: "/en/experience",
      football: "/en/projects/football-stat-analytics",
      reelix: "/en/projects/reelix",
      rondo: "/en/projects/rondo",
      // O FintaLab só aparece na lista, sem página de detalhe.
      fintalab: "/en/projects",
    },
    navigation: {
      label: "Main navigation",
      footer: "Footer navigation",
      names: ["Projects", "Technologies", "AI Lab"],
      paths: ["/en/projects", "/en/technologies", "/en/ai-lab"],
    },
    alternates: {
      en: "/en/technologies",
      "pt-BR": "/pt-BR/tecnologias",
      "x-default": "/en/technologies",
    },
    otherLanguage: { name: "PT, Português", path: "/pt-BR/tecnologias" },
  },
  {
    locale: "pt-BR",
    path: "/pt-BR/tecnologias",
    title: "Tecnologias | Bruno Lucildo",
    description:
      "Tecnologias e práticas de engenharia com que Bruno Lucildo trabalha, de .NET e PostgreSQL a RabbitMQ e IA, por categoria e com onde foram usadas.",
    openGraphLocale: "pt_BR",
    h1: "Tecnologias",
    intro:
      "As linguagens, os frameworks, os bancos de dados e as práticas com que trabalho, por categoria e com onde cada um foi usado.",
    note: '"Experiência" se refere ao meu trabalho profissional. Os demais nomes são projetos pessoais, acadêmicos e conceituais.',
    categoryTitles: [
      "Linguagens",
      "Backend",
      "Bancos de dados",
      "Mensageria e cache",
      "Arquitetura",
      "IA e aprendizado de máquina",
      "Frontend e mobile",
      "Ferramentas e infraestrutura",
    ],
    contextLabels: {
      experience: "Experiência",
      football: "Football Stat Analytics",
      reelix: "Reelix",
      rondo: "Rondo",
      fintalab: "FintaLab",
    },
    contextPaths: {
      experience: "/pt-BR/experiencia",
      football: "/pt-BR/projetos/football-stat-analytics",
      reelix: "/pt-BR/projetos/reelix",
      rondo: "/pt-BR/projetos/rondo",
      fintalab: "/pt-BR/projetos",
    },
    navigation: {
      label: "Navegação principal",
      footer: "Navegação do rodapé",
      names: ["Projetos", "Tecnologias", "AI Lab"],
      paths: ["/pt-BR/projetos", "/pt-BR/tecnologias", "/pt-BR/ai-lab"],
    },
    alternates: {
      en: "/en/technologies",
      "pt-BR": "/pt-BR/tecnologias",
      "x-default": "/en/technologies",
    },
    otherLanguage: { name: "EN, English", path: "/en/technologies" },
  },
];

const viewportWidths = [360, 390, 768, 1366, 1440, 1920];
const iconDirectory = path.join(
  process.cwd(),
  "public",
  "images",
  "technologies",
);

/** Texto completo do `main`, para as buscas de conteúdo. */
async function mainText(page: import("@playwright/test").Page) {
  return (await page.getByRole("main").textContent()) ?? "";
}

/** Maior linha (em caracteres) dos parágrafos longos de abertura (TECH-RNF-02). */
async function longestLines(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const blocks = [...document.querySelectorAll("main p")].filter(
      (el) =>
        el.firstChild?.nodeType === Node.TEXT_NODE &&
        (el.firstChild.textContent ?? "").length > 90,
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
}

for (const technologies of pages) {
  test.describe(`Technologies (${technologies.locale})`, () => {
    test("tem um h1, a abertura e oito categorias na ordem prevista", async ({
      page,
    }) => {
      await page.goto(technologies.path);

      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        technologies.h1,
      );
      await expect(page.getByRole("main")).toContainText(technologies.intro);
      await expect(page.getByRole("main")).toContainText(technologies.note);
      await expect(
        page.getByRole("main").getByRole("heading", { level: 2 }),
      ).toHaveText(technologies.categoryTitles);
    });

    test("cada categoria lista as tecnologias na ordem e com o contexto previsto", async ({
      page,
    }) => {
      await page.goto(technologies.path);
      const sections = page.locator("#technologies-list > section");
      await expect(sections).toHaveCount(categories.length);

      for (const [index, category] of categories.entries()) {
        const items = sections.nth(index).locator("ul > li");
        await expect(items, category.key).toHaveCount(category.items.length);

        for (const [position, item] of category.items.entries()) {
          const entry = items.nth(position);
          const lines = (
            await entry.locator("div > span").allTextContents()
          ).map((line) => line.trim());
          const context = item.context.map(
            (key) => technologies.contextLabels[key],
          );

          expect(lines[0], category.key).toBe(item.name);
          if (context.length > 0) {
            expect(lines, item.name).toEqual([item.name, context.join(" · ")]);
          } else {
            expect(lines, item.name).toEqual([item.name]);
          }
        }
      }
    });

    test("os ícones são decorativos, têm 24 px e usam o tom secundário", async ({
      page,
    }) => {
      await page.goto(technologies.path);

      const expectedColor = await page
        .getByText(technologies.note)
        .evaluate((el) => getComputedStyle(el).color);

      for (const [index, category] of categories.entries()) {
        const items = page
          .locator("#technologies-list > section")
          .nth(index)
          .locator("ul > li");

        for (const [position, item] of category.items.entries()) {
          const entry = items.nth(position);
          const icon = entry.locator("[aria-hidden='true']");

          if (item.icon === "none") {
            await expect(icon, item.name).toHaveCount(0);
            // Sem ícone e sem espaço reservado: o texto é o primeiro filho.
            const firstTag = await entry.evaluate(
              (el) => el.firstElementChild?.tagName ?? "",
            );
            expect(firstTag, item.name).toBe("DIV");
            continue;
          }

          await expect(icon, item.name).toHaveCount(1);
          const box = await icon.boundingBox();
          expect(Math.round(box?.width ?? 0), item.name).toBe(24);
          expect(Math.round(box?.height ?? 0), item.name).toBe(24);

          if ("brand" in item.icon) {
            await expect(icon, item.name).toHaveAttribute("data-icon", "brand");
            const style = await icon.evaluate((el) => ({
              mask:
                getComputedStyle(el).maskImage ||
                getComputedStyle(el).webkitMaskImage,
              background: getComputedStyle(el).backgroundColor,
            }));
            expect(style.mask, item.name).toContain(
              `/images/technologies/${item.icon.brand}.svg`,
            );
            expect(style.background, item.name).toBe(expectedColor);
          } else {
            await expect(icon, item.name).toHaveAttribute(
              "data-icon",
              "monogram",
            );
            await expect(icon, item.name).toHaveText(item.icon.monogram);
            const color = await icon.evaluate(
              (el) => getComputedStyle(el).color,
            );
            expect(color, item.name).toBe(expectedColor);
          }
        }
      }
    });

    test("não há níveis, percentuais, empresa, curso nem frases de busca de emprego", async ({
      page,
    }) => {
      await page.goto(technologies.path);
      const text = `${await mainText(page)}\n${await page.title()}`;

      expect(text).not.toContain("%");
      expect(
        findPhrases(text, [
          "expert",
          "advanced",
          "avançado",
          "proficien",
          "years of",
          "anos de",
        ]),
      ).toEqual([]);
      expect(findPhrases(text, companyNames)).toEqual([]);
      expect(findPhrases(text, ["Coders", "University"])).toEqual([]);
      expect(findPhrases(text, forbiddenPhrases)).toEqual([]);
      expect(findPhrases(text, jobSeekingPhrases)).toEqual([]);
      await expect(
        page.locator('main [role="progressbar"], main progress, main meter'),
      ).toHaveCount(0);
    });

    test("define metadados indexáveis para o idioma", async ({ page }) => {
      await page.goto(technologies.path);

      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        technologies.locale,
      );
      await expect(page).toHaveTitle(technologies.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        technologies.description,
      );
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        technologies.openGraphLocale,
      );
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(new URL(canonical ?? "").pathname).toBe(technologies.path);

      for (const [hreflang, target] of Object.entries(
        technologies.alternates,
      )) {
        const href = await page
          .locator(`link[rel="alternate"][hreflang="${hreflang}"]`)
          .getAttribute("href");
        expect(new URL(href ?? "").pathname, `hreflang ${hreflang}`).toBe(
          target,
        );
      }
    });

    test("o menu e o rodapé mostram Technologies entre Projects e AI Lab", async ({
      page,
    }) => {
      await page.goto(technologies.path);

      for (const label of [
        technologies.navigation.label,
        technologies.navigation.footer,
      ]) {
        const links = page
          .getByRole("navigation", { name: label })
          .getByRole("link");
        const names = await links.allTextContents();
        const hrefs = await links.evaluateAll((els) =>
          els.map((el) => el.getAttribute("href") ?? ""),
        );
        const start = names.indexOf(technologies.navigation.names[0] ?? "");

        expect(start, label).toBeGreaterThan(-1);
        expect(names.slice(start, start + 3), label).toEqual(
          technologies.navigation.names,
        );
        expect(hrefs.slice(start, start + 3), label).toEqual(
          technologies.navigation.paths,
        );
      }

      const current = page
        .getByRole("navigation", { name: technologies.navigation.label })
        .getByRole("link", { name: technologies.h1 });
      await expect(current).toHaveAttribute("aria-current", "page");
    });

    test("a troca de idioma abre a página equivalente", async ({ page }) => {
      await page.goto(technologies.path);
      await page
        .getByRole("link", {
          name: technologies.otherLanguage.name,
          exact: true,
        })
        .click();
      await expect(page).toHaveURL(
        new RegExp(`${technologies.otherLanguage.path}/?$`),
      );
    });

    test("os títulos não pulam níveis", async ({ page }) => {
      await page.goto(technologies.path);
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

    for (const width of viewportWidths) {
      test(`não rola na horizontal com ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(technologies.path);

        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }

    test("o texto de abertura tem no máximo 80 caracteres por linha", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1366, height: 900 });
      await page.goto(technologies.path);
      const lines = await longestLines(page);

      expect(lines.length).toBeGreaterThanOrEqual(2);
      for (const { width, longestLine } of lines) {
        expect(width).toBeLessThanOrEqual(760);
        expect(longestLine).toBeLessThanOrEqual(80);
      }
    });

    test("cada item de contexto é um link: Experience leva a Experience, e cada projeto ao detalhe ou à lista", async ({
      page,
    }) => {
      await page.goto(technologies.path);
      const sections = page.locator("#technologies-list > section");

      for (const [index, category] of categories.entries()) {
        const items = sections.nth(index).locator("ul > li");

        for (const [position, item] of category.items.entries()) {
          const links = items.nth(position).locator("div > span a");
          const expected = item.context;

          await expect(links, item.name).toHaveCount(expected.length);
          await expect(links, item.name).toHaveText(
            expected.map((key) => technologies.contextLabels[key]),
          );
          const hrefs = await links.evaluateAll((els) =>
            els.map((el) => el.getAttribute("href")),
          );
          expect(hrefs, item.name).toEqual(
            expected.map((key) => technologies.contextPaths[key]),
          );
        }
      }
    });

    test("a lista só tem links de contexto (um por item de contexto) e nenhum botão", async ({
      page,
    }) => {
      await page.goto(technologies.path);
      const total = categories
        .flatMap((category) => category.items)
        .reduce((sum, item) => sum + item.context.length, 0);

      await expect(page.locator("#technologies-list a")).toHaveCount(total);
      await expect(page.locator("#technologies-list button")).toHaveCount(0);
    });

    test("os links de contexto têm foco visível e levam à página certa", async ({
      page,
    }) => {
      await page.goto(technologies.path);
      const links = page.locator("#technologies-list a");

      for (const link of (await links.all()).slice(0, 6)) {
        await link.focus();
        const outline = await link.evaluate(
          (element) => getComputedStyle(element).outlineStyle,
        );
        expect(outline, (await link.textContent()) ?? "").not.toBe("none");
      }

      await page
        .locator("#technologies-list a", {
          hasText: technologies.contextLabels.reelix,
        })
        .first()
        .click();
      await expect(page).toHaveURL(
        new RegExp(`${technologies.contextPaths.reelix}/?$`),
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        technologies.contextLabels.reelix,
      );
    });
  });
}

test.describe("Technologies (arquivos de ícone e licenças)", () => {
  const brandFiles = categories.flatMap((category) =>
    category.items.flatMap((item) =>
      typeof item.icon === "object" && "brand" in item.icon
        ? [`${item.icon.brand}.svg`]
        : [],
    ),
  );

  test("todo ícone de marca existe, é leve e não tem script", () => {
    expect(brandFiles).toHaveLength(17);

    for (const file of brandFiles) {
      const full = path.join(iconDirectory, file);
      expect(existsSync(full), file).toBe(true);
      expect(statSync(full).size, file).toBeLessThanOrEqual(12 * 1024);
    }
  });

  test("a licença MIT do devicon e o registro das origens estão versionados", () => {
    expect(existsSync(path.join(iconDirectory, "LICENSE-devicon.txt"))).toBe(
      true,
    );
    expect(existsSync(path.join(iconDirectory, "LICENSES.md"))).toBe(true);
  });

  test("os ícones são servidos como SVG", async ({ request }) => {
    for (const file of brandFiles) {
      const response = await request.get(`/images/technologies/${file}`);
      expect(response.status(), file).toBe(200);
      expect(response.headers()["content-type"], file).toContain("image/svg");
    }
  });
});

test.describe("Technologies (consistência com Experience e Projects)", () => {
  const byName = new Map(
    technologyCategories.flatMap((category) =>
      category.technologies.map((technology) => [technology.name, technology]),
    ),
  );

  /** Aplica os nomes unificados da seção 7.1 da SPEC-005. */
  const normalize = (name: string): readonly string[] =>
    technologyAliases[name] ?? [name];

  /** Itens que o currículo cita fora dos cargos de `experience.ts`. */
  const resumeOnly = [
    "REST APIs",
    "Microservices",
    "Event-Driven Architecture",
  ];

  /** Itens que os textos dos projetos citam, mas `projects.ts` não lista. */
  const documentedInProjectTexts: Record<string, string[]> = {
    "REST APIs": ["reelix"],
    "Automated testing": ["football"],
  };

  test("toda tecnologia de Experience existe em Technologies com o contexto Experience", () => {
    for (const role of experienceRoles) {
      for (const name of role.technologies.flatMap(normalize)) {
        const technology = byName.get(name);
        expect(technology, `${role.key}: ${name}`).toBeDefined();
        expect(technology?.experience, `${role.key}: ${name}`).toBe(true);
      }
    }
  });

  test("toda tecnologia de Projects existe em Technologies com o projeto no contexto", () => {
    for (const project of projects) {
      for (const name of project.technologies.flatMap(normalize)) {
        const technology = byName.get(name);
        expect(technology, `${project.key}: ${name}`).toBeDefined();
        expect(technology?.projects, `${project.key}: ${name}`).toContain(
          project.key,
        );
      }
    }
  });

  test("todo contexto de Technologies tem origem em Experience, em Projects ou no currículo", () => {
    const experienceNames = new Set(
      experienceRoles.flatMap((role) => role.technologies.flatMap(normalize)),
    );
    const projectNames = (key: string) =>
      new Set(
        projects
          .filter((project) => project.key === key)
          .flatMap((project) => project.technologies.flatMap(normalize)),
      );

    for (const technology of byName.values()) {
      if (technology.experience) {
        expect(
          experienceNames.has(technology.name) ||
            resumeOnly.includes(technology.name),
          `Experience: ${technology.name}`,
        ).toBe(true);
      }

      for (const key of technology.projects) {
        expect(
          projectNames(key).has(technology.name) ||
            documentedInProjectTexts[technology.name]?.includes(key),
          `${key}: ${technology.name}`,
        ).toBe(true);
      }
    }
  });

  test("os nomes não se repetem e as categorias seguem a ordem da SPEC", () => {
    const names = technologyCategories.flatMap((category) =>
      category.technologies.map((technology) => technology.name),
    );
    expect(new Set(names).size).toBe(names.length);
    expect(technologyCategories.map((category) => category.key)).toEqual(
      categories.map((category) => category.key),
    );
  });

  test("Football Stat Analytics e FintaLab nunca contam como experiência", () => {
    const projectOnly = new Set(["TypeScript", "SQLite", "OpenAI API", "RAG"]);
    for (const name of projectOnly) {
      expect(byName.get(name)?.experience, name).toBe(false);
    }
  });
});
