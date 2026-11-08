import { expect, test } from "@playwright/test";
import { aiLabExperiments } from "../src/config/aiLab";
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

type Slug =
  | "rag-grounding"
  | "output-validation"
  | "score-consistency"
  | "analyst-personas";

type Origin = "football" | "fintalab";

/** Dados que não mudam com o idioma (SPEC-006, seção 7.1). */
const shared = {
  "rag-grounding": {
    model: "gpt-4o-mini, OpenAI embeddings",
    technologies: ["TypeScript", "Node.js", "OpenAI API", "SQLite", "RAG"],
    origin: "football" as Origin,
  },
  "output-validation": {
    model: "gpt-4o-mini",
    technologies: ["TypeScript", "Node.js", "OpenAI API", "SQLite"],
    origin: "football" as Origin,
  },
  "score-consistency": {
    model: "gpt-4o-mini",
    technologies: ["TypeScript", "Node.js", "OpenAI API"],
    origin: "football" as Origin,
  },
  "analyst-personas": {
    model: "gpt-4o-mini",
    technologies: ["TypeScript", "OpenAI API", "SQLite"],
    origin: "fintalab" as Origin,
  },
} satisfies Record<
  Slug,
  { model: string; technologies: string[]; origin: Origin }
>;

const slugs = Object.keys(shared) as Slug[];

const repositories: Record<Origin, string> = {
  football: "https://github.com/brunolucildo/football-stat-analytics-cli",
  fintalab: "https://github.com/brunolucildo/fintalab",
};

type ExperimentText = {
  name: string;
  summary: string;
  type: string;
  state: string;
  /** Início do texto de Objetivo e de Limitações, como aprovados. */
  objectiveStart: string;
  limitationsStart: string;
  /** Trechos que o texto de Resultados precisa conter (contagens e ressalvas). */
  resultsContain: string[];
};

type AiLabPage = {
  locale: "en" | "pt-BR";
  path: string;
  detailPath: (slug: string) => string;
  title: string;
  description: string;
  openGraphLocale: string;
  h1: string;
  intro: string;
  labels: {
    objective: string;
    problem: string;
    approach: string;
    results: string;
    limitations: string;
    learned: string;
    model: string;
    partOf: string;
    repository: string;
    back: string;
  };
  alternates: Record<string, string>;
  otherLanguage: { name: string; path: string };
  otherDetailPath: (slug: string) => string;
  origins: Record<Origin, { name: string; path: string }>;
  experiments: Record<Slug, ExperimentText>;
  planning: {
    name: string;
    summary: string;
    type: string;
    state: string;
  };
  placeholder: string;
  notCompleted: string;
};

const pages: AiLabPage[] = [
  {
    locale: "en",
    path: "/en/ai-lab",
    detailPath: (slug) => `/en/ai-lab/${slug}`,
    title: "AI Lab | Bruno Lucildo",
    description:
      "Experiments in applied AI: retrieval-augmented answers, output validation with a judge model, consistency tests and prompt design, with results and limitations.",
    openGraphLocale: "en_US",
    h1: "AI Lab",
    intro:
      "I'm studying AI systems development and management, and I use study projects to explore language models. Each experiment states what I wanted to find out, how I approached it, what I measured and where it falls short. They are learning projects, not products.",
    labels: {
      objective: "Objective",
      problem: "Problem investigated",
      approach: "Approach",
      results: "Results",
      limitations: "Limitations",
      learned: "What I learned",
      model: "Model",
      partOf: "Part of",
      repository: "Repository",
      back: "All experiments",
    },
    alternates: {
      en: "/en/ai-lab",
      "pt-BR": "/pt-BR/ai-lab",
      "x-default": "/en/ai-lab",
    },
    otherLanguage: { name: "Português", path: "/pt-BR/ai-lab" },
    otherDetailPath: (slug) => `/pt-BR/ai-lab/${slug}`,
    origins: {
      football: {
        name: "Football Stat Analytics",
        path: "/en/projects/football-stat-analytics",
      },
      fintalab: { name: "FintaLab", path: "/en/projects" },
    },
    experiments: {
      "rag-grounding": {
        name: "Grounded answers over reports (RAG)",
        summary:
          "Answering questions about scouting reports using only retrieved excerpts, and showing how much of each answer can be traced back to them.",
        type: "Proof of concept",
        state: "In development",
        objectiveStart:
          "Answer questions about scouting reports using only what the reports say",
        limitationsStart: "The index has no athlete metadata to filter on",
        resultsContain: [
          "Only a handful of RAG questions were tested",
          "this shows behavior, not a failure rate",
        ],
      },
      "output-validation": {
        name: "Validating model output with rules and a judge model",
        summary:
          "Checking what a language model says with rules in code and a second model that has to quote the evidence.",
        type: "Proof of concept",
        state: "In development",
        objectiveStart:
          "Keep every statement an analyst persona makes tied to the evidence",
        limitationsStart: "The rules are lexical",
        resultsContain: [
          "0 of 15 to 12 of 15",
          "14 of 15",
          "that last figure is optimistic",
          "43 of 48",
          "48 of 48",
          "22 of 24 and 24 of 24",
          "41 of 45",
          "42 of 45",
        ],
      },
      "score-consistency": {
        name: "Median of three samples for stable scores",
        summary:
          "Testing whether answering with the median of three samples makes a model's scores stable.",
        type: "Study",
        state: "Concluded",
        objectiveStart: "Find out whether any mode makes the scores",
        limitationsStart: "Six cases and two runs are a small sample",
        resultsContain: [
          "No mode made the scores reliably stable",
          "1 point to 8",
        ],
      },
      "analyst-personas": {
        name: "Analyst personas built with prompts",
        summary:
          "Designing analyst personas with prompts, conversation history and simple input and output checks.",
        type: "Study",
        state: "Concluded",
        objectiveStart: "Explore how far prompts alone can shape an assistant",
        limitationsStart: "The checks do not guarantee",
        resultsContain: ["No formal evaluation was done in this experiment"],
      },
    },
    planning: {
      name: "Analytics Personas",
      summary:
        "A platform to create and run experts: AI agents specialized in the functions of a football club, fed by connected data sources, with answers traceable to them. The technical foundation exists; product features do not.",
      type: "Study",
      state: "Planning",
    },
    placeholder: "This section is under construction.",
    notCompleted: "Completed project",
  },
  {
    locale: "pt-BR",
    path: "/pt-BR/ai-lab",
    detailPath: (slug) => `/pt-BR/ai-lab/${slug}`,
    title: "AI Lab | Bruno Lucildo",
    description:
      "Experimentos de IA aplicada: respostas com recuperação de informação, validação de saída com um modelo juiz, testes de consistência e desenho de prompts, com resultados e limitações.",
    openGraphLocale: "pt_BR",
    h1: "AI Lab",
    intro:
      "Estudo desenvolvimento e gestão de sistemas de IA e uso projetos de estudo para explorar modelos de linguagem. Cada experimento diz o que eu queria descobrir, como abordei, o que medi e onde ele falha. São projetos de aprendizado, não produtos.",
    labels: {
      objective: "Objetivo",
      problem: "Problema investigado",
      approach: "Abordagem",
      results: "Resultados",
      limitations: "Limitações",
      learned: "O que aprendi",
      model: "Modelo",
      partOf: "Parte de",
      repository: "Repositório",
      back: "Todos os experimentos",
    },
    alternates: {
      en: "/en/ai-lab",
      "pt-BR": "/pt-BR/ai-lab",
      "x-default": "/en/ai-lab",
    },
    otherLanguage: { name: "English", path: "/en/ai-lab" },
    otherDetailPath: (slug) => `/en/ai-lab/${slug}`,
    origins: {
      football: {
        name: "Football Stat Analytics",
        path: "/pt-BR/projetos/football-stat-analytics",
      },
      fintalab: { name: "FintaLab", path: "/pt-BR/projetos" },
    },
    experiments: {
      "rag-grounding": {
        name: "Respostas fundamentadas em relatórios (RAG)",
        summary:
          "Responder perguntas sobre relatórios de observação usando só os trechos recuperados, mostrando quanto de cada resposta pode ser rastreado até eles.",
        type: "Prova de conceito",
        state: "Em desenvolvimento",
        objectiveStart:
          "Responder perguntas sobre relatórios de observação usando só o que os relatórios dizem",
        limitationsStart: "O índice não tem metadados do atleta para filtrar",
        resultsContain: [
          "Só poucas perguntas de RAG foram testadas",
          "isto mostra comportamento, não uma taxa de falha",
        ],
      },
      "output-validation": {
        name: "Validação da saída do modelo com regras e um modelo juiz",
        summary:
          "Checar o que um modelo de linguagem diz com regras em código e um segundo modelo que precisa citar a evidência.",
        type: "Prova de conceito",
        state: "Em desenvolvimento",
        objectiveStart:
          "Manter cada afirmação de uma persona de analista ligada à evidência",
        limitationsStart: "As regras são lexicais",
        resultsContain: [
          "0 de 15 para 12 de 15",
          "14 de 15",
          "esse último número é otimista",
          "43 de 48",
          "48 de 48",
          "22 de 24 e 24 de 24",
          "41 de 45",
          "42 de 45",
        ],
      },
      "score-consistency": {
        name: "Mediana de três amostras para notas estáveis",
        summary:
          "Testar se responder com a mediana de três amostras torna estáveis as notas de um modelo.",
        type: "Estudo",
        state: "Concluído",
        objectiveStart: "Descobrir se algum modo torna confiáveis",
        limitationsStart: "Seis casos e duas rodadas são uma amostra pequena",
        resultsContain: [
          "Nenhum modo estabilizou as notas de forma confiável",
          "1 ponto para 8",
        ],
      },
      "analyst-personas": {
        name: "Personas de analista construídas com prompts",
        summary:
          "Desenhar personas de analista com prompts, histórico de conversa e checagens simples de entrada e saída.",
        type: "Estudo",
        state: "Concluído",
        objectiveStart:
          "Explorar até onde só os prompts conseguem moldar um assistente",
        limitationsStart: "As checagens não garantem",
        resultsContain: ["Este experimento não teve avaliação formal"],
      },
    },
    planning: {
      name: "Analytics Personas",
      summary:
        "Uma plataforma para criar e operar especialistas: agentes de IA especializados nas funções de um clube de futebol, alimentados por fontes de dados conectadas, com respostas rastreáveis até elas. A fundação técnica existe; as funcionalidades de produto, não.",
      type: "Estudo",
      state: "Em planejamento",
    },
    placeholder: "Esta seção está em construção.",
    notCompleted: "Projeto concluído",
  },
];

const viewportWidths = [360, 390, 768, 1366, 1440, 1920];

/** Nomes de atletas dos relatórios: nunca entram no site (AIL-RF-12). */
const athleteNames = [
  "Nil Coch",
  "Kevin Kelsy",
  "Kevin Velasco",
  "Segovia",
  "Bersano",
  "Hormiga",
];

/** Texto completo do `main` (sem imagens), para as buscas de conteúdo. */
async function mainText(page: import("@playwright/test").Page) {
  return (await page.getByRole("main").textContent()) ?? "";
}

for (const lab of pages) {
  const allPaths = [lab.path, ...slugs.map((slug) => lab.detailPath(slug))];

  test.describe(`AI Lab (${lab.locale})`, () => {
    test("a lista tem um h1, a abertura e cinco experimentos na ordem prevista", async ({
      page,
    }) => {
      await page.goto(lab.path);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(lab.h1);
      await expect(page.getByRole("main")).toContainText(lab.intro);

      const names = [
        ...slugs.map((slug) => lab.experiments[slug].name),
        lab.planning.name,
      ];
      const cards = page.locator("#ai-lab-list > li");
      await expect(cards).toHaveCount(5);
      await expect(cards.getByRole("heading", { level: 2 })).toHaveText(names);
    });

    test("cada card mostra tipo, estado, resumo, modelo e tecnologias", async ({
      page,
    }) => {
      await page.goto(lab.path);
      const cards = page.locator("#ai-lab-list > li");

      for (const [index, slug] of slugs.entries()) {
        const card = cards.nth(index);
        const text = lab.experiments[slug];
        const data = shared[slug];

        await expect(card, slug).toContainText(text.type);
        await expect(card, slug).toContainText(text.state);
        await expect(card, slug).toContainText(text.summary);
        await expect(card, slug).toContainText(
          `${lab.labels.model}: ${data.model}`,
        );
        await expect(card.getByRole("listitem"), slug).toHaveText(
          data.technologies,
        );
      }
    });

    test("o card em planejamento não é um link e não declara modelo nem tecnologias", async ({
      page,
    }) => {
      await page.goto(lab.path);
      const card = page.locator("#ai-lab-list > li").nth(4);

      await expect(card).toContainText(lab.planning.type);
      await expect(card).toContainText(lab.planning.state);
      await expect(card).toContainText(lab.planning.summary);
      await expect(card.getByRole("link")).toHaveCount(0);
      await expect(card.getByRole("list")).toHaveCount(0);
      await expect(card).not.toContainText(`${lab.labels.model}:`);
    });

    test("cada experimento com detalhe é um único link para a sua página", async ({
      page,
    }) => {
      await page.goto(lab.path);
      const cards = page.locator("#ai-lab-list > li");

      for (const [index, slug] of slugs.entries()) {
        const links = cards.nth(index).getByRole("link");
        await expect(links, slug).toHaveCount(1);
        await expect(links.first(), slug).toHaveAttribute(
          "href",
          lab.detailPath(slug),
        );
        await expect(links.first(), slug).toHaveText(
          lab.experiments[slug].name,
        );
      }
    });

    test("nenhum experimento aparece como projeto concluído nem a página é provisória", async ({
      page,
    }) => {
      await page.goto(lab.path);
      const text = await mainText(page);

      expect(text).not.toContain(lab.notCompleted);
      expect(text).not.toContain(lab.placeholder);
    });

    test("os links dos cards têm alvo de toque de pelo menos 44 px", async ({
      page,
    }) => {
      await page.goto(lab.path);
      for (const link of await page
        .locator("#ai-lab-list")
        .getByRole("link")
        .all()) {
        const box = await link.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }
    });

    test("o teclado percorre os cards na ordem visual, um alvo por card", async ({
      page,
    }) => {
      await page.goto(lab.path);

      const hrefs: string[] = [];
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        const href = await page.evaluate(
          () => document.activeElement?.getAttribute("href") ?? "",
        );
        hrefs.push(href);
        if (href.startsWith("mailto:")) break;
      }

      const order = slugs.map((slug) => hrefs.indexOf(lab.detailPath(slug)));
      expect(hrefs[0]).toBe("#main");
      expect(order.every((position) => position > 0)).toBe(true);
      expect([...order].sort((a, b) => a - b)).toEqual(order);
      expect(hrefs.filter((href) => href.includes("/ai-lab/")).length).toBe(
        slugs.length,
      );
    });

    test("não há percentuais, citação a curso, empresa, atletas nem expressões proibidas", async ({
      page,
    }) => {
      for (const target of allPaths) {
        await page.goto(target);
        const text = `${await mainText(page)}\n${await page.title()}`;

        expect(text, target).not.toContain("%");
        expect(findPhrases(text, ["Coders", "University"]), target).toEqual([]);
        expect(findPhrases(text, companyNames), target).toEqual([]);
        expect(findPhrases(text, athleteNames), target).toEqual([]);
        expect(findPhrases(text, forbiddenPhrases), target).toEqual([]);
        expect(findPhrases(text, jobSeekingPhrases), target).toEqual([]);
      }
    });

    test("define metadados indexáveis para o idioma", async ({ page }) => {
      await page.goto(lab.path);

      await expect(page.locator("html")).toHaveAttribute("lang", lab.locale);
      await expect(page).toHaveTitle(lab.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        lab.description,
      );
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        lab.openGraphLocale,
      );
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(new URL(canonical ?? "").pathname).toBe(lab.path);

      for (const [hreflang, target] of Object.entries(lab.alternates)) {
        const href = await page
          .locator(`link[rel="alternate"][hreflang="${hreflang}"]`)
          .getAttribute("href");
        expect(new URL(href ?? "").pathname, `hreflang ${hreflang}`).toBe(
          target,
        );
      }
    });

    test("a troca de idioma abre a página equivalente", async ({ page }) => {
      await page.goto(lab.path);
      await page
        .getByRole("link", { name: lab.otherLanguage.name, exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`${lab.otherLanguage.path}/?$`));
    });

    for (const width of viewportWidths) {
      test(`a lista não rola na horizontal com ${width} px`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(lab.path);

        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }

    test("a abertura tem no máximo 80 caracteres por linha", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1366, height: 900 });
      await page.goto(lab.path);
      const lines = await longestLines(page, "main header p");

      expect(lines.length).toBeGreaterThanOrEqual(1);
      for (const { width, longestLine } of lines) {
        expect(width).toBeLessThanOrEqual(760);
        expect(longestLine).toBeLessThanOrEqual(80);
      }
    });

    test("o elemento gráfico é decorativo e fica oculto abaixo de 1024 px", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(lab.path);
      const graphic = page.locator("main header svg");

      await expect(graphic).toHaveAttribute("aria-hidden", "true");
      await expect(graphic).toBeVisible();
      expect(await page.getByRole("main").getByRole("img").count()).toBe(0);

      await page.setViewportSize({ width: 768, height: 900 });
      await expect(graphic).toBeHidden();
    });

    for (const slug of slugs) {
      const text = lab.experiments[slug];
      const data = shared[slug];
      const detailPath = lab.detailPath(slug);
      const origin = lab.origins[data.origin];

      test.describe(`detalhe ${slug}`, () => {
        test("tem um h1, tipo, estado, resumo, modelo e tecnologias", async ({
          page,
        }) => {
          await page.goto(detailPath);
          const main = page.getByRole("main");

          await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            text.name,
          );
          await expect(main).toContainText(text.type);
          await expect(main).toContainText(text.state);
          await expect(main.locator("header")).toContainText(text.summary);
          await expect(main.locator("header")).toContainText(
            `${lab.labels.model}: ${data.model}`,
          );
          await expect(main.locator("header").getByRole("listitem")).toHaveText(
            data.technologies,
          );
        });

        test("tem as seis seções na ordem prevista", async ({ page }) => {
          await page.goto(detailPath);

          await expect(page.getByRole("heading", { level: 2 })).toHaveText([
            lab.labels.objective,
            lab.labels.problem,
            lab.labels.approach,
            lab.labels.results,
            lab.labels.limitations,
            lab.labels.learned,
          ]);
        });

        test("os textos aprovados e as ressalvas dos resultados estão presentes", async ({
          page,
        }) => {
          await page.goto(detailPath);

          await expect(page.locator("#objective")).toContainText(
            text.objectiveStart,
          );
          await expect(page.locator("#limitations")).toContainText(
            text.limitationsStart,
          );
          for (const fragment of text.resultsContain) {
            await expect(page.locator("#results"), fragment).toContainText(
              fragment,
            );
          }
        });

        test("liga ao projeto de origem e ao repositório público", async ({
          page,
        }) => {
          await page.goto(detailPath);
          const header = page.getByRole("main").locator("header");

          const originLink = header.getByRole("link", {
            name: origin.name,
            exact: true,
          });
          await expect(originLink).toHaveAttribute("href", origin.path);

          const repository = header.getByRole("link", {
            name: new RegExp(`^${lab.labels.repository}`),
          });
          await expect(repository).toHaveAttribute(
            "href",
            repositories[data.origin],
          );
          await expect(repository).toHaveAttribute("target", "_blank");
          await expect(repository).toHaveAttribute(
            "rel",
            "noopener noreferrer",
          );
        });

        test("define metadados indexáveis, com a rota equivalente no outro idioma", async ({
          page,
        }) => {
          await page.goto(detailPath);

          await expect(page).toHaveTitle(
            `${text.name} | AI Lab | Bruno Lucildo`,
          );
          const description = await page
            .locator('meta[name="description"]')
            .getAttribute("content");
          expect(description).toBe(text.summary);
          expect(description?.length ?? 0).toBeLessThanOrEqual(160);
          await expect(page.locator('meta[name="robots"]')).toHaveCount(0);

          const expected = {
            en: `/en/ai-lab/${slug}`,
            "pt-BR": `/pt-BR/ai-lab/${slug}`,
            "x-default": `/en/ai-lab/${slug}`,
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

        test("a troca de idioma mantém o experimento", async ({ page }) => {
          await page.goto(detailPath);
          await page
            .getByRole("link", { name: lab.otherLanguage.name, exact: true })
            .click();
          await expect(page).toHaveURL(
            new RegExp(`${lab.otherDetailPath(slug)}/?$`),
          );
        });

        test("o link de voltar leva à lista", async ({ page }) => {
          await page.goto(detailPath);
          await page.getByRole("link", { name: lab.labels.back }).click();
          await expect(page).toHaveURL(new RegExp(`${lab.path}/?$`));
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
            expect(levels[i] ?? 0).toBeLessThanOrEqual(
              (levels[i - 1] ?? 0) + 1,
            );
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
          const lines = await longestLines(page, "main p");

          expect(lines.length).toBeGreaterThanOrEqual(6);
          for (const { width, longestLine } of lines) {
            expect(width).toBeLessThanOrEqual(760);
            expect(longestLine).toBeLessThanOrEqual(80);
          }
        });
      });
    }
  });
}

test("a fonte de dados lista os cinco experimentos com os slugs e estados previstos", () => {
  expect(
    aiLabExperiments.map(({ slug, type, state }) => ({ slug, type, state })),
  ).toEqual([
    { slug: "rag-grounding", type: "proofOfConcept", state: "inDevelopment" },
    {
      slug: "output-validation",
      type: "proofOfConcept",
      state: "inDevelopment",
    },
    { slug: "score-consistency", type: "study", state: "concluded" },
    { slug: "analyst-personas", type: "study", state: "concluded" },
    { slug: null, type: "study", state: "planning" },
  ]);
  // Nenhum experimento é "Projeto concluído" na v1 (AIL-RF-06).
  expect(aiLabExperiments.some((item) => item.type === "completed")).toBe(
    false,
  );
});

test("toda tecnologia do AI Lab existe em Technologies e o projeto de origem existe em Projects", () => {
  const known = new Set(
    technologyCategories.flatMap((category) =>
      category.technologies.map((technology) => technology.name),
    ),
  );
  const normalize = (name: string): readonly string[] =>
    technologyAliases[name] ?? [name];

  for (const experiment of aiLabExperiments) {
    for (const name of experiment.technologies) {
      for (const unified of normalize(name)) {
        expect(known.has(unified), `${experiment.key}: ${unified}`).toBe(true);
      }
    }

    if (experiment.origin) {
      expect(
        projects.some((project) => project.key === experiment.origin),
        experiment.key,
      ).toBe(true);
    }
  }

  // Os dados do teste e da fonte única coincidem.
  for (const experiment of aiLabExperiments) {
    if (experiment.slug === null) continue;
    const expected = shared[experiment.slug as Slug];
    expect(experiment.model).toBe(expected.model);
    expect([...experiment.technologies]).toEqual(expected.technologies);
    expect(experiment.origin).toBe(expected.origin);
  }
});

for (const target of [
  "/en/ai-lab/nao-existe",
  "/pt-BR/ai-lab/nao-existe",
  "/en/ai-lab/analytics-personas",
  "/pt-BR/ai-lab/analytics-personas",
]) {
  test(`um slug sem detalhe responde 404: ${target}`, async ({ page }) => {
    const response = await page.goto(target);
    expect(response?.status()).toBe(404);
  });
}

/**
 * Mede, em cada parágrafo longo, a largura do elemento e o maior número de
 * caracteres em uma linha (AIL-RNF-02). Só considera nós de texto no início.
 */
async function longestLines(
  page: import("@playwright/test").Page,
  selector: string,
) {
  return page.evaluate((selectorInPage) => {
    const blocks = [...document.querySelectorAll(selectorInPage)].filter(
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
  }, selector);
}
