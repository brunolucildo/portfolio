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
  captions: { reelix: string; rondo: string; fintalab: string };
  reelixAlts: string[];
  rondoAlts: string[];
  sectionTitles: string[];
  detailTitles: { football: string; reelix: string; rondo: string };
  detailDescriptions: { football: string; reelix: string; rondo: string };
};

const repositories = {
  football: "https://github.com/brunolucildo/football-stat-analytics-cli",
  reelix: "https://github.com/brunolucildo/reelix",
  rondo: "https://github.com/brunolucildo/rondo",
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
  rondo: ["TypeScript", "Node.js", "PostgreSQL", "OpenAI API", "RAG"],
  fintalab: ["TypeScript", "OpenAI API", "SQLite"],
};

const fintalabImages = (locale: string) =>
  ["landing", "evaluation", "roster"].map(
    (screen) => `/images/projects/fintalab-${screen}.${locale}.png`,
  );

/** Textos alternativos das nove telas do Reelix, na ordem do detalhe. */
const reelixAltsEn: string[] = [
  'Reelix home screen on a phone: the Series tab with "Continue watching" and "Start watching" rows of series posters and the start of the release calendar. The app interface is in Portuguese.',
  'Reelix home screen on a phone, Movies tab: a "Quero assistir" row with one movie poster, a row of featured movies and the start of the favorites row. The app interface is in Portuguese.',
  'Reelix catalog search on a phone: the Movies and Series tabs, a search field with "Interestelar" and two results with poster and year. The app interface is in Portuguese.',
  "Reelix title screen for the series Breaking Bad on a phone: a backdrop image, the release date, action buttons, the synopsis and the seasons and episodes tabs with watched progress. The app interface is in Portuguese.",
  "Reelix reviews and comments section on a phone: a half-star rating control with a private or public choice, and a comment box with a spoiler checkbox and a visibility choice. The app interface is in Portuguese.",
  "Reelix watchlist screen on a phone: tabs for favorites, watchlist and my lists, a catalog search field, a sort option and two titles with poster, type, year and genre. The app interface is in Portuguese.",
  "Reelix profile screen on a phone: avatar choices (initials and illustrated characters) and a row of achievement badges with a link to progress and statistics. The app interface is in Portuguese.",
  "Reelix achievements and statistics screen on a phone: totals of episodes, series, movies and records, estimated viewing time and the current month's activity. The app interface is in Portuguese.",
  'Reelix sign-in screen on a phone: the reelix logo, the headline "Suas histórias começam aqui." and e-mail and password fields. The app interface is in Portuguese.',
];

/** Textos alternativos das nove telas do Reelix, na ordem do detalhe. */
const reelixAltsPt: string[] = [
  'Tela inicial do Reelix no celular: a aba Séries com as fileiras "Continuar Assistindo" e "Começar a Assistir", com pôsteres de séries, e o início do calendário de estreias.',
  'Tela inicial do Reelix no celular, aba Filmes: a fileira "Quero assistir" com um pôster de filme, a fileira de filmes em destaque e o início dos favoritos.',
  'Pesquisa no catálogo do Reelix no celular: as abas Filmes e Séries, o campo de busca com "Interestelar" e dois resultados com pôster e ano.',
  "Tela de título do Reelix no celular, para a série Breaking Bad: uma imagem de fundo, a data de lançamento, botões de ação, a sinopse e as abas de temporadas e episódios com o progresso assistido.",
  "Seção de avaliações e comentários do Reelix no celular: o controle de nota em meia estrela com a escolha entre privado e público, e a caixa de comentário com a opção de marcar como spoiler e a escolha de visibilidade.",
  "Tela de watchlist do Reelix no celular: abas de favoritos, watchlist e minhas listas, campo de busca no catálogo, opção de ordenação e dois títulos com pôster, tipo, ano e gênero.",
  "Tela de perfil do Reelix no celular: opções de avatar (iniciais e personagens ilustrados) e uma fileira de medalhas de conquistas com um link para progresso e estatísticas.",
  "Tela de conquistas e estatísticas do Reelix no celular: totais de episódios, séries, filmes e registros, tempo estimado de exibição e a atividade do mês.",
  'Tela de entrada do Reelix no celular: o logotipo do reelix, o título "Suas histórias começam aqui." e os campos de e-mail e senha.',
];

/** Textos alternativos das seis telas do Rondo, na ordem do detalhe. */
const rondoAltsEn: string[] = [
  "Rondo home with the Head Coach expert selected: a pixel-art portrait, the role, a short description and suggested questions, above the bar with the Your connections, Add connection and Add link buttons, the expert selector and the message field. The app interface is in English.",
  'Rondo home with the Sports Physician expert selected: a pixel-art portrait, the role "Athlete health" and suggested questions, with a notice under the message field that the content is informational support and does not replace a licensed professional.',
  "Rondo chat with the Head Coach: a message from the user, an answer from the expert and a Sources box listing the file weekly-plan.txt. The answer text is scripted.",
  "Rondo chat after a question that no connected source covers: the expert says so and gives general guidance, and the answer has no Sources box. The answer text is scripted.",
  "Rondo Connections panel over the chat: the accepted file types (PDF, TXT, Markdown, JPG or PNG), a Choose a file button and the list of connections, with weekly-plan.txt marked Ready and Delete and Delete all buttons.",
  "Rondo chat in the dark theme after reloading the page: the earlier conversation with the Head Coach is still there, with the Sources box and the answer that has no source.",
];

const rondoAltsPt: string[] = [
  "Tela inicial do Rondo com o especialista Head Coach selecionado: um retrato em pixel art, a função, uma descrição curta e perguntas sugeridas, acima da barra com os botões Your connections, Add connection e Add link, o seletor de especialista e o campo de mensagem. A interface do app está em inglês.",
  'Tela inicial do Rondo com o especialista Sports Physician selecionado: um retrato em pixel art, a função "Athlete health" e perguntas sugeridas, com um aviso abaixo do campo de mensagem de que o conteúdo é apoio informativo e não substitui um profissional habilitado.',
  "Chat do Rondo com o Head Coach: uma mensagem da pessoa, uma resposta do especialista e uma caixa Sources com o arquivo weekly-plan.txt. O texto da resposta é roteirizado.",
  "Chat do Rondo depois de uma pergunta que nenhuma fonte conectada cobre: o especialista diz isso e dá uma orientação geral, e a resposta não tem caixa Sources. O texto da resposta é roteirizado.",
  "Painel Connections do Rondo sobre o chat: os tipos de arquivo aceitos (PDF, TXT, Markdown, JPG ou PNG), o botão Choose a file e a lista de conexões, com weekly-plan.txt em estado Ready e os botões Delete e Delete all.",
  "Chat do Rondo no tema escuro depois de recarregar a página: a conversa anterior com o Head Coach continua lá, com a caixa Sources e a resposta sem fonte.",
];

const rondoImages = [
  "/images/projects/rondo-expert.png",
  "/images/projects/rondo-expert-health.png",
  "/images/projects/rondo-answer.png",
  "/images/projects/rondo-gap.png",
  "/images/projects/rondo-connections.png",
  "/images/projects/rondo-history-dark.png",
];

/** As três telas da lista, na ordem: especialista, resposta com fontes e conexões. */
const rondoListImages = [
  rondoImages[0],
  rondoImages[2],
  rondoImages[4],
] as string[];

const pages: ProjectsPage[] = [
  {
    locale: "en",
    path: "/en/projects",
    title: "Projects | Bruno Lucildo",
    description:
      "Projects by Bruno Lucildo and their current state: AI football analysis, a movie tracking app and a club AI platform (personal), and a product concept.",
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
    otherLanguage: { name: "PT, Português", path: "/pt-BR/projetos" },
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
        listImages: [
          "/images/projects/reelix-home.jpg",
          "/images/projects/reelix-search.jpg",
          "/images/projects/reelix-watchlist.jpg",
        ],
      },
      {
        name: "Rondo",
        category: "Personal project",
        status: "Concluded",
        description:
          "A platform to talk to AI experts for the roles of a football club, answering from the sources you connect and citing them. Development is concluded; it runs locally and is not deployed.",
        technologies: technologies.rondo,
        repository: repositories.rondo,
        detail: "/en/projects/rondo",
        listImages: rondoListImages,
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
        "Screens from the development build. The app interface is in Portuguese. Movie and series data and images from TMDB. This product uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.",
      rondo:
        "Screens from the local development build, with scripted model answers and no real data. The app interface is in English, and the experts' suggested questions are in Portuguese.",
      fintalab:
        "Screens from the static concept prototype. All people, clubs and numbers are fictional.",
    },
    reelixAlts: reelixAltsEn,
    rondoAlts: rondoAltsEn,
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
      rondo: "Rondo | Bruno Lucildo",
    },
    detailDescriptions: {
      football:
        "An academic project that analyzes football athlete performance with AI, retrieval and layered answer checks: architecture, decisions and current state.",
      reelix:
        "A personal movie and series tracking app with privacy-first sharing and spoiler control: architecture, technical decisions and current state.",
      rondo:
        "A personal platform of AI experts for football clubs that answer from your own sources, with citations: architecture, decisions and current state.",
    },
  },
  {
    locale: "pt-BR",
    path: "/pt-BR/projetos",
    title: "Projetos | Bruno Lucildo",
    description:
      "Projetos de Bruno Lucildo e o estado de cada um: análise de futebol com IA, app de filmes e plataforma de IA para clubes (pessoais) e um conceito de produto.",
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
    otherLanguage: { name: "EN, English", path: "/en/projects" },
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
        listImages: [
          "/images/projects/reelix-home.jpg",
          "/images/projects/reelix-search.jpg",
          "/images/projects/reelix-watchlist.jpg",
        ],
      },
      {
        name: "Rondo",
        category: "Projeto pessoal",
        status: "Concluído",
        description:
          "Uma plataforma para conversar com especialistas de IA para as funções de um clube de futebol, que respondem a partir das fontes que você conecta e as citam. O desenvolvimento está concluído; roda localmente e não está implantado.",
        technologies: technologies.rondo,
        repository: repositories.rondo,
        detail: "/pt-BR/projetos/rondo",
        listImages: rondoListImages,
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
        "Telas da versão de desenvolvimento. A interface do app está em português. Dados e imagens de filmes e séries do TMDB. Este produto usa o TMDB e as APIs do TMDB, mas não é endossado, certificado nem aprovado de outra forma pelo TMDB.",
      rondo:
        "Telas da versão de desenvolvimento local, com respostas do modelo roteirizadas e sem dados reais. A interface do app está em inglês, e as perguntas sugeridas dos especialistas estão em português.",
      fintalab:
        "Telas do protótipo conceitual estático. Todas as pessoas, clubes e números são fictícios.",
    },
    reelixAlts: reelixAltsPt,
    rondoAlts: rondoAltsPt,
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
      rondo: "Rondo | Bruno Lucildo",
    },
    detailDescriptions: {
      football:
        "Projeto acadêmico de análise de desempenho de atletas de futebol com IA, recuperação e checagem de respostas em camadas: arquitetura, decisões e estado atual.",
      reelix:
        "Aplicativo de acompanhamento de filmes e séries, com compartilhamento que prioriza a privacidade e controle de spoilers: arquitetura, decisões e estado atual.",
      rondo:
        "Plataforma pessoal de especialistas de IA para clubes de futebol que respondem a partir das suas fontes, com citações: arquitetura, decisões e estado atual.",
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
    test("a lista tem um h1 e quatro projetos na ordem prevista", async ({
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
      await expect(entries).toHaveCount(4);

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
        projects.captions.rondo,
      );
      await expect(entries.nth(3).locator("figcaption")).toHaveText(
        projects.captions.fintalab,
      );
    });

    test("os arquivos de imagem existem e têm até 250 KB", () => {
      const files = [
        "reelix-home.jpg",
        "reelix-movies.jpg",
        "reelix-search.jpg",
        "reelix-title.jpg",
        "reelix-reviews.png",
        "reelix-watchlist.jpg",
        "reelix-profile.png",
        "reelix-stats.png",
        "reelix-login.png",
        ...rondoImages.map((image) => path.basename(image)),
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
        projects.projects[2]?.detail ?? "",
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
        projects.projects[2]?.detail ?? "",
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

      const [football, reelix, rondo, fintalab] = projects.projects;
      const order = [
        hrefs.indexOf(football?.detail ?? ""),
        hrefs.indexOf(football?.repository ?? ""),
        hrefs.indexOf(reelix?.detail ?? ""),
        hrefs.indexOf(reelix?.repository ?? ""),
        hrefs.indexOf(rondo?.detail ?? ""),
        hrefs.indexOf(rondo?.repository ?? ""),
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
      await expect(cards).toHaveCount(4);

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

  for (const key of ["football", "reelix", "rondo"] as const) {
    const index = { football: 0, reelix: 1, rondo: 2 }[key];
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

      test("lista as decisões técnicas, cada uma com decisão e razão", async ({
        page,
      }) => {
        await page.goto(detailPath);
        const decisions = page.locator("#decisions li");

        await expect(decisions).toHaveCount(key === "rondo" ? 6 : 4);
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

        if (key === "rondo") {
          await expect(images).toHaveCount(6);
          const rondoSources = await images.evaluateAll((els) =>
            els.map((el) => {
              const url = new URL(
                el.getAttribute("src") ?? "",
                "http://localhost",
              );
              return url.searchParams.get("url") ?? url.pathname;
            }),
          );
          expect(rondoSources).toEqual(rondoImages);
          expect(
            await images.evaluateAll((els) =>
              els.map((el) => el.getAttribute("alt")),
            ),
          ).toEqual(projects.rondoAlts);
          await expect(page.locator("main figcaption")).toHaveText(
            projects.captions.rondo,
          );
          return;
        }

        await expect(images).toHaveCount(9);
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
          "/images/projects/reelix-movies.jpg",
          "/images/projects/reelix-search.jpg",
          "/images/projects/reelix-title.jpg",
          "/images/projects/reelix-reviews.png",
          "/images/projects/reelix-watchlist.jpg",
          "/images/projects/reelix-profile.png",
          "/images/projects/reelix-stats.png",
          "/images/projects/reelix-login.png",
        ]);
        expect(
          await images.evaluateAll((els) =>
            els.map((el) => el.getAttribute("alt")),
          ),
        ).toEqual(projects.reelixAlts);
        for (const image of await images.all()) {
          expect(await image.getAttribute("width")).not.toBeNull();
          expect(await image.getAttribute("height")).not.toBeNull();
        }
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

// As telas do FintaLab ficam lado a lado a partir de 768 px (breakpoint `md` do
// projeto) e empilhadas abaixo disso. O design system não tem o breakpoint `sm`.
test("as telas do FintaLab ficam lado a lado em 1440 px e empilhadas em 390 px", async ({
  page,
}) => {
  const tops = async () =>
    page
      .locator("#projects-list > li:nth-child(4) img")
      .evaluateAll((els) =>
        els.map((el) =>
          Math.round(el.getBoundingClientRect().top + window.scrollY),
        ),
      );

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/projects");
  const wide = await tops();
  expect(wide).toHaveLength(3);
  expect(new Set(wide).size).toBe(1);

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/en/projects");
  const narrow = await tops();
  expect(narrow).toHaveLength(3);
  expect(new Set(narrow).size).toBe(3);
});

// As três telas do Reelix na lista ficam lado a lado em qualquer largura (telas
// de celular em retrato, sem empilhar) e sem rolagem horizontal na página.
for (const width of [1440, 390]) {
  test(`as três telas do Reelix na lista ficam lado a lado com ${width} px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/projects");

    const boxes = await page
      .locator("#projects-list > li:nth-child(2) img")
      .evaluateAll((els) =>
        els.map((el) => {
          const rect = el.getBoundingClientRect();
          return { top: Math.round(rect.top), left: rect.left };
        }),
      );
    expect(boxes).toHaveLength(3);
    expect(new Set(boxes.map((box) => box.top)).size).toBe(1);
    expect(boxes[0]?.left ?? 0).toBeLessThan(boxes[1]?.left ?? 0);
    expect(boxes[1]?.left ?? 0).toBeLessThan(boxes[2]?.left ?? 0);

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

// As nove telas do Reelix ficam em uma única fileira rolável, em qualquer largura,
// e a fileira recebe foco para ser operada pelo teclado.
for (const width of [1440, 390]) {
  test(`as telas do Reelix ficam em uma fileira rolável e focável com ${width} px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/projects/reelix");
    const gallery = page.getByRole("region", { name: "Screens" });

    await expect(gallery).toHaveCount(1);
    await expect(gallery).toHaveAttribute("tabindex", "0");
    const tops = await gallery
      .locator("img")
      .evaluateAll((els) =>
        els.map((el) =>
          Math.round(el.getBoundingClientRect().top + window.scrollY),
        ),
      );
    expect(tops).toHaveLength(9);
    expect(new Set(tops).size).toBe(1);

    const scrolls = await gallery.evaluate(
      (el) => el.scrollWidth > el.clientWidth,
    );
    expect(scrolls).toBe(true);
    const pageOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(pageOverflow).toBeLessThanOrEqual(0);

    await gallery.focus();
    await expect(gallery).toBeFocused();
  });
}

// As telas do Rondo são de computador (paisagem), como as do FintaLab: ficam lado
// a lado a partir de 768 px e empilhadas abaixo disso, na lista (três) e no
// detalhe (seis, em duas fileiras de três), sem rolagem horizontal na página
// (SPEC-014, RON-RF-08).
test("as telas do Rondo ficam lado a lado em 1440 px e empilhadas em 390 px", async ({
  page,
}) => {
  const tops = async (selector: string) =>
    page
      .locator(selector)
      .evaluateAll((els) =>
        els.map((el) =>
          Math.round(el.getBoundingClientRect().top + window.scrollY),
        ),
      );
  const overflow = () =>
    page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );

  for (const [path, selector, count, rows] of [
    ["/en/projects", "#projects-list > li:nth-child(3) img", 3, 1],
    ["/en/projects/rondo", "main figure img", 6, 2],
  ] as const) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path);
    const wide = await tops(selector);
    expect(wide).toHaveLength(count);
    expect(new Set(wide).size).toBe(rows);
    expect(await overflow()).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(path);
    const narrow = await tops(selector);
    expect(narrow).toHaveLength(count);
    expect(new Set(narrow).size).toBe(count);
    expect(await overflow()).toBeLessThanOrEqual(0);
  }
});

// O Rondo diz o que ainda não tem (não está implantado, não foi avaliado com os
// modelos reais) e não publica números (SPEC-014, RON-RF-05 e RON-RF-06).
test("o Rondo declara o que não tem e não publica números", async ({
  page,
}) => {
  await page.goto("/en/projects/rondo");
  const text = await mainText(page);

  expect(text).toContain("It is not deployed");
  expect(text).toContain("has not been evaluated with the real models");
  expect(text).toContain("scripted model answers");
  expect(text.match(/\d+\s?%/g)).toBeNull();
  expect(findPhrases(text, ["Vercel", "Bun", "Claude"])).toEqual([]);
  expect(text.match(/Analytics Personas/g)).toHaveLength(1);

  await page.goto("/pt-BR/projetos/rondo");
  const textPt = await mainText(page);
  expect(textPt).toContain("Não está implantado");
  expect(textPt).toContain("não foi avaliada com os modelos reais");
  expect(textPt).toContain("respostas do modelo roteirizadas");
  expect(textPt.match(/Analytics Personas/g)).toHaveLength(1);
});

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
