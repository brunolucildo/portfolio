import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";
import { findPhrases } from "./support/content-rules";

type Locale = "en" | "pt-BR";

type RoutePair = { en: string; "pt-BR": string };

/** As treze rotas públicas da SPEC-008, seção 7.1. */
const routes: RoutePair[] = [
  { en: "/en", "pt-BR": "/pt-BR" },
  { en: "/en/about", "pt-BR": "/pt-BR/sobre" },
  { en: "/en/experience", "pt-BR": "/pt-BR/experiencia" },
  { en: "/en/projects", "pt-BR": "/pt-BR/projetos" },
  {
    en: "/en/projects/football-stat-analytics",
    "pt-BR": "/pt-BR/projetos/football-stat-analytics",
  },
  { en: "/en/projects/reelix", "pt-BR": "/pt-BR/projetos/reelix" },
  { en: "/en/technologies", "pt-BR": "/pt-BR/tecnologias" },
  { en: "/en/ai-lab", "pt-BR": "/pt-BR/ai-lab" },
  { en: "/en/ai-lab/rag-grounding", "pt-BR": "/pt-BR/ai-lab/rag-grounding" },
  {
    en: "/en/ai-lab/output-validation",
    "pt-BR": "/pt-BR/ai-lab/output-validation",
  },
  {
    en: "/en/ai-lab/score-consistency",
    "pt-BR": "/pt-BR/ai-lab/score-consistency",
  },
  {
    en: "/en/ai-lab/analyst-personas",
    "pt-BR": "/pt-BR/ai-lab/analyst-personas",
  },
  { en: "/en/contact", "pt-BR": "/pt-BR/contato" },
];

const locales: Locale[] = ["en", "pt-BR"];
const other = (locale: Locale): Locale => (locale === "en" ? "pt-BR" : "en");
const switcherName: Record<Locale, string> = {
  en: "EN, English",
  "pt-BR": "PT, Português",
};

/** Textos da 404 (SPEC-008, seção 7.2). */
const notFoundTexts: Record<
  Locale,
  { h1: string; paragraph: string; link: string; title: string; home: string }
> = {
  en: {
    h1: "Page not found",
    paragraph: "The page you are looking for does not exist or has moved.",
    link: "Back to home",
    title: "Page not found | Bruno Lucildo",
    home: "/en",
  },
  "pt-BR": {
    h1: "Página não encontrada",
    paragraph: "A página que você procura não existe ou mudou de endereço.",
    link: "Voltar para o início",
    title: "Página não encontrada | Bruno Lucildo",
    home: "/pt-BR",
  },
};

/**
 * Textos que podem ser iguais nos dois idiomas, por chave (SPEC-008, seção 7.4):
 * nomes próprios, marcas e termos técnicos.
 */
const allowedIdentical = [
  "about.education.items.postgraduate.institution",
  "about.education.items.undergraduate.period",
  "aiLab.experiments.analyticsPersonas.name",
  "aiLab.metadata.title",
  "aiLab.title",
  "contact.channels.email.title",
  "contact.channels.github.title",
  "contact.channels.linkedin.title",
  "home.aiLab.title",
  "languageSwitcher.options.en",
  "languageSwitcher.options.pt-BR",
  "metadata.title",
  "navigation.items.aiLab",
  "projects.detail.football.metadata.title",
  "projects.detail.reelix.metadata.title",
  "projects.detail.sections.links",
  "projects.items.fintalab.name",
  "projects.items.football.name",
  "projects.items.reelix.name",
  "resume.details.formatValue",
  "technologies.categories.backend",
].sort();

type Head = {
  lang: string | null;
  title: string;
  description: string | null;
  canonical: string | null;
  alternates: Record<string, string>;
  ogLocale: string | null;
  ogAlternates: string[];
  robots: string | null;
};

async function readHead(page: Page): Promise<Head> {
  return page.evaluate(() => {
    const attr = (selector: string, name: string) =>
      document.querySelector(selector)?.getAttribute(name) ?? null;

    return {
      lang: document.documentElement.getAttribute("lang"),
      title: document.title,
      description: attr('meta[name="description"]', "content"),
      canonical: attr('link[rel="canonical"]', "href"),
      alternates: Object.fromEntries(
        [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(
          (link) => [
            link.getAttribute("hreflang") ?? "",
            link.getAttribute("href") ?? "",
          ],
        ),
      ),
      ogLocale: attr('meta[property="og:locale"]', "content"),
      ogAlternates: [
        ...document.querySelectorAll('meta[property="og:locale:alternate"]'),
      ].map((meta) => meta.getAttribute("content") ?? ""),
      robots: attr('meta[name="robots"]', "content"),
    };
  });
}

const pathnameOf = (url: string | null) => new URL(url ?? "").pathname;

test.describe("rotas e redirecionamentos", () => {
  for (const pair of routes) {
    for (const locale of locales) {
      test(`${pair[locale]} responde 200 com lang ${locale}`, async ({
        page,
      }) => {
        const response = await page.goto(pair[locale]);

        expect(response?.status()).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        expect(new URL(page.url()).pathname).toBe(pair[locale]);
      });
    }
  }

  const redirects: [string, string][] = [
    ["/pt-BR/about", "/pt-BR/sobre"],
    ["/pt-BR/projects", "/pt-BR/projetos"],
    ["/pt-BR/contact", "/pt-BR/contato"],
    ["/en/sobre", "/en/about"],
    ["/en/tecnologias", "/en/technologies"],
    ["/en/contato", "/en/contact"],
    ["/EN/about", "/en/about"],
    ["/pt-br/sobre", "/pt-BR/sobre"],
    ["/en/about/", "/en/about"],
  ];

  for (const [from, to] of redirects) {
    test(`${from} redireciona para ${to}`, async ({ page }) => {
      await page.goto(from);
      expect(new URL(page.url()).pathname).toBe(to);
    });
  }

  test("o slug /ai-lab é o mesmo nos dois idiomas", () => {
    for (const pair of routes.filter((route) => route.en.includes("ai-lab"))) {
      expect(pair["pt-BR"]).toBe(pair.en.replace("/en", "/pt-BR"));
    }
  });
});

test.describe("raiz do site", () => {
  const cases: {
    name: string;
    headers: Record<string, string>;
    expected: string;
  }[] = [
    {
      name: "navegador em português, sem cookie",
      headers: { "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8" },
      expected: "/pt-BR",
    },
    {
      name: "navegador em francês, sem cookie",
      headers: { "Accept-Language": "fr" },
      expected: "/en",
    },
    {
      name: "navegador em inglês, sem cookie",
      headers: { "Accept-Language": "en-US,en;q=0.9" },
      expected: "/en",
    },
    {
      name: "cookie en vence o navegador em português",
      headers: { "Accept-Language": "pt-BR", Cookie: "NEXT_LOCALE=en" },
      expected: "/en",
    },
    {
      name: "cookie pt-BR vence o navegador em inglês",
      headers: { "Accept-Language": "en-US", Cookie: "NEXT_LOCALE=pt-BR" },
      expected: "/pt-BR",
    },
  ];

  for (const { name, headers, expected } of cases) {
    test(`/ redireciona (307) para ${expected}: ${name}`, async ({
      request,
    }) => {
      const response = await request.get("/", { headers, maxRedirects: 0 });

      expect(response.status()).toBe(307);
      expect(
        pathnameOf(
          new URL(response.headers().location ?? "", "http://x/").href,
        ),
      ).toBe(expected);
    });
  }
});

test.describe("seletor de idioma", () => {
  for (const pair of routes) {
    test(`troca ${pair.en} por ${pair["pt-BR"]} e volta`, async ({ page }) => {
      await page.goto(pair.en);
      await page
        .getByRole("link", { name: switcherName["pt-BR"], exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`${pair["pt-BR"]}/?$`));

      await page
        .getByRole("link", { name: switcherName.en, exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`${pair.en}/?$`));
    });
  }

  test("marca o idioma ativo com aria-current e mostra os dois idiomas", async ({
    page,
  }) => {
    for (const locale of locales) {
      await page.goto(`/${locale}`);
      const switcher = page.getByRole("list", {
        name: locale === "en" ? "Language" : "Idioma",
      });

      await expect(switcher.getByRole("link")).toHaveCount(2);
      await expect(
        page.locator(`a[aria-current="true"][lang="${locale}"]`).first(),
      ).toBeVisible();
      await expect(
        page.locator(`a[lang="${other(locale)}"]`).first(),
      ).not.toHaveAttribute("aria-current", "true");
    }
  });

  test("escolher pt-BR em um navegador em inglês faz a raiz levar a /pt-BR", async ({
    page,
    context,
  }) => {
    await page.goto("/en/about");
    await page
      .getByRole("link", { name: switcherName["pt-BR"], exact: true })
      .click();
    await expect(page).toHaveURL(/\/pt-BR\/sobre\/?$/);

    const cookies = await context.cookies();
    expect(cookies.find((cookie) => cookie.name === "NEXT_LOCALE")?.value).toBe(
      "pt-BR",
    );

    await page.goto("/");
    expect(new URL(page.url()).pathname).toBe("/pt-BR");
  });
});

test.describe("metadados", () => {
  const heads = new Map<string, Head>();

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    for (const pair of routes) {
      for (const locale of locales) {
        await page.goto(pair[locale]);
        heads.set(pair[locale], await readHead(page));
      }
    }
    await page.close();
  });

  for (const pair of routes) {
    test(`${pair.en} e ${pair["pt-BR"]}: canonical, hreflang recíproco e Open Graph`, () => {
      for (const locale of locales) {
        const head = heads.get(pair[locale]);
        expect(head, pair[locale]).toBeDefined();
        if (!head) return;

        expect(head.lang).toBe(locale);
        expect(pathnameOf(head.canonical)).toBe(pair[locale]);
        expect(head.robots).toBeNull();
        expect(head.title.length).toBeGreaterThan(0);
        expect(head.description?.length ?? 0).toBeGreaterThan(0);

        // As três alternativas são as mesmas nos dois idiomas (reciprocidade).
        expect(Object.keys(head.alternates).sort()).toEqual([
          "en",
          "pt-BR",
          "x-default",
        ]);
        expect(pathnameOf(head.alternates.en ?? null)).toBe(pair.en);
        expect(pathnameOf(head.alternates["pt-BR"] ?? null)).toBe(
          pair["pt-BR"],
        );
        expect(pathnameOf(head.alternates["x-default"] ?? null)).toBe(pair.en);

        expect(head.ogLocale).toBe(locale === "en" ? "en_US" : "pt_BR");
        expect(head.ogAlternates).toEqual([
          other(locale) === "en" ? "en_US" : "pt_BR",
        ]);
      }
    });
  }

  for (const locale of locales) {
    test(`títulos e descrições são únicos entre as páginas ${locale}`, () => {
      const titles = routes.map((pair) => heads.get(pair[locale])?.title);
      const descriptions = routes.map(
        (pair) => heads.get(pair[locale])?.description,
      );

      expect(new Set(titles).size).toBe(routes.length);
      expect(new Set(descriptions).size).toBe(routes.length);
    });
  }

  test("o título de uma página en e o da pt-BR são diferentes (traduzidos)", () => {
    for (const pair of routes.filter((route) => route.en !== "/en/ai-lab")) {
      const english = heads.get(pair.en)?.description;
      const portuguese = heads.get(pair["pt-BR"])?.description;
      expect(english, pair.en).not.toBe(portuguese);
    }
  });
});

test("nenhuma resposta traz o cabeçalho Link com hreflang", async ({
  request,
}) => {
  for (const pair of routes) {
    for (const locale of locales) {
      const response = await request.get(pair[locale]);
      const link = response.headers().link ?? "";

      expect(link, pair[locale]).not.toContain("hreflang");
    }
  }
});

test("o único cookie do site é NEXT_LOCALE", async ({ page, context }) => {
  for (const pair of routes) {
    await page.goto(pair.en);
  }
  await page
    .getByRole("link", { name: switcherName["pt-BR"], exact: true })
    .click();
  for (const pair of routes) {
    await page.goto(pair["pt-BR"]);
  }

  const names = (await context.cookies()).map((cookie) => cookie.name);
  expect([...new Set(names)]).toEqual(["NEXT_LOCALE"]);
});

test.describe("textos", () => {
  const read = (locale: Locale) =>
    JSON.parse(
      readFileSync(
        path.join(process.cwd(), "src", "content", locale, "common.json"),
        "utf8",
      ),
    ) as Record<string, unknown>;

  function leaves(value: unknown, prefix = ""): Map<string, string> {
    const result = new Map<string, string>();
    if (typeof value === "string") {
      result.set(prefix, value);
    } else if (Array.isArray(value)) {
      for (const [index, item] of value.entries()) {
        for (const [key, text] of leaves(item, `${prefix}[${index}]`)) {
          result.set(key, text);
        }
      }
    } else if (value && typeof value === "object") {
      for (const [key, item] of Object.entries(value)) {
        for (const [leaf, text] of leaves(
          item,
          prefix ? `${prefix}.${key}` : key,
        )) {
          result.set(leaf, text);
        }
      }
    }
    return result;
  }

  test("os dois idiomas têm as mesmas chaves", () => {
    const english = leaves(read("en"));
    const portuguese = leaves(read("pt-BR"));

    expect([...portuguese.keys()].sort()).toEqual([...english.keys()].sort());
  });

  test("os únicos textos iguais nos dois idiomas são os da lista de exceções", () => {
    const english = leaves(read("en"));
    const portuguese = leaves(read("pt-BR"));
    const identical = [...english.entries()]
      .filter(([key, text]) => portuguese.get(key) === text)
      .map(([key]) => key)
      .sort();

    expect(identical).toEqual(allowedIdentical);
  });

  test("nenhum texto está vazio", () => {
    for (const locale of locales) {
      for (const [key, text] of leaves(read(locale))) {
        expect(text.trim().length, `${locale} ${key}`).toBeGreaterThan(0);
      }
    }
  });
});

test.describe("sem mistura de idiomas", () => {
  /** Palavras funcionais que não existem no outro idioma (SPEC-008, I18N-RF-10). */
  const foreignWords: Record<Locale, RegExp> = {
    "pt-BR": /\b(the|and|with|for)\b/,
    en: /\b(de|para|com|uma|não)\b/,
  };

  for (const pair of routes) {
    for (const locale of locales) {
      test(`${pair[locale]} não tem palavras funcionais do outro idioma`, async ({
        page,
      }) => {
        await page.goto(pair[locale]);
        // Endereços de e-mail e URLs (".com") não são palavras de um idioma.
        // biome-ignore lint/performance/useDomNodeTextContent: precisa do texto renderizado, com espaço entre os elementos (busca por palavras)
        const text = (await page.locator("body").innerText()).replace(
          /\S*\.com\S*/g,
          " ",
        );
        const found = text.match(new RegExp(foreignWords[locale], "g")) ?? [];

        expect(found, pair[locale]).toEqual([]);
      });
    }
  }

  test("os meses saem de Intl no idioma da página", async ({ page }) => {
    await page.goto("/en/experience");
    // biome-ignore lint/performance/useDomNodeTextContent: precisa do texto renderizado, com espaço entre os elementos (busca por palavras)
    expect(await page.locator("main").innerText()).toContain("May 2023");

    await page.goto("/pt-BR/experiencia");
    // biome-ignore lint/performance/useDomNodeTextContent: precisa do texto renderizado, com espaço entre os elementos (busca por palavras)
    const portuguese = await page.locator("main").innerText();
    expect(portuguese).toContain("mai. 2023");
    expect(portuguese).not.toContain("May 2023");
  });

  test("o currículo em inglês é marcado em pt-BR, em Contact, e não em en", async ({
    page,
  }) => {
    // O botão do header leva à página /curriculo, sem "(EN)" (SPEC-009).
    await page.goto("/pt-BR");
    const header = page.getByRole("banner");
    await expect(header).not.toContainText("(EN)");
    await expect(
      header.getByRole("link", { name: "Currículo", exact: true }),
    ).not.toHaveAttribute("lang", /.*/);

    // O link direto para o PDF continua na página Contact, com a exceção documentada.
    await page.goto("/pt-BR/contato");
    await expect(
      page.getByRole("link", { name: /^Ver currículo \(EN\)/ }),
    ).toHaveAttribute("lang", "en");

    await page.goto("/en/contact");
    await expect(
      page.getByRole("link", { name: /^View Resume/ }),
    ).not.toHaveAttribute("lang", /.*/);
  });
});

test.describe("página 404", () => {
  /** 404 testadas, o idioma delas e o destino do seletor de idioma em cada uma. */
  const cases: { target: string; locale: Locale; switchTo: string }[] = [
    { target: "/en/nao-existe", locale: "en", switchTo: "/pt-BR" },
    { target: "/pt-BR/nao-existe", locale: "pt-BR", switchTo: "/en" },
    // Slug inexistente: o seletor leva à lista da seção no outro idioma.
    { target: "/en/ai-lab/zzz", locale: "en", switchTo: "/pt-BR/ai-lab" },
    {
      target: "/pt-BR/projetos/zzz",
      locale: "pt-BR",
      switchTo: "/en/projects",
    },
    { target: "/pt-BR/ai-lab/zzz", locale: "pt-BR", switchTo: "/en/ai-lab" },
    { target: "/en/projects/zzz", locale: "en", switchTo: "/pt-BR/projetos" },
  ];
  const targets: [string, Locale][] = cases.map(({ target, locale }) => [
    target,
    locale,
  ]);

  for (const [target, locale] of targets) {
    const texts = notFoundTexts[locale];

    test(`${target} responde 404 localizada em ${locale}`, async ({ page }) => {
      const response = await page.goto(target);

      expect(response?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page).toHaveTitle(texts.title);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        texts.h1,
      );
      await expect(page.getByRole("main")).toContainText(texts.paragraph);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/,
      );

      // Identidade do site: skip link, cabeçalho com menu e seletor, rodapé.
      await expect(page.locator('a[href="#main"]')).toHaveCount(1);
      await expect(page.locator("header")).toBeVisible();
      await expect(page.getByRole("navigation").first()).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
      await expect(
        page.locator(`a[aria-current="true"][lang="${locale}"]`).first(),
      ).toBeVisible();

      const home = page
        .getByRole("main")
        .getByRole("link", { name: texts.link });
      await expect(home).toHaveAttribute("href", texts.home);
    });
  }

  test("o link da 404 leva à Home do mesmo idioma", async ({ page }) => {
    await page.goto("/pt-BR/nao-existe");
    await page
      .getByRole("main")
      .getByRole("link", { name: notFoundTexts["pt-BR"].link })
      .click();
    await expect(page).toHaveURL(/\/pt-BR\/?$/);
  });

  for (const { target, locale, switchTo } of cases) {
    test(`o seletor de idioma de ${target} leva a ${switchTo}`, async ({
      page,
    }) => {
      await page.goto(target);
      await page
        .getByRole("link", { name: switcherName[other(locale)], exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`${switchTo}/?$`));
    });
  }

  test("a 404 não tem rolagem horizontal nem pula níveis de título", async ({
    page,
  }) => {
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/pt-BR/nao-existe");

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    }

    const levels = await page
      .locator("main")
      .evaluate((main) =>
        [...main.querySelectorAll("h1, h2, h3")].map((h) =>
          Number(h.tagName.slice(1)),
        ),
      );
    expect(levels).toEqual([1]);
  });

  test("a 404 funciona sem JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const response = await page.goto("/pt-BR/nao-existe");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      notFoundTexts["pt-BR"].h1,
    );
    await context.close();
  });

  test("a 404 usa o design do site, sem a tela padrão do Next", async ({
    page,
  }) => {
    await page.goto("/en/nao-existe");
    // biome-ignore lint/performance/useDomNodeTextContent: precisa do texto renderizado, com espaço entre os elementos (busca por palavras)
    const text = await page.locator("body").innerText();

    expect(findPhrases(text, ["This page could not be found"])).toEqual([]);
    const background = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(background).not.toBe("rgb(255, 255, 255)");
  });
});

test.describe("caminhos sem idioma válido (navegador em inglês)", () => {
  const cases: [string, string][] = [
    ["/nao-existe", "/en/nao-existe"],
    ["/fr/about", "/en/fr/about"],
  ];

  for (const [from, finalPath] of cases) {
    test(`${from} termina na 404 em inglês em ${finalPath}`, async ({
      page,
    }) => {
      const response = await page.goto(from);

      expect(response?.status()).toBe(404);
      expect(new URL(page.url()).pathname).toBe(finalPath);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        notFoundTexts.en.h1,
      );
    });
  }
});

test.describe("caminhos sem idioma válido (navegador em português)", () => {
  test.use({
    locale: "pt-BR",
    extraHTTPHeaders: { "Accept-Language": "pt-BR" },
  });

  const cases: [string, string][] = [
    ["/nao-existe", "/pt-BR/nao-existe"],
    ["/fr/about", "/pt-BR/fr/about"],
  ];

  for (const [from, finalPath] of cases) {
    test(`${from} termina na 404 em português em ${finalPath}`, async ({
      page,
    }) => {
      const response = await page.goto(from);

      expect(response?.status()).toBe(404);
      expect(new URL(page.url()).pathname).toBe(finalPath);
      await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        notFoundTexts["pt-BR"].h1,
      );
    });
  }
});
