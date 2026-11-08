import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";
import {
  fileNameOf,
  formatFileSize,
  formatResumeMonth,
} from "../src/components/resume/format";
import {
  getResumeHref,
  hasLocalizedResume,
  siteConfig,
} from "../src/config/site";
import {
  companyNames,
  findPhrases,
  forbiddenPhrases,
  jobSeekingPhrases,
} from "./support/content-rules";

const resumeHref = "/documents/resume/bruno-lucildo-resume-en.pdf";
const resumeFile = path.join(process.cwd(), "public", resumeHref);

type ResumePage = {
  locale: "en" | "pt-BR";
  path: string;
  title: string;
  description: string;
  openGraphLocale: string;
  h1: string;
  intro: string;
  insideHeading: string;
  insideItems: string[];
  view: string;
  download: string;
  newTab: string;
  /** Aviso de arquivo em inglês: só existe em pt-BR enquanto não há PDF próprio. */
  notice: string | null;
  details: { labels: string[]; language: string; updatedPattern: RegExp };
  links: { experience: string; contact: string };
  navLabel: string;
  navigationPaths: { experience: string; contact: string; about: string };
  alternates: Record<string, string>;
  otherLanguage: { name: string; path: string };
};

const pages: ResumePage[] = [
  {
    locale: "en",
    path: "/en/resume",
    title: "Resume | Bruno Lucildo",
    description:
      "View or download Bruno Lucildo's resume (PDF, in English): professional experience, education, skills and languages.",
    openGraphLocale: "en_US",
    h1: "Resume",
    intro:
      "The formal version of my professional history, in a single document. The Experience page tells the same story with more context.",
    insideHeading: "What's inside",
    insideItems: [
      "Summary: a profile of my background and focus.",
      "Professional experience: roles, periods and responsibilities.",
      "Education: degrees and postgraduate studies.",
      "Skills: languages, frameworks, databases, messaging and architecture.",
      "Languages: spoken languages and proficiency.",
    ],
    view: "View Resume",
    download: "Download PDF",
    newTab: "(opens in a new tab)",
    notice: null,
    details: {
      labels: ["Format", "File language", "Last updated", "Size"],
      language: "English",
      updatedPattern: /^November 2026$/,
    },
    links: { experience: "View experience", contact: "Get in Touch" },
    navLabel: "Resume",
    navigationPaths: {
      experience: "/en/experience",
      contact: "/en/contact",
      about: "/en/about",
    },
    alternates: {
      en: "/en/resume",
      "pt-BR": "/pt-BR/curriculo",
      "x-default": "/en/resume",
    },
    otherLanguage: { name: "Português", path: "/pt-BR/curriculo" },
  },
  {
    locale: "pt-BR",
    path: "/pt-BR/curriculo",
    title: "Currículo | Bruno Lucildo",
    description:
      "Veja ou baixe o currículo de Bruno Lucildo (PDF, em inglês): experiência profissional, formação, habilidades e idiomas.",
    openGraphLocale: "pt_BR",
    h1: "Currículo",
    intro:
      "A versão formal da minha trajetória profissional, em um único documento. A página Experiência conta a mesma história com mais contexto.",
    insideHeading: "O que o documento traz",
    insideItems: [
      "Resumo: um perfil da minha formação e do meu foco.",
      "Experiência profissional: cargos, períodos e responsabilidades.",
      "Formação: graduação e pós-graduação.",
      "Habilidades: linguagens, frameworks, bancos de dados, mensageria e arquitetura.",
      "Idiomas: idiomas falados e nível de proficiência.",
    ],
    view: "Ver currículo",
    download: "Baixar PDF",
    newTab: "(abre em uma nova aba)",
    notice: "O currículo está disponível apenas em inglês.",
    details: {
      labels: ["Formato", "Idioma do arquivo", "Última atualização", "Tamanho"],
      language: "Inglês",
      updatedPattern: /^novembro de 2026$/,
    },
    links: { experience: "Ver experiência", contact: "Entrar em contato" },
    navLabel: "Currículo",
    navigationPaths: {
      experience: "/pt-BR/experiencia",
      contact: "/pt-BR/contato",
      about: "/pt-BR/sobre",
    },
    alternates: {
      en: "/en/resume",
      "pt-BR": "/pt-BR/curriculo",
      "x-default": "/en/resume",
    },
    otherLanguage: { name: "English", path: "/en/resume" },
  },
];

const viewportWidths = [360, 390, 768, 1366, 1440, 1920];

/** Dados pessoais que ficam só no PDF do currículo (RES-RF-11). */
const keptOutOfSite = ["+55", "99395", "São Paulo", "Sao Paulo"];

/** Texto completo do `main`, para as buscas de conteúdo. */
async function mainText(page: Page) {
  return (await page.getByRole("main").textContent()) ?? "";
}

for (const resume of pages) {
  test.describe(`Resume (${resume.locale})`, () => {
    test("tem um h1, a abertura, o h2 do conteúdo e os cinco itens", async ({
      page,
    }) => {
      await page.goto(resume.path);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        resume.h1,
      );
      await expect(page.getByRole("main")).toContainText(resume.intro);
      await expect(page.getByRole("heading", { level: 2 })).toHaveText([
        resume.insideHeading,
      ]);
      await expect(page.locator("#resume-inside li")).toHaveText(
        resume.insideItems,
      );
    });

    test("View Resume abre o PDF em nova aba e Download PDF baixa o mesmo arquivo", async ({
      page,
    }) => {
      await page.goto(resume.path);
      const main = page.getByRole("main");
      const view = main.getByRole("link", {
        name: `${resume.view} — PDF ${resume.newTab}`,
      });
      const download = main.getByRole("link", { name: resume.download });

      await expect(view).toHaveAttribute("href", resumeHref);
      await expect(view).toHaveAttribute("target", "_blank");
      await expect(view).toHaveAttribute("rel", "noopener noreferrer");
      await expect(view).toHaveAttribute("hreflang", "en");
      await expect(view).not.toHaveAttribute("download", /.*/);

      await expect(download).toHaveAttribute("href", resumeHref);
      await expect(download).toHaveAttribute(
        "download",
        fileNameOf(resumeHref),
      );
      await expect(download).toHaveAttribute("hreflang", "en");
      await expect(download).not.toHaveAttribute("target", /.*/);
    });

    test("os botões não têm (EN) e o aviso de idioma só aparece em pt-BR", async ({
      page,
    }) => {
      await page.goto(resume.path);
      const main = page.getByRole("main");

      for (const label of [resume.view, resume.download]) {
        const link = main.getByRole("link", { name: new RegExp(`^${label}`) });
        await expect(link).not.toContainText("(EN)");
        await expect(link).not.toHaveAttribute("lang", /.*/);
      }

      if (resume.notice) {
        await expect(main).toContainText(resume.notice);
      } else {
        const text = await mainText(page);
        expect(text).not.toContain("available in English only");
        expect(text).not.toContain("disponível apenas em inglês");
      }
    });

    test("os dados do arquivo são uma lista de descrição com formato, idioma, data e tamanho", async ({
      page,
    }) => {
      await page.goto(resume.path);
      const terms = page.locator("main dl dt");
      const values = page.locator("main dl dd");

      await expect(terms).toHaveText(resume.details.labels);
      await expect(values.nth(0)).toHaveText("PDF");
      await expect(values.nth(1)).toHaveText(resume.details.language);
      expect(((await values.nth(2).textContent()) ?? "").trim()).toMatch(
        resume.details.updatedPattern,
      );
      await expect(values.nth(3)).toHaveText(
        formatFileSize(statSync(resumeFile).size, resume.locale),
      );
    });

    test("os links finais levam a Experience e Contact na mesma aba", async ({
      page,
    }) => {
      await page.goto(resume.path);
      const main = page.getByRole("main");

      const experience = main.getByRole("link", {
        name: resume.links.experience,
      });
      await expect(experience).not.toHaveAttribute("target", /.*/);
      await expect(experience).toHaveAttribute(
        "href",
        resume.navigationPaths.experience,
      );
      await expect(
        main.getByRole("link", { name: resume.links.contact }),
      ).toHaveAttribute("href", resume.navigationPaths.contact);

      await experience.click();
      await expect(page).toHaveURL(
        new RegExp(`${resume.navigationPaths.experience}/?$`),
      );
    });

    test("o botão do header leva à página, na mesma aba, sem (EN) e com aria-current nela", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(resume.navigationPaths.about);
      const header = page.getByRole("banner");
      const button = header.getByRole("link", {
        name: resume.navLabel,
        exact: true,
      });

      await expect(button).toHaveAttribute("href", resume.path);
      await expect(button).not.toHaveAttribute("target", /.*/);
      await expect(button).not.toHaveAttribute("lang", /.*/);
      await expect(button).not.toHaveAttribute("aria-current", /.*/);
      await expect(header).not.toContainText("(EN)");

      await button.click();
      await expect(page).toHaveURL(new RegExp(`${resume.path}/?$`));
      await expect(
        page
          .getByRole("banner")
          .getByRole("link", { name: resume.navLabel, exact: true }),
      ).toHaveAttribute("aria-current", "page");
    });

    test("no menu mobile, o botão leva à página e o menu fecha", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(resume.navigationPaths.about);
      await page.getByRole("button", { name: /menu/i }).click();

      const menu = page.locator("#mobile-menu");
      const button = menu.getByRole("link", {
        name: resume.navLabel,
        exact: true,
      });
      await expect(button).toBeVisible();
      await expect(button).toHaveAttribute("href", resume.path);
      await expect(button).not.toHaveAttribute("target", /.*/);

      await button.click();
      await expect(page).toHaveURL(new RegExp(`${resume.path}/?$`));
      await expect(menu).toBeHidden();
      await expect(
        page.getByRole("heading", { level: 1, name: resume.h1 }),
      ).toBeVisible();
    });

    test("define metadados indexáveis para o idioma", async ({ page }) => {
      await page.goto(resume.path);

      await expect(page.locator("html")).toHaveAttribute("lang", resume.locale);
      await expect(page).toHaveTitle(resume.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        resume.description,
      );
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        resume.openGraphLocale,
      );
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(new URL(canonical ?? "").pathname).toBe(resume.path);

      for (const [hreflang, target] of Object.entries(resume.alternates)) {
        const href = await page
          .locator(`link[rel="alternate"][hreflang="${hreflang}"]`)
          .getAttribute("href");
        expect(new URL(href ?? "").pathname, `hreflang ${hreflang}`).toBe(
          target,
        );
      }
    });

    test("a troca de idioma abre a página equivalente", async ({ page }) => {
      await page.goto(resume.path);
      await page
        .getByRole("link", { name: resume.otherLanguage.name, exact: true })
        .click();
      await expect(page).toHaveURL(
        new RegExp(`${resume.otherLanguage.path}/?$`),
      );
    });

    test("o texto não traz %, telefone, cidade, empresa nem frases de busca de emprego", async ({
      page,
    }) => {
      await page.goto(resume.path);
      const text = `${await mainText(page)}\n${await page.title()}`;

      expect(text).not.toContain("%");
      expect(findPhrases(text, keptOutOfSite)).toEqual([]);
      expect(findPhrases(text, companyNames)).toEqual([]);
      expect(findPhrases(text, forbiddenPhrases)).toEqual([]);
      expect(findPhrases(text, jobSeekingPhrases)).toEqual([]);
    });

    test("o teclado percorre os botões e os links na ordem visual", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(resume.path);

      const stops: string[] = [];
      for (let i = 0; i < 30; i++) {
        await page.keyboard.press("Tab");
        stops.push(
          await page.evaluate(
            () => document.activeElement?.getAttribute("href") ?? "",
          ),
        );
      }

      const view = stops.indexOf(resumeHref);
      const download = stops.indexOf(resumeHref, view + 1);
      // O menu do header e o rodapé também têm esses links: contam só os da página.
      const experience = stops.indexOf(
        resume.navigationPaths.experience,
        download + 1,
      );
      const contact = stops.indexOf(
        resume.navigationPaths.contact,
        experience + 1,
      );

      expect(stops[0]).toBe("#main");
      for (const position of [view, download, experience, contact]) {
        expect(position).toBeGreaterThan(0);
      }
      expect(view).toBeLessThan(download);
      expect(download).toBeLessThan(experience);
      expect(experience).toBeLessThan(contact);
    });

    test("botões e links têm alvo de toque de pelo menos 44 px e foco visível", async ({
      page,
    }) => {
      await page.goto(resume.path);
      const targets = page.getByRole("main").locator("a");

      expect(await targets.count()).toBe(4);
      for (const target of await targets.all()) {
        const box = await target.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

        await target.focus();
        const outline = await target.evaluate(
          (element) => getComputedStyle(element).outlineStyle,
        );
        expect(outline).not.toBe("none");
      }
    });

    test("os títulos não pulam níveis", async ({ page }) => {
      await page.goto(resume.path);
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
        await page.goto(resume.path);

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
      await page.goto(resume.path);
      const lines = await longestLines(page, "main header p");

      expect(lines.length).toBe(1);
      for (const { width, longestLine } of lines) {
        expect(width).toBeLessThanOrEqual(760);
        expect(longestLine).toBeLessThanOrEqual(80);
      }
    });
  });
}

test.describe("PDF do currículo", () => {
  test("responde como PDF, fora dos buscadores e com menos de 1 MB", async ({
    request,
  }) => {
    const response = await request.get(resumeHref);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect(response.headers()["x-robots-tag"]).toContain("noindex");

    const body = await response.body();
    expect(body.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(body.length).toBeLessThan(1024 * 1024);
  });

  test("a página do currículo não é bloqueada além do resto do site", async ({
    request,
  }) => {
    // Só o PDF tem regra própria de noindex; a página segue a regra do ambiente
    // (em localhost, noindex em tudo; indexável em produção, SPEC-013).
    const home = await request.get("/en");
    for (const target of ["/en/resume", "/pt-BR/curriculo"]) {
      const response = await request.get(target);
      expect(response.status()).toBe(200);
      expect(response.headers()["x-robots-tag"]).toBe(
        home.headers()["x-robots-tag"],
      );
    }
  });
});

test.describe("configuração do currículo", () => {
  test("o arquivo existe e a data de atualização é válida", () => {
    const { href, updatedAt } = siteConfig.resume.en;
    expect(href).toBe(resumeHref);
    expect(existsSync(resumeFile)).toBe(true);

    expect(updatedAt).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    expect(updatedAt <= currentMonth).toBe(true);
  });

  test("a data de atualização não é anterior ao mês de geração do PDF", () => {
    const raw = readFileSync(resumeFile).toString("latin1");
    // O Word grava `/CreationDate` em texto; o Adobe PDF Services só deixa a
    // data no pacote XMP (`xmp:CreateDate`). Vale a primeira que existir.
    const created =
      /\/CreationDate\s*\(D:(\d{4})(\d{2})/.exec(raw) ??
      /<xmp:CreateDate>(\d{4})-(\d{2})/.exec(raw);

    // Sem a data nos metadados não há o que comparar; o PDF novo deve trazê-la.
    expect(created, "o PDF precisa ter a data de criação").not.toBeNull();
    expect(
      siteConfig.resume.en.updatedAt >= `${created?.[1]}-${created?.[2]}`,
    ).toBe(true);
  });

  test("o PDF traz o nome como autor, e não o usuário do computador", () => {
    const raw = readFileSync(resumeFile).toString("latin1");
    const creator = /<dc:creator>([\s\S]*?)<\/dc:creator>/.exec(raw);

    // O autor fica no pacote XMP, em texto, mesmo quando o resto está compactado.
    expect(creator, "o PDF precisa ter dc:creator").not.toBeNull();
    const names = [...(creator?.[1] ?? "").matchAll(/<rdf:li[^>]*>([^<]*)</g)];
    expect(names.map((match) => match[1])).toEqual(["Bruno Lucildo"]);
  });

  test("o PDF de pt-BR, quando existir, passa a ser usado e o aviso deixa de valer", () => {
    expect(hasLocalizedResume("pt-BR")).toBe(false);
    expect(getResumeHref("pt-BR")).toBe(resumeHref);

    const original = siteConfig.resume["pt-BR"];
    siteConfig.resume["pt-BR"] = {
      href: "/documents/resume/bruno-lucildo-resume-pt-BR.pdf",
      updatedAt: "2026-11",
    };
    try {
      expect(hasLocalizedResume("pt-BR")).toBe(true);
      expect(getResumeHref("pt-BR")).toBe(
        "/documents/resume/bruno-lucildo-resume-pt-BR.pdf",
      );
      expect(getResumeHref("en")).toBe(resumeHref);
    } finally {
      if (original) {
        siteConfig.resume["pt-BR"] = original;
      } else {
        delete siteConfig.resume["pt-BR"];
      }
    }
  });
});

test.describe("formatação dos dados do arquivo", () => {
  test("o mês sai de Intl no idioma da página", () => {
    expect(formatResumeMonth("2026-11", "en")).toBe("November 2026");
    expect(formatResumeMonth("2026-11", "pt-BR")).toBe("novembro de 2026");
    expect(formatResumeMonth("2026-01", "en")).toBe("January 2026");
  });

  test("uma data fora do formato AAAA-MM é recusada", () => {
    for (const invalid of ["2026-13", "2026-00", "2026", "11/2026", ""]) {
      expect(() => formatResumeMonth(invalid, "en"), invalid).toThrow();
    }
  });

  test("o tamanho sai em KB e passa para MB a partir de 1 MB", () => {
    expect(formatFileSize(358 * 1024, "en")).toBe("358 KB");
    expect(formatFileSize(1, "en")).toBe("1 KB");
    expect(formatFileSize(1.5 * 1024 * 1024, "en")).toBe("1.5 MB");
    expect(formatFileSize(1.5 * 1024 * 1024, "pt-BR")).toBe("1,5 MB");
  });

  test("o nome do arquivo vem do caminho público", () => {
    expect(fileNameOf(resumeHref)).toBe("bruno-lucildo-resume-en.pdf");
  });
});

test("o código do botão antigo do header foi removido", () => {
  const root = process.cwd();

  for (const file of [
    path.join(root, "src", "components", "layout", "Header.tsx"),
    path.join(root, "src", "components", "layout", "HeaderNav.tsx"),
  ]) {
    const source = readFileSync(file, "utf8");
    expect(source, file).not.toContain("resumeHref");
    expect(source, file).not.toContain("resumeLocalized");
  }

  for (const locale of ["en", "pt-BR"]) {
    const content = JSON.parse(
      readFileSync(
        path.join(root, "src", "content", locale, "common.json"),
        "utf8",
      ),
    );
    expect(content.navigation, locale).not.toHaveProperty("resumeFallback");
  }
});

/**
 * Mede, para cada parágrafo com texto, quantos caracteres cabem na linha mais
 * longa. Só considera blocos cujo primeiro nó é texto com mais de 90 caracteres.
 */
async function longestLines(page: Page, selector: string) {
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
