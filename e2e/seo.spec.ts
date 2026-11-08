import { expect, type Page, test } from "@playwright/test";
import { aiLabExperiments } from "../src/config/aiLab";
import { projects } from "../src/config/projects";
import { siteConfig } from "../src/config/site";
import { routing } from "../src/i18n/routing";
import { getIndexingPolicy, normalizeSiteUrl } from "../src/lib/seo/indexing";
import { buildRobots } from "../src/lib/seo/robots";
import { serializeJsonLd } from "../src/lib/seo/serialize";
import { companyNames, withheldFromAbout } from "./support/content-rules";

/**
 * SEO final (SPEC-013): robots.txt, sitemap.xml, guarda de indexação, dados
 * estruturados, tamanho de título e descrição e auditoria do HTML. Roda contra o
 * build de produção em localhost, que não é um ambiente indexável.
 */

type Locale = (typeof routing.locales)[number];

const titleLimit = 60;
const descriptionLimit = 160;

const decode = (text: string) =>
  text
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"');

/** Caminhos públicos esperados, derivados das rotas (e não do sitemap). */
function expectedPaths(): { locale: Locale; path: string }[] {
  const projectSlugs = projects.flatMap(({ slug }) => (slug ? [slug] : []));
  const experimentSlugs = aiLabExperiments.flatMap(({ slug }) =>
    slug ? [slug] : [],
  );

  return routing.locales.flatMap((locale) =>
    Object.entries(routing.pathnames).flatMap(([key, entry]) => {
      const template = typeof entry === "string" ? entry : entry[locale];
      const slugs = key.startsWith("/projects/")
        ? projectSlugs
        : key.startsWith("/ai-lab/")
          ? experimentSlugs
          : [null];

      return slugs.map((slug) => {
        const pathname = slug ? template.replace("[slug]", slug) : template;
        return {
          locale,
          path: `/${locale}${pathname === "/" ? "" : pathname}`,
        };
      });
    }),
  );
}

type SitemapEntry = { loc: string; alternates: Record<string, string> };

function parseSitemap(xml: string): SitemapEntry[] {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block = ""]) => ({
    loc: block.match(/<loc>([^<]*)<\/loc>/)?.[1] ?? "",
    alternates: Object.fromEntries(
      [...block.matchAll(/<xhtml:link\b([^>]*)\/?>/g)].map(([, attrs = ""]) => [
        attrs.match(/hreflang="([^"]*)"/)?.[1] ?? "",
        attrs.match(/href="([^"]*)"/)?.[1] ?? "",
      ]),
    ),
  }));
}

type Html = {
  status: number;
  html: string;
  title: string;
  description: string;
  canonical: string | null;
  alternates: Record<string, string>;
  ogImage: string | null;
  robotsMeta: string | null;
  xRobots: string | null;
};

async function fetchHtml(page: Page, path: string): Promise<Html> {
  const response = await page.request.get(path, { maxRedirects: 0 });
  const html = await response.text();
  const tag = (re: RegExp) => html.match(re)?.[1] ?? null;
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([link]) => link);
  const attr = (source: string, name: string) =>
    source.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? "";

  return {
    status: response.status(),
    html,
    title: decode(tag(/<title>([^<]*)<\/title>/) ?? ""),
    description: decode(
      tag(/<meta name="description" content="([^"]*)"/) ?? "",
    ),
    canonical:
      links
        .filter((link) => attr(link, "rel") === "canonical")
        .map((link) => attr(link, "href"))[0] ?? null,
    alternates: Object.fromEntries(
      links
        .filter(
          (link) => attr(link, "rel") === "alternate" && attr(link, "hrefLang"),
        )
        .map((link) => [attr(link, "hrefLang"), attr(link, "href")]),
    ),
    ogImage: tag(/<meta property="og:image" content="([^"]*)"/),
    robotsMeta: tag(/<meta name="robots" content="([^"]*)"/),
    xRobots: response.headers()["x-robots-tag"] ?? null,
  };
}

test.describe("robots.txt", () => {
  test("em ambiente não indexável, bloqueia tudo e não anuncia o sitemap", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");

    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toMatch(/User-Agent: \*/i);
    expect(body).toMatch(/Disallow: \//);
    expect(body).not.toMatch(/Allow: \//);
    expect(body).not.toMatch(/Sitemap:/i);
  });

  test("em ambiente indexável, libera tudo e aponta o sitemap, sem bloquear o PDF", () => {
    const robots = buildRobots(true, "https://exemplo.dev");

    expect(robots).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://exemplo.dev/sitemap.xml",
    });
    expect(JSON.stringify(robots)).not.toContain("/documents");
  });

  test("em ambiente não indexável, as regras bloqueiam tudo e omitem o sitemap", () => {
    expect(buildRobots(false, "https://exemplo.dev")).toEqual({
      rules: { userAgent: "*", disallow: "/" },
    });
  });
});

test.describe("sitemap.xml", () => {
  test("lista exatamente as 34 páginas públicas, com URL absoluta do site", async ({
    request,
    baseURL,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const entries = parseSitemap(await response.text());
    const expected = expectedPaths().map(
      ({ path }) => new URL(path, baseURL).href,
    );

    expect(expected).toHaveLength(34);
    expect(entries.map((entry) => entry.loc).sort()).toEqual(expected.sort());
  });

  test("não contém a raiz, a 404, ícones, o cartão social nem o PDF", async ({
    request,
    baseURL,
  }) => {
    const entries = parseSitemap(
      await (await request.get("/sitemap.xml")).text(),
    );

    for (const { loc } of entries) {
      expect(loc).not.toBe(baseURL);
      expect(loc).not.toBe(`${baseURL}/`);
      expect(loc).not.toMatch(
        /\/icon|apple-icon|opengraph-image|\/documents\/|nao-existe|\?|#/,
      );
    }
  });

  test("cada entrada responde 200, é o próprio canonical e tem as mesmas alternativas do HTML", async ({
    page,
    request,
    baseURL,
  }) => {
    const entries = parseSitemap(
      await (await request.get("/sitemap.xml")).text(),
    );

    for (const { loc, alternates } of entries) {
      const head = await fetchHtml(page, new URL(loc).pathname);

      expect(head.status, loc).toBe(200);
      expect(head.canonical, loc).toBe(loc);
      expect(head.robotsMeta, loc).toBeNull();
      expect(head.ogImage, loc).toMatch(new RegExp(`^${baseURL}/`));
      expect(Object.keys(alternates).sort(), loc).toEqual([
        "en",
        "pt-BR",
        "x-default",
      ]);
      expect(head.alternates, loc).toEqual(alternates);
    }
  });
});

test.describe("guarda de indexação", () => {
  const production = "https://exemplo.dev";

  test("só indexa com SITE_INDEXING=allow", () => {
    expect(
      getIndexingPolicy({ siteUrl: production, indexing: "allow" }).indexable,
    ).toBe(true);

    for (const indexing of [undefined, "", "true", "ALLOW", "deny"]) {
      const policy = getIndexingPolicy({ siteUrl: production, indexing });
      expect(policy.indexable, String(indexing)).toBe(false);
      expect(policy.reason).not.toBe("");
    }
  });

  test("o padrão, sem variável nenhuma, não indexa", () => {
    expect(
      getIndexingPolicy({ siteUrl: undefined, indexing: undefined }).indexable,
    ).toBe(false);
  });

  test("recusa liberar a indexação com localhost ou http", () => {
    for (const siteUrl of [
      undefined,
      "http://localhost:3000",
      "https://localhost",
      "https://127.0.0.1",
      "https://app.localhost",
      "https://[::1]:3000",
      "http://exemplo.dev",
    ]) {
      expect(
        () => getIndexingPolicy({ siteUrl, indexing: "allow" }),
        String(siteUrl),
      ).toThrow(/SITE_INDEXING=allow exige/);
    }
  });

  test("normaliza a URL do site e recusa valor inválido", () => {
    expect(normalizeSiteUrl(undefined)).toBe("http://localhost:3000");
    expect(normalizeSiteUrl("")).toBe("http://localhost:3000");
    expect(normalizeSiteUrl("https://exemplo.dev/")).toBe(
      "https://exemplo.dev",
    );
    expect(normalizeSiteUrl("  https://exemplo.dev  ")).toBe(
      "https://exemplo.dev",
    );

    expect(() => normalizeSiteUrl("exemplo.dev")).toThrow(/URL absoluta/);
    expect(() => normalizeSiteUrl("ftp://exemplo.dev")).toThrow(
      /http ou https/,
    );
    expect(() => normalizeSiteUrl("https://exemplo.dev/blog")).toThrow(
      /sem caminho/,
    );
    expect(() => normalizeSiteUrl("https://exemplo.dev/?a=1")).toThrow(
      /sem caminho/,
    );
  });

  test("em localhost, páginas e PDF saem com X-Robots-Tag noindex", async ({
    page,
  }) => {
    const home = await fetchHtml(page, "/en");
    expect(home.xRobots).toContain("noindex");

    const pdf = await page.request.get(siteConfig.resume.en.href);
    expect(pdf.headers()["x-robots-tag"]).toContain("noindex");
  });

  test("a 404 continua com noindex nos dois idiomas", async ({ page }) => {
    for (const locale of routing.locales) {
      const notFound = await fetchHtml(page, `/${locale}/nao-existe`);
      expect(notFound.status).toBe(404);
      expect(notFound.robotsMeta).toMatch(/noindex/);
    }
  });
});

test.describe("cabeçalhos de segurança", () => {
  test("páginas e arquivos estáticos saem com os cabeçalhos básicos e sem X-Powered-By", async ({
    request,
  }) => {
    for (const path of [
      "/en",
      "/pt-BR/sobre",
      "/en/nao-existe",
      "/robots.txt",
      siteConfig.resume.en.href,
    ]) {
      const headers = (await request.get(path)).headers();

      expect(headers["x-content-type-options"], path).toBe("nosniff");
      expect(headers["referrer-policy"], path).toBe(
        "strict-origin-when-cross-origin",
      );
      expect(headers["x-frame-options"], path).toBe("DENY");
      expect(headers["permissions-policy"], path).toContain("camera=()");
      expect(headers["x-powered-by"], path).toBeUndefined();
    }
  });
});

test.describe("dados estruturados", () => {
  type LdNode = Record<string, unknown>;

  async function readJsonLd(page: Page, path: string): Promise<LdNode[]> {
    const { html } = await fetchHtml(page, path);
    return [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ].map(([, json = ""]) => JSON.parse(json) as LdNode);
  }

  const forbidden = [
    ...withheldFromAbout,
    ...companyNames,
    "email",
    "telephone",
    "mailto",
    "@gmail",
    "%",
    "worksFor",
    "aggregateRating",
    "review",
  ];

  const jobTitle: Record<Locale, string> = {
    en: "Senior Backend Developer | Technical Lead",
    "pt-BR": "Desenvolvedor Backend Sênior | Líder Técnico",
  };

  for (const locale of routing.locales) {
    test.describe(locale, () => {
      const home = `/${locale}`;
      const about = `/${locale}/${locale === "en" ? "about" : "sobre"}`;

      test("a Home tem WebSite e Person com os dados do site", async ({
        page,
        baseURL,
      }) => {
        const blocks = await readJsonLd(page, home);
        expect(blocks).toHaveLength(1);

        const block = blocks[0] as LdNode;
        expect(block["@context"]).toBe("https://schema.org");
        const graph = block["@graph"] as LdNode[];
        const website = graph.find((node) => node["@type"] === "WebSite");
        const person = graph.find((node) => node["@type"] === "Person");

        expect(website).toMatchObject({
          name: siteConfig.name,
          url: `${baseURL}/${locale}`,
          inLanguage: locale,
        });
        expect(person).toMatchObject({
          name: siteConfig.name,
          jobTitle: jobTitle[locale],
          url: `${baseURL}/${locale}`,
          image: `${baseURL}${siteConfig.heroPhoto.src}`,
          sameAs: [siteConfig.contact.linkedin, siteConfig.contact.github],
        });

        const head = await fetchHtml(page, home);
        expect(person?.description).toBe(head.description);
        // O cargo e a foto estão visíveis na própria página (SEO.md, 8).
        expect(head.html).toContain(jobTitle[locale]);
        expect(head.html).toContain(siteConfig.heroPhoto.src.split("/").pop());
      });

      test("o About tem ProfilePage com Person, sem foto", async ({
        page,
        baseURL,
      }) => {
        const blocks = await readJsonLd(page, about);
        expect(blocks).toHaveLength(1);

        const block = blocks[0] as LdNode;
        expect(block).toMatchObject({
          "@type": "ProfilePage",
          url: `${baseURL}${about}`,
          inLanguage: locale,
        });
        const person = block.mainEntity as LdNode;
        expect(person).toMatchObject({
          "@type": "Person",
          name: siteConfig.name,
          jobTitle: jobTitle[locale],
        });
        expect(person).not.toHaveProperty("image");

        const head = await fetchHtml(page, about);
        expect(person.description).toBe(head.description);
      });

      test("não publica empresa, contato, métricas nem avaliações", async ({
        page,
      }) => {
        for (const path of [home, about]) {
          const [block] = await readJsonLd(page, path);
          const text = JSON.stringify(block).toLowerCase();

          for (const word of forbidden) {
            expect(text, `${path}: ${word}`).not.toContain(word.toLowerCase());
          }
        }
      });
    });
  }

  test("as outras páginas não têm JSON-LD", async ({ page }) => {
    const others = expectedPaths().filter(
      ({ path }) =>
        !/^\/(en|pt-BR)$/.test(path) && !/\/(about|sobre)$/.test(path),
    );

    expect(others).toHaveLength(30);
    for (const { path } of others) {
      expect(await readJsonLd(page, path), path).toHaveLength(0);
    }
  });

  test("um texto com </script> não fecha o elemento", () => {
    const output = serializeJsonLd({
      name: "</script><script>alert(1)</script>",
    });

    expect(output).not.toContain("</script>");
    expect(output).not.toContain("<");
    expect(JSON.parse(output)).toEqual({
      name: "</script><script>alert(1)</script>",
    });
  });
});

test.describe("título, descrição e estrutura das páginas", () => {
  /** Rastreia os links internos a partir das duas Homes. */
  async function crawl(page: Page) {
    const pages = new Map<string, Html>();
    const broken: string[] = [];
    const queue = routing.locales.map((locale) => `/${locale}`);

    while (queue.length) {
      const path = queue.shift() as string;
      if (pages.has(path)) continue;

      const result = await fetchHtml(page, path);
      pages.set(path, result);
      if (result.status !== 200) {
        broken.push(`${path} (${result.status})`);
        continue;
      }

      for (const [, href] of result.html.matchAll(
        /<a\b[^>]*\bhref="([^"]*)"/g,
      )) {
        const link = decode(href ?? "");
        if (!link.startsWith("/") || link.startsWith("//")) continue;
        const clean = link.split("#")[0]?.split("?")[0] ?? "";
        if (clean && !/\.\w{2,4}$/.test(clean) && !pages.has(clean)) {
          queue.push(clean);
        }
      }
    }

    return { pages, broken };
  }

  test("o rastreamento alcança as 34 páginas, sem link interno quebrado", async ({
    page,
  }) => {
    const { pages, broken } = await crawl(page);

    expect(broken).toEqual([]);
    expect([...pages.keys()].sort()).toEqual(
      expectedPaths()
        .map(({ path }) => path)
        .sort(),
    );
  });

  test("título até 60 e descrição até 160 caracteres, únicos em cada idioma", async ({
    page,
  }) => {
    const { pages } = await crawl(page);

    for (const locale of routing.locales) {
      const own = [...pages].filter(([path]) => path.startsWith(`/${locale}`));
      const titles = own.map(([, head]) => head.title);
      const descriptions = own.map(([, head]) => head.description);

      for (const [path, head] of own) {
        expect(head.title.length, `título de ${path}`).toBeLessThanOrEqual(
          titleLimit,
        );
        expect(head.title, `título de ${path}`).not.toBe("");
        expect(
          head.description.length,
          `descrição de ${path}`,
        ).toBeLessThanOrEqual(descriptionLimit);
        expect(head.description, `descrição de ${path}`).not.toBe("");
      }

      expect(new Set(titles).size, `títulos em ${locale}`).toBe(titles.length);
      expect(new Set(descriptions).size, `descrições em ${locale}`).toBe(
        descriptions.length,
      );
    }
  });

  test("um h1 por página, sem pulo de nível e sem imagem sem alt", async ({
    page,
  }) => {
    const { pages } = await crawl(page);

    for (const [path, { html }] of pages) {
      const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map(([, level]) =>
        Number(level),
      );

      expect(
        levels.filter((level) => level === 1),
        `h1 em ${path}`,
      ).toHaveLength(1);
      levels.slice(1).forEach((level, index) => {
        expect(
          level - (levels[index] ?? level),
          `pulo de título em ${path}`,
        ).toBeLessThanOrEqual(1);
      });
      expect(
        html.match(/<img(?![^>]*\balt=)[^>]*>/g) ?? [],
        `img sem alt em ${path}`,
      ).toEqual([]);
    }
  });
});
