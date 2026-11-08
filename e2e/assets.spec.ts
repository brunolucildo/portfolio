import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";
import { brandColors } from "../src/config/brand";
import { projects } from "../src/config/projects";
import { siteConfig } from "../src/config/site";
import { technologyCategories } from "../src/config/technologies";
import { routing } from "../src/i18n/routing";

type Locale = (typeof routing.locales)[number];

const root = process.cwd();
const imagesDir = path.join(root, "public", "images");
const kb = 1024;

const maxBytes = { hero: 600 * kb, screen: 300 * kb, svg: 15 * kb };

const ogAlt: Record<Locale, string> = {
  en: "Bruno Lucildo, Senior Backend Developer | Technical Lead. Engineering beyond code.",
  "pt-BR":
    "Bruno Lucildo, Desenvolvedor Backend Sênior | Líder Técnico. Engenharia além do código.",
};

/** Arquivos de imagem de `public/images/`, com o caminho público (`/images/...`). */
function imageFiles(dir = imagesDir): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return imageFiles(full);
    return /\.(png|jpe?g|svg)$/i.test(entry.name)
      ? [
          `/${path.relative(path.join(root, "public"), full).replaceAll("\\", "/")}`,
        ]
      : [];
  });
}

/** Caminhos públicos que o código referencia: fotografia, telas e ícones. */
function referencedImages(): string[] {
  const screens = projects.flatMap((project) =>
    [...project.listImages, ...project.detailImages].flatMap((image) =>
      typeof image.src === "string"
        ? [image.src]
        : Object.values(image.src as Record<string, string>),
    ),
  );
  const icons = technologyCategories.flatMap((category) =>
    category.technologies.flatMap((technology) =>
      technology.icon?.kind === "brand"
        ? [`/images/technologies/${technology.icon.file}.svg`]
        : [],
    ),
  );
  return [...new Set([siteConfig.heroPhoto.src, ...screens, ...icons])];
}

const publicPath = (file: string) => path.join(root, "public", file);

/** Dimensões de um PNG, lidas do bloco IHDR. */
function pngSize(bytes: Buffer): { width: number; height: number } {
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

test.describe("arquivos de imagem", () => {
  test("toda imagem é usada pelo código e toda referência aponta para um arquivo", () => {
    const files = imageFiles().sort();
    const referenced = referencedImages().sort();

    expect(files.length).toBe(33);
    expect(
      files.filter((file) => !referenced.includes(file)),
      "arquivos sem uso",
    ).toEqual([]);
    expect(
      referenced.filter((file) => !existsSync(publicPath(file))),
      "referências quebradas",
    ).toEqual([]);
  });

  test("o peso de cada arquivo respeita os limites", () => {
    expect(statSync(publicPath(siteConfig.heroPhoto.src)).size).toBeLessThan(
      maxBytes.hero,
    );

    const screens = imageFiles().filter((file) => file.includes("/projects/"));
    expect(screens.length).toBe(15);
    for (const file of screens) {
      expect(statSync(publicPath(file)).size, file).toBeLessThan(
        maxBytes.screen,
      );
    }

    const icons = imageFiles().filter((file) => file.endsWith(".svg"));
    expect(icons.length).toBe(17);
    for (const file of icons) {
      expect(statSync(publicPath(file)).size, file).toBeLessThan(maxBytes.svg);
    }
  });

  test("nenhuma imagem traz metadados embutidos", () => {
    const pngMetadata = new Set(["tEXt", "iTXt", "zTXt", "eXIf", "iCCP"]);

    for (const file of imageFiles()) {
      const bytes = readFileSync(publicPath(file));
      const found: string[] = [];

      if (file.endsWith(".png")) {
        for (let pos = 8; pos < bytes.length; ) {
          const length = bytes.readUInt32BE(pos);
          const kind = bytes.toString("latin1", pos + 4, pos + 8);
          if (pngMetadata.has(kind)) found.push(kind);
          pos += 12 + length;
        }
      } else if (/\.jpe?g$/.test(file)) {
        for (let pos = 2; pos < bytes.length - 4; ) {
          if (bytes[pos] !== 0xff) {
            pos++;
            continue;
          }
          const marker = bytes[pos + 1] ?? 0;
          if (marker === 0xda) break; // começa a imagem
          if (marker === 0xe1) found.push("APP1 (EXIF/XMP)");
          if (marker === 0xfe) found.push("COM");
          pos += 2 + bytes.readUInt16BE(pos + 2);
        }
      } else {
        const text = bytes.toString("utf8");
        for (const marker of ["<metadata", "xpacket", "sodipodi", "inkscape"]) {
          if (text.includes(marker)) found.push(marker);
        }
      }

      expect(found, file).toEqual([]);
    }
  });

  test("as cores da marca em brand.ts são as de tokens.css", () => {
    const tokens = readFileSync(
      path.join(root, "src", "styles", "tokens.css"),
      "utf8",
    ).toLowerCase();

    for (const [name, value] of Object.entries(brandColors)) {
      expect(tokens, name).toContain(`--color-${name}: ${value};`);
    }
  });

  test("CREDITS.md registra os seis grupos, com origem, direitos e data", () => {
    const credits = readFileSync(path.join(imagesDir, "CREDITS.md"), "utf8");
    const rows = credits
      .split("\n")
      .filter((line) => line.startsWith("|") && !line.startsWith("|---"))
      .slice(1); // cabeçalho da tabela

    expect(rows).toHaveLength(6);
    for (const [index, marker] of [
      "hero/bruno-lucildo-portrait.png",
      "reelix",
      "fintalab",
      "technologies",
      "icon.tsx",
      "opengraph-image.tsx",
    ].entries()) {
      expect(rows[index], marker).toContain(marker);
      expect(rows[index], marker).toMatch(/\d{4}-\d{2}-\d{2}/);
    }
    expect(credits).toContain("TMDB");
  });

  test("BUSINESS, CONTENT e DESIGN não dizem mais que a fotografia está em aberto", () => {
    const read = (name: string) =>
      readFileSync(path.join(root, ".docs", name), "utf8");

    expect(read("BUSINESS.md")).not.toContain(
      "A fotografia ficará no Hero ou na seção Sobre? | Em aberto",
    );
    expect(read("CONTENT.md")).not.toContain(
      "Definir utilização da fotografia | Pendente",
    );
    const design = read("DESIGN.md");
    expect(design).not.toContain("ainda depende da definição da imagem");
    expect(design).not.toContain(
      "poderá ser utilizada no Hero ou na seção Sobre",
    );
  });
});

/** Páginas com imagens ou sem elas, nos dois idiomas, para as medições no navegador. */
const imagePages: Record<Locale, { path: string; images: number }[]> = {
  en: [
    { path: "/en", images: 1 },
    { path: "/en/about", images: 0 },
    { path: "/en/projects", images: 6 },
    { path: "/en/projects/reelix", images: 9 },
    { path: "/en/projects/football-stat-analytics", images: 0 },
    { path: "/en/technologies", images: 0 },
  ],
  "pt-BR": [
    { path: "/pt-BR", images: 1 },
    { path: "/pt-BR/sobre", images: 0 },
    { path: "/pt-BR/projetos", images: 6 },
    { path: "/pt-BR/projetos/reelix", images: 9 },
  ],
};

for (const locale of routing.locales) {
  test.describe(`imagens renderizadas (${locale})`, () => {
    for (const viewport of [
      { name: "desktop", width: 1440, height: 900, scale: 1 },
      { name: "celular", width: 375, height: 812, scale: 2 },
    ]) {
      test(`alt, dimensões, carregamento, formato e tamanho (${viewport.name})`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: viewport.scale,
        });
        const page = await context.newPage();

        for (const { path: pagePath, images } of imagePages[locale]) {
          const served: { url: string; type: string }[] = [];
          page.on("response", (response) => {
            if (response.url().includes("/_next/image")) {
              served.push({
                url: response.url(),
                type: response.headers()["content-type"] ?? "",
              });
            }
          });
          await page.goto(pagePath, { waitUntil: "networkidle" });

          const found = await page.evaluate(() =>
            [...document.querySelectorAll("main img")].map((img) => {
              const element = img as HTMLImageElement;
              const box = element.getBoundingClientRect();
              return {
                alt: element.getAttribute("alt"),
                loading: element.getAttribute("loading"),
                hasSize:
                  element.hasAttribute("width") &&
                  element.hasAttribute("height"),
                natural: element.naturalWidth,
                shown: box.width * window.devicePixelRatio,
                src: element.currentSrc,
              };
            }),
          );

          expect(found, pagePath).toHaveLength(images);
          for (const image of found) {
            expect(
              image.alt?.trim().length ?? 0,
              `${pagePath} alt`,
            ).toBeGreaterThan(0);
            expect(image.hasSize, `${pagePath} width/height`).toBe(true);
            expect(image.src, pagePath).not.toMatch(/tmdb/i);
            // Só a fotografia do Hero, na Home, carrega sem `lazy`.
            if (pagePath === `/${locale}`) {
              expect(image.loading, `${pagePath} hero`).not.toBe("lazy");
            } else {
              expect(image.loading, `${pagePath} lazy`).toBe("lazy");
            }
            // Em tela cheia o Next entrega a largura mais próxima do exibido.
            if (image.shown > 0) {
              expect(
                image.natural / image.shown,
                `${pagePath} tamanho`,
              ).toBeLessThanOrEqual(1.3);
            }
          }

          for (const response of served) {
            expect(response.type, response.url).toBe("image/webp");
          }
          served.length = 0;
          page.removeAllListeners("response");
        }

        await context.close();
      });
    }

    test("as páginas com imagem não sofrem deslocamento de layout", async ({
      page,
    }) => {
      await page.addInitScript(() => {
        const state = { shift: 0 };
        (window as unknown as { __cls: typeof state }).__cls = state;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as unknown as {
            value: number;
            hadRecentInput: boolean;
          }[]) {
            if (!entry.hadRecentInput) state.shift += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });

      for (const { path: pagePath, images } of imagePages[locale]) {
        if (images === 0) continue;
        await page.goto(pagePath, { waitUntil: "networkidle" });
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight),
        );
        await page.waitForTimeout(400);

        const shift = await page.evaluate(
          () => (window as unknown as { __cls: { shift: number } }).__cls.shift,
        );
        expect(shift, pagePath).toBeLessThan(0.02);
      }
    });
  });
}

test.describe("ícone do site", () => {
  const withIcon = ["/en", "/en/about", "/pt-BR/sobre", "/en/nao-existe"];

  for (const pagePath of withIcon) {
    test(`${pagePath} declara os ícones e os links respondem`, async ({
      page,
      request,
    }) => {
      await page.goto(pagePath);

      const icons = await page.evaluate(() =>
        [...document.querySelectorAll('link[rel="icon"]')].map((link) => ({
          href: link.getAttribute("href") ?? "",
          sizes: link.getAttribute("sizes"),
        })),
      );
      const apple = await page.evaluate(() =>
        [...document.querySelectorAll('link[rel="apple-touch-icon"]')].map(
          (link) => ({
            href: link.getAttribute("href") ?? "",
            sizes: link.getAttribute("sizes"),
          }),
        ),
      );

      expect(icons.map((icon) => icon.sizes).sort()).toEqual([
        "32x32",
        "512x512",
      ]);
      expect(apple.map((icon) => icon.sizes)).toEqual(["180x180"]);

      for (const { href } of [...icons, ...apple]) {
        const response = await request.get(href, { maxRedirects: 0 });
        expect(response.status(), href).toBe(200);
        expect(response.headers()["content-type"], href).toContain("image/png");
      }
    });
  }

  test("/favicon.ico responde com uma imagem", async ({ request }) => {
    const response = await request.get("/favicon.ico", { maxRedirects: 0 });

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/");
  });

  test("os ícones têm 32, 180 e 512 px, fundo escuro e letras verde-limão", async ({
    page,
  }) => {
    await page.goto("/en");
    const sizes = { "/icon/small": 32, "/icon/large": 512, "/apple-icon": 180 };

    for (const [url, size] of Object.entries(sizes)) {
      const pixels = await page.evaluate(async (target) => {
        const blob = await (await fetch(target)).blob();
        const bitmap = await createImageBitmap(blob);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("sem canvas");
        context.drawImage(bitmap, 0, 0);
        const data = context.getImageData(
          0,
          0,
          bitmap.width,
          bitmap.height,
        ).data;
        let lime = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (
            (data[i] ?? 0) > 150 &&
            (data[i + 1] ?? 0) > 200 &&
            (data[i + 2] ?? 255) < 160
          ) {
            lime++;
          }
        }
        return {
          width: bitmap.width,
          height: bitmap.height,
          corner: [data[0], data[1], data[2]],
          lime,
        };
      }, url);

      expect(pixels.width, url).toBe(size);
      expect(pixels.height, url).toBe(size);
      expect(pixels.corner, url).toEqual([11, 13, 12]); // --color-background
      expect(pixels.lime, url).toBeGreaterThan(size * size * 0.04);
    }
  });
});

test.describe("imagem de compartilhamento", () => {
  test("cada idioma tem um PNG de 1200 x 630 px, diferente do outro", async ({
    request,
  }) => {
    const bodies: Buffer[] = [];

    for (const locale of routing.locales) {
      const response = await request.get(`/${locale}/opengraph-image`);
      expect(response.status(), locale).toBe(200);
      expect(response.headers()["content-type"], locale).toContain("image/png");

      const body = await response.body();
      // Valores literais da SPEC: comparar com `socialImageSize` não provaria nada.
      expect(pngSize(body), locale).toEqual({ width: 1200, height: 630 });
      bodies.push(body);
    }

    expect(bodies[0]?.equals(bodies[1] ?? Buffer.alloc(0))).toBe(false);
  });

  const indexable = [
    ...Object.keys(routing.pathnames).filter((key) => !key.includes("[")),
  ];

  for (const locale of routing.locales) {
    const pathFor = (key: string) => {
      const entry = routing.pathnames[key as keyof typeof routing.pathnames];
      const segment = typeof entry === "string" ? entry : entry[locale];
      return segment === "/" ? `/${locale}` : `/${locale}${segment}`;
    };
    const targets = [
      ...indexable.map(pathFor),
      `${pathFor("/projects")}/reelix`,
      `${pathFor("/ai-lab")}/rag-grounding`,
    ];

    test(`${locale}: toda página indexável tem og:image e twitter:card`, async ({
      page,
    }) => {
      for (const target of targets) {
        const response = await page.goto(target);
        expect(response?.status(), target).toBe(200);

        const meta = await page.evaluate(() => {
          const content = (selector: string) =>
            [...document.querySelectorAll(selector)].map(
              (element) => element.getAttribute("content") ?? "",
            );
          return {
            image: content('meta[property="og:image"]'),
            width: content('meta[property="og:image:width"]'),
            height: content('meta[property="og:image:height"]'),
            alt: content('meta[property="og:image:alt"]'),
            card: content('meta[name="twitter:card"]'),
            twitterImage: content('meta[name="twitter:image"]'),
          };
        });

        expect(meta.image, target).toHaveLength(1);
        const url = new URL(meta.image[0] ?? "");
        expect(url.pathname, target).toBe(`/${locale}/opengraph-image`);
        expect(meta.width, target).toEqual(["1200"]);
        expect(meta.height, target).toEqual(["630"]);
        expect(meta.alt, target).toEqual([ogAlt[locale]]);
        expect(meta.card, target).toEqual(["summary_large_image"]);
        expect(new URL(meta.twitterImage[0] ?? "").pathname, target).toBe(
          `/${locale}/opengraph-image`,
        );
      }
    });

    test(`${locale}: a 404 não tem og:image`, async ({ page }) => {
      const response = await page.goto(`/${locale}/nao-existe`);

      expect(response?.status()).toBe(404);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
    });
  }
});

async function pageText(page: Page) {
  return (await page.getByRole("main").textContent()) ?? "";
}

test("a página do Reelix não mostra imagem nem logotipo do TMDB", async ({
  page,
}) => {
  for (const target of ["/en/projects/reelix", "/pt-BR/projetos/reelix"]) {
    await page.goto(target);

    const sources = await page.evaluate(() =>
      [...document.querySelectorAll("img, svg image, source")].map(
        (element) =>
          element.getAttribute("src") ?? element.getAttribute("srcset") ?? "",
      ),
    );
    expect(sources.join(" "), target).not.toMatch(/tmdb|themoviedb/i);
    expect(await pageText(page), target).toContain("TMDB");
  }
});
