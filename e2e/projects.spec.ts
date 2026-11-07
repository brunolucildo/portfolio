import { statSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import {
  findPhrases,
  forbiddenPhrases,
  jobSeekingPhrases,
} from "./support/content-rules";

type ProjectExpectation = {
  name: string;
  category: string;
  status: string;
  description: string;
  technologies: string[];
  repository: string;
  /** Rota do detalhe, ou `null` quando o projeto só aparece na lista. */
  detail: string | null;
  /** Arquivos das imagens da lista, na ordem. */
  listImages: string[];
};

type ProjectsPage = {
  locale: "en" | "pt-BR";
  path: string;
  title: string;
  description: string;
  openGraphLocale: string;
  h1: string;
  labels: { viewDetails: string; repository: string; back: string };
  alternates: Record<string, string>;
  otherLanguage: { name: string; path: string };
  projects: ProjectExpectation[];
  captions: { reelix: string; fintalab: string };
  sectionTitles: string[];
  detailTitles: { football: string; reelix: string };
  detailDescriptions: { football: string; reelix: string };
};

const repositories = {
  football: "https://github.com/brunolucildo/football-stat-analytics-cli",
  reelix: "https://github.com/brunolucildo/reelix",
  fintalab: "https://github.com/brunolucildo/fintalab",
};

const technologies = {
  football: ["TypeScript", "Node.js", "OpenAI API", "SQLite", "RAG"],
  reelix: [
    "React Native",
    "Expo",
    "TypeScript",
    "ASP.NET Core (.NET 10)",
    "PostgreSQL",
    "Entity Framework Core",
    "Supabase Auth",
    "TMDB",
  ],
  fintalab: ["TypeScript", "OpenAI API", "SQLite"],
};

const fintalabImages = (locale: string) =>
  ["landing", "evaluation", "roster"].map(
    (screen) => `/images/projects/fintalab-${screen}.${locale}.png`,
  );

const pages: ProjectsPage[] = [
  {
    locale: "en",
    path: "/en/projects",
    title: "Projects | Bruno Lucildo",
    description:
      "Academic, personal and conceptual projects by Bruno Lucildo, each with its current state: AI-assisted football analysis, a movie and series tracking app and a performance-feedback product concept.",
    openGraphLocale: "en_US",
    h1: "Projects",
    labels: {
      viewDetails: "View details",
      repository: "View on GitHub",
      back: "Back to projects",
    },
    alternates: {
      en: "/en/projects",
      "pt-BR": "/pt-BR/projetos",
      "x-default": "/en/projects",
    },
    otherLanguage: { name: "Português", path: "/pt-BR/projetos" },
    projects: [
      {
        name: "Football Stat Analytics",
        category: "Academic project",
        status: "In development",
        description:
          "Analysis of football athlete performance using AI, conversational interaction and information retrieval.",
        technologies: technologies.football,
        repository: repositories.football,
        detail: "/en/projects/football-stat-analytics",
        listImages: [],
      },
      {
        name: "Reelix",
        category: "Personal project",
        status: "In development",
        description:
          "An app to discover and track movies and series, record what you have watched and share authorized activity with friends.",
        technologies: technologies.reelix,
        repository: repositories.reelix,
        detail: "/en/projects/reelix",
        listImages: ["/images/projects/reelix-home.jpg"],
      },
      {
        name: "FintaLab",
        category: "Product concept",
        status: "Conceptual",
        description:
          "A planned platform that turns match observations into evidence-grounded performance feedback for players, agencies and clubs. It is at the planning stage: the repository holds product planning, a static wireframe and an experimental chatbot, and FintaLab is a working name.",
        technologies: technologies.fintalab,
        repository: repositories.fintalab,
        detail: null,
        listImages: fintalabImages("en"),
      },
    ],
    captions: {
      reelix:
        "Screens from the development build. The app interface is in Portuguese. Movie and series data and images from TMDB; this product is not endorsed or certified by TMDB.",
      fintalab:
        "Screens from the static concept prototype. All people, clubs and numbers are fictional.",
    },
    sectionTitles: [
      "Overview",
      "Challenge",
      "Solution",
      "Architecture",
      "Technical decisions",
      "Current state",
      "Links",
    ],
    detailTitles: {
      football: "Football Stat Analytics | Bruno Lucildo",
      reelix: "Reelix | Bruno Lucildo",
    },
    detailDescriptions: {
      football:
        "An academic project that analyzes football athlete performance with AI, retrieval and layered answer verification: architecture, technical decisions and current state.",
      reelix:
        "A personal movie and series tracking app with privacy-first sharing and spoiler control: architecture, technical decisions and current state.",
    },
  },
  {
    locale: "pt-BR",
    path: "/pt-BR/projetos",
    title: "Projetos | Bruno Lucildo",
    description:
      "Projetos acadêmicos, pessoais e conceituais de Bruno Lucildo, cada um com seu estado atual: análise de futebol com IA, um aplicativo de acompanhamento de filmes e séries e um conceito de produto de retorno de desempenho.",
    openGraphLocale: "pt_BR",
    h1: "Projetos",
    labels: {
      viewDetails: "Ver detalhes",
      repository: "Ver no GitHub",
      back: "Voltar para projetos",
    },
    alternates: {
      en: "/en/projects",
      "pt-BR": "/pt-BR/projetos",
      "x-default": "/en/projects",
    },
    otherLanguage: { name: "English", path: "/en/projects" },
    projects: [
      {
        name: "Football Stat Analytics",
        category: "Projeto acadêmico",
        status: "Em desenvolvimento",
        description:
          "Análise de desempenho de atletas de futebol com IA, interação conversacional e recuperação de informações.",
        technologies: technologies.football,
        repository: repositories.football,
        detail: "/pt-BR/projetos/football-stat-analytics",
        listImages: [],
      },
      {
        name: "Reelix",
        category: "Projeto pessoal",
        status: "Em desenvolvimento",
        description:
          "Aplicativo para descobrir e acompanhar filmes e séries, registrar o que você assistiu e compartilhar atividades autorizadas com amigos.",
        technologies: technologies.reelix,
        repository: repositories.reelix,
        detail: "/pt-BR/projetos/reelix",
        listImages: ["/images/projects/reelix-home.jpg"],
      },
      {
        name: "FintaLab",
        category: "Conceito de produto",
        status: "Conceitual",
        description:
          "Uma plataforma planejada que transforma observações de partidas em retorno de desempenho fundamentado em evidências para jogadores, agências e clubes. Está em fase de planejamento: o repositório reúne o planejamento do produto, um wireframe estático e um chatbot experimental, e FintaLab é um nome de trabalho.",
        technologies: technologies.fintalab,
        repository: repositories.fintalab,
        detail: null,
        listImages: fintalabImages("pt-BR"),
      },
    ],
    captions: {
      reelix:
        "Telas da versão de desenvolvimento. A interface do app está em português. Dados e imagens de filmes e séries do TMDB; este produto não é endossado nem certificado pelo TMDB.",
      fintalab:
        "Telas do protótipo conceitual estático. Todas as pessoas, clubes e números são fictícios.",
    },
    sectionTitles: [
      "Visão geral",
      "Desafio",
      "Solução",
      "Arquitetura",
      "Decisões técnicas",
      "Estado atual",
      "Links",
    ],
    detailTitles: {
      football: "Football Stat Analytics | Bruno Lucildo",
      reelix: "Reelix | Bruno Lucildo",
    },
    detailDescriptions: {
      football:
        "Um projeto acadêmico que analisa o desempenho de atletas de futebol com IA, recuperação de informações e verificação de respostas em camadas: arquitetura, decisões técnicas e estado atual.",
      reelix:
        "Um aplicativo pessoal de acompanhamento de filmes e séries, com compartilhamento que prioriza a privacidade e controle de spoilers: arquitetura, decisões técnicas e estado atual.",
    },
  },
];

const viewportWidths = [360, 390, 768, 1366, 1440, 1920];
const maxImageBytes = 250 * 1024;

/** Texto completo do `main` (sem imagens), para as buscas de conteúdo. */
async function mainText(page: import("@playwright/test").Page) {
  return (await page.getByRole("main").textContent()) ?? "";
}

for (const projects of pages) {
  test.describe(`Projects (${projects.locale})`, () => {
    test("a lista tem um h1 e três projetos na ordem prevista", async ({
      page,
    }) => {
      await page.goto(projects.path);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        projects.h1,
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(
        page.getByRole("main").getByRole("heading", { level: 2 }),
      ).toHaveText(projects.projects.map((project) => project.name));
    });

    test("cada entrada mostra categoria, estado, descrição, tecnologias e links", async ({
      page,
    }) => {
      await page.goto(projects.path);
      const entries = page.locator("#projects-list > li");
      await expect(entries).toHaveCount(3);

      for (const [index, project] of projects.projects.entries()) {
        const entry = entries.nth(index);
        await expect(entry).toContainText(project.category);
        await expect(entry).toContainText(project.status);
        await expect(entry).toContainText(project.description);

        const items = entry.getByRole("list", {
          name: projects.locale === "en" ? "Technologies" : "Tecnologias",
        });
        expect(await items.locator("li").allTextContents()).toEqual(
          project.technologies,
        );

        const details = entry.getByRole("link", {
          name: projects.labels.viewDetails,
        });
        if (project.detail) {
          await expect(details).toHaveCount(1);
          await expect(details).toHaveAttribute("href", project.detail);
        } else {
          await expect(details).toHaveCount(0);
        }

        const repository = entry.getByRole("link", {
          name: projects.labels.repository,
        });
        await expect(repository).toHaveAttribute("href", project.repository);
        await expect(repository).toHaveAttribute("target", "_blank");
        await expect(repository).toHaveAttribute("rel", /noopener/);
      }
    });

    test("os estados são os aprovados e nenhum projeto aparece como lançado", async ({
      page,
    }) => {
      await page.goto(projects.path);
      const text = await mainText(page);

      expect(
        findPhrases(text, [
          "launched",
          "available now",
          "lançado",
          "disponível",
        ]),
      ).toEqual([]);
    });

    test("as imagens da lista são as aprovadas, com texto alternativo e legenda", async ({
      page,
    }) => {
      await page.goto(projects.path);
      const entries = page.locator("#projects-list > li");

      for (const [index, project] of projects.projects.entries()) {
        const images = entries.nth(index).locator("img");
        await expect(images).toHaveCount(project.listImages.length);

        const sources = await images.evaluateAll((els) =>
          els.map((el) => {
            const src = el.getAttribute("src") ?? "";
            const url = new URL(src, "http://localhost");
            return url.searchParams.get("url") ?? url.pathname;
          }),
        );
        expect(sources).toEqual(project.listImages);

        for (const image of await images.all()) {
          expect(
            ((await image.getAttribute("alt")) ?? "").length,
          ).toBeGreaterThan(40);
          expect(await image.getAttribute("width")).not.toBeNull();
          expect(await image.getAttribute("height")).not.toBeNull();
        }
      }

      await expect(entries.nth(0).locator("figure")).toHaveCount(0);
      await expect(entries.nth(1).locator("figcaption")).toHaveText(
        projects.captions.reelix,
      );
      await expect(entries.nth(2).locator("figcaption")).toHaveText(
        projects.captions.fintalab,
      );
    });

    test("os arquivos de imagem existem e têm até 250 KB", () => {
      const files = [
        "reelix-home.jpg",
        "reelix-stats.png",
        "reelix-login.png",
        ...["landing", "evaluation", "roster"].map(
          (screen) => `fintalab-${screen}.${projects.locale}.png`,
        ),
      ];

      for (const file of files) {
        const size = statSync(
          path.join(process.cwd(), "public", "images", "projects", file),
        ).size;
        expect(size, file).toBeLessThanOrEqual(maxImageBytes);
      }
    });

    test("não há percentuais nem citação ao curso ou à instituição", async ({
      page,
    }) => {
      for (const target of [
        projects.path,
        projects.projects[0]?.detail ?? "",
        projects.projects[1]?.detail ?? "",
      ]) {
        await page.goto(target);
        const text = await mainText(page);
        expect(text, target).not.toContain("%");
        expect(findPhrases(text, ["Coders", "University"]), target).toEqual([]);
      }
    });

    test("não usa expressões proibidas nem mensagens de disponibilidade", async ({
      page,
    }) => {
      for (const target of [
        projects.path,
        projects.projects[0]?.detail ?? "",
        projects.projects[1]?.detail ?? "",
      ]) {
        await page.goto(target);
        const text = `${await mainText(page)}\n${await page.title()}`;
        expect(findPhrases(text, forbiddenPhrases), target).toEqual([]);
        expect(findPhrases(text, jobSeekingPhrases), target).toEqual([]);
      }
    });

    test("define metadados indexáveis para o idioma", async ({ page }) => {
      await page.goto(projects.path);

      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        projects.locale,
      );
      await expect(page).toHaveTitle(projects.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        projects.description,
      );
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        projects.openGraphLocale,
      );
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(new URL(canonical ?? "").pathname).toBe(projects.path);

      for (const [hreflang, target] of Object.entries(projects.alternates)) {
        const href = await page
          .locator(`link[rel="alternate"][hreflang="${hreflang}"]`)
          .getAttribute("href");
        expect(new URL(href ?? "").pathname, `hreflang ${hreflang}`).toBe(
          target,
        );
      }
    });

    test("a troca de idioma abre a página equivalente", async ({ page }) => {
      await page.goto(projects.path);
      await page
        .getByRole("link", { name: projects.otherLanguage.name, exact: true })
        .click();
      await expect(page).toHaveURL(
        new RegExp(`${projects.otherLanguage.path}/?$`),
      );
    });

    test("o teclado percorre as entradas na ordem visual", async ({ page }) => {
      await page.goto(projects.path);

      const hrefs: string[] = [];
      for (let i = 0; i < 50; i++) {
        await page.keyboard.press("Tab");
        const href = await page.evaluate(
          () => document.activeElement?.getAttribute("href") ?? "",
        );
        hrefs.push(href);
        if (href.startsWith("mailto:")) break;
      }

      const [football, reelix, fintalab] = projects.projects;
      const order = [
        hrefs.indexOf(football?.detail ?? ""),
        hrefs.indexOf(football?.repository ?? ""),
        hrefs.indexOf(reelix?.detail ?? ""),
        hrefs.indexOf(reelix?.repository ?? ""),
        hrefs.indexOf(fintalab?.repository ?? ""),
        hrefs.findIndex((href) => href.startsWith("mailto:")),
      ];

      expect(hrefs[0]).toBe("#main");
      expect(order.every((position) => position > 0)).toBe(true);
      expect([...order].sort((a, b) => a - b)).toEqual(order);
    });

    test("os links têm alvo de toque de pelo menos 44 px", async ({ page }) => {
      await page.goto(projects.path);
      for (const link of await page.getByRole("main").getByRole("link").all()) {
        const box = await link.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }
    });

    test("a Home usa os mesmos textos da lista", async ({ page }) => {
      const home = projects.locale === "en" ? "/en" : "/pt-BR";
      await page.goto(home);
      const cards = page.locator("#featured-projects li");
      await expect(cards).toHaveCount(3);

      for (const [index, project] of projects.projects.entries()) {
        const card = cards.nth(index);
        await expect(card.getByRole("heading", { level: 3 })).toHaveText(
          project.name,
        );
        await expect(card).toContainText(project.category);
        await expect(card).toContainText(project.status);
        await expect(card).toContainText(project.description);
      }
    });

    for (const width of viewportWidths) {
      test(`a lista não rola na horizontal com ${width} px`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(projects.path);

        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }

    test("o texto corrido da lista tem no máximo 80 caracteres por linha", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1366, height: 900 });
      await page.goto(projects.path);
      expect((await longestLines(page)).length).toBeGreaterThanOrEqual(3);
      for (const { width, longestLine } of await longestLines(page)) {
        expect(width).toBeLessThanOrEqual(760);
        expect(longestLine).toBeLessThanOrEqual(80);
      }
    });
  });

  for (const key of ["football", "reelix"] as const) {
    const index = key === "football" ? 0 : 1;
    const project = projects.projects[index];
    const detailPath = project?.detail ?? "";

    test.describe(`Projects (${projects.locale}): detalhe ${key}`, () => {
      test("tem um h1 e as sete seções na ordem prevista, sem Results", async ({
        page,
      }) => {
        const response = await page.goto(detailPath);
        expect(response?.status()).toBe(200);

        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          project?.name ?? "",
        );
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        await expect(
          page.getByRole("main").getByRole("heading", { level: 2 }),
        ).toHaveText(projects.sectionTitles);
        expect(
          findPhrases(await mainText(page), ["Results", "Resultados"]),
        ).toEqual([]);
      });

      test("mostra categoria, estado, descrição, tecnologias e link para o GitHub", async ({
        page,
      }) => {
        await page.goto(detailPath);
        const main = page.getByRole("main");

        await expect(main).toContainText(project?.category ?? "");
        await expect(main).toContainText(project?.status ?? "");
        await expect(main).toContainText(project?.description ?? "");

        const items = main.getByRole("list", {
          name: projects.locale === "en" ? "Technologies" : "Tecnologias",
        });
        expect(await items.locator("li").allTextContents()).toEqual(
          project?.technologies,
        );

        const links = main.getByRole("link", {
          name: projects.labels.repository,
        });
        await expect(links).toHaveCount(2);
        for (const link of await links.all()) {
          await expect(link).toHaveAttribute("href", project?.repository ?? "");
          await expect(link).toHaveAttribute("target", "_blank");
          await expect(link).toHaveAttribute("rel", /noopener/);
        }
      });

      test("lista quatro decisões técnicas, cada uma com decisão e razão", async ({
        page,
      }) => {
        await page.goto(detailPath);
        const decisions = page.locator("#decisions li");

        await expect(decisions).toHaveCount(4);
        for (const decision of await decisions.all()) {
          await expect(decision.locator("p")).toHaveCount(2);
        }
      });

      test("as imagens do detalhe são as aprovadas", async ({ page }) => {
        await page.goto(detailPath);
        const images = page.getByRole("main").locator("img");

        if (key === "football") {
          await expect(images).toHaveCount(0);
          return;
        }

        await expect(images).toHaveCount(3);
        const sources = await images.evaluateAll((els) =>
          els.map((el) => {
            const url = new URL(
              el.getAttribute("src") ?? "",
              "http://localhost",
            );
            return url.searchParams.get("url") ?? url.pathname;
          }),
        );
        expect(sources).toEqual([
          "/images/projects/reelix-home.jpg",
          "/images/projects/reelix-stats.png",
          "/images/projects/reelix-login.png",
        ]);
        await expect(page.locator("main figcaption")).toHaveText(
          projects.captions.reelix,
        );
      });

      test("define metadados indexáveis, com a rota equivalente no outro idioma", async ({
        page,
      }) => {
        await page.goto(detailPath);

        await expect(page).toHaveTitle(projects.detailTitles[key]);
        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
          "content",
          projects.detailDescriptions[key],
        );
        await expect(page.locator('meta[name="robots"]')).toHaveCount(0);

        const slug = detailPath.split("/").pop();
        const expected = {
          en: `/en/projects/${slug}`,
          "pt-BR": `/pt-BR/projetos/${slug}`,
          "x-default": `/en/projects/${slug}`,
        };
        for (const [hreflang, target] of Object.entries(expected)) {
          const href = await page
            .locator(`link[rel="alternate"][hreflang="${hreflang}"]`)
            .getAttribute("href");
          expect(new URL(href ?? "").pathname, `hreflang ${hreflang}`).toBe(
            target,
          );
        }
        const canonical = await page
          .locator('link[rel="canonical"]')
          .getAttribute("href");
        expect(new URL(canonical ?? "").pathname).toBe(detailPath);
      });

      test("a troca de idioma mantém o projeto", async ({ page }) => {
        await page.goto(detailPath);
        const target = projects.otherLanguage.path.replace(
          /\/(projects|projetos)$/,
          `/${projects.locale === "en" ? "projetos" : "projects"}/${detailPath.split("/").pop()}`,
        );
        await page
          .getByRole("link", { name: projects.otherLanguage.name, exact: true })
          .click();
        await expect(page).toHaveURL(new RegExp(`${target}/?$`));
      });

      test("o link de voltar leva à lista", async ({ page }) => {
        await page.goto(detailPath);
        await page.getByRole("link", { name: projects.labels.back }).click();
        await expect(page).toHaveURL(new RegExp(`${projects.path}/?$`));
      });

      test("os títulos não pulam níveis", async ({ page }) => {
        await page.goto(detailPath);
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
          await page.goto(detailPath);

          const overflow = await page.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth,
          );
          expect(overflow).toBeLessThanOrEqual(0);
        });
      }

      test("o texto corrido tem no máximo 80 caracteres por linha", async ({
        page,
      }) => {
        await page.setViewportSize({ width: 1366, height: 900 });
        await page.goto(detailPath);
        const lines = await longestLines(page);

        expect(lines.length).toBeGreaterThanOrEqual(6);
        for (const { width, longestLine } of lines) {
          expect(width).toBeLessThanOrEqual(760);
          expect(longestLine).toBeLessThanOrEqual(80);
        }
      });
    });
  }
}

// As telas ficam lado a lado a partir de 768 px (breakpoint `md` do projeto) e
// empilhadas abaixo disso. O design system não tem o breakpoint `sm`.
for (const target of [
  {
    name: "detalhe do Reelix",
    path: "/en/projects/reelix",
    selector: "main figure img",
  },
  {
    name: "entrada do FintaLab na lista",
    path: "/en/projects",
    selector: "#projects-list > li:nth-child(3) img",
  },
]) {
  test(`as imagens ficam lado a lado em 1440 px e empilhadas em 390 px: ${target.name}`, async ({
    page,
  }) => {
    const tops = async () =>
      page
        .locator(target.selector)
        .evaluateAll((els) =>
          els.map((el) =>
            Math.round(el.getBoundingClientRect().top + window.scrollY),
          ),
        );

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(target.path);
    const wide = await tops();
    expect(wide).toHaveLength(3);
    expect(new Set(wide).size).toBe(1);

    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(target.path);
    const narrow = await tops();
    expect(narrow).toHaveLength(3);
    expect(new Set(narrow).size).toBe(3);
  });
}

test("o Football inclui o número de testes, único número de qualidade", async ({
  page,
}) => {
  await page.goto("/en/projects/football-stat-analytics");
  const text = await mainText(page);

  expect(text).toContain("109 automated tests");
  expect(text.match(/\d+\s?%/g)).toBeNull();
});

for (const target of [
  "/en/projects/nao-existe",
  "/pt-BR/projetos/nao-existe",
  "/en/projects/fintalab",
]) {
  test(`um slug sem detalhe responde 404: ${target}`, async ({ page }) => {
    const response = await page.goto(target);
    expect(response?.status()).toBe(404);
  });
}

/**
 * Mede, em cada parágrafo longo, a largura do elemento e o maior número de
 * caracteres em uma linha (PROJ-RNF-05). Só considera nós de texto no início.
 */
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
