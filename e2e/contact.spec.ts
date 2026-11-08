import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";
import {
  buildContactChannels,
  displayUrl,
} from "../src/components/contact/channels";
import { siteConfig } from "../src/config/site";
import {
  companyNames,
  findPhrases,
  forbiddenPhrases,
  jobSeekingPhrases,
} from "./support/content-rules";

const email = "bruno.lucsilva@gmail.com";
const linkedinUrl = "https://www.linkedin.com/in/bruno-lucildo/";
const githubUrl = "https://github.com/brunolucildo";
const resumeHref = "/documents/resume/bruno-lucildo-resume-en.pdf";

type ContactPage = {
  locale: "en" | "pt-BR";
  path: string;
  title: string;
  description: string;
  openGraphLocale: string;
  h1: string;
  intro: string;
  headings: string[];
  descriptions: string[];
  actions: {
    email: string;
    linkedin: string;
    github: string;
    resume: string;
  };
  copy: { button: string; copied: string; failed: string };
  newTab: string;
  /** O PDF só existe em inglês: em pt-BR o link avisa e recebe `lang="en"`. */
  resumeLang: "en" | null;
  alternates: Record<string, string>;
  otherLanguage: { name: string; path: string };
  placeholder: string;
};

const pages: ContactPage[] = [
  {
    locale: "en",
    path: "/en/contact",
    title: "Contact | Bruno Lucildo",
    description:
      "How to reach Bruno Lucildo: email, LinkedIn and GitHub, plus the resume.",
    openGraphLocale: "en_US",
    h1: "Contact",
    intro:
      "I enjoy talking about backend engineering, technical leadership, distributed systems and applied AI. These are the best ways to reach me.",
    headings: ["Email", "LinkedIn", "GitHub", "Resume"],
    descriptions: [
      "A direct message, for anything that needs detail.",
      "For professional connections.",
      "Code and projects, in public repositories.",
      "A PDF with my professional history.",
    ],
    actions: {
      email: "Send a Message",
      linkedin: "Connect with Me",
      github: "View on GitHub",
      resume: "View Resume",
    },
    copy: {
      button: "Copy address",
      copied: "Address copied",
      failed: "Could not copy. Select the address instead.",
    },
    newTab: "(opens in a new tab)",
    resumeLang: null,
    alternates: {
      en: "/en/contact",
      "pt-BR": "/pt-BR/contato",
      "x-default": "/en/contact",
    },
    otherLanguage: { name: "Português", path: "/pt-BR/contato" },
    placeholder: "This section is under construction.",
  },
  {
    locale: "pt-BR",
    path: "/pt-BR/contato",
    title: "Contato | Bruno Lucildo",
    description:
      "Como falar com Bruno Lucildo: email, LinkedIn e GitHub, além do currículo.",
    openGraphLocale: "pt_BR",
    h1: "Contato",
    intro:
      "Gosto de conversar sobre engenharia backend, liderança técnica, sistemas distribuídos e IA aplicada. Estes são os melhores caminhos para falar comigo.",
    headings: ["Email", "LinkedIn", "GitHub", "Currículo"],
    descriptions: [
      "Uma mensagem direta, para o que pede mais detalhe.",
      "Para conexões profissionais.",
      "Código e projetos, em repositórios públicos.",
      "Um PDF com a minha trajetória profissional.",
    ],
    actions: {
      email: "Enviar mensagem",
      linkedin: "Conecte-se comigo",
      github: "Ver no GitHub",
      resume: "Ver currículo (EN)",
    },
    copy: {
      button: "Copiar endereço",
      copied: "Endereço copiado",
      failed: "Não foi possível copiar. Selecione o endereço.",
    },
    newTab: "(abre em uma nova aba)",
    resumeLang: "en",
    alternates: {
      en: "/en/contact",
      "pt-BR": "/pt-BR/contato",
      "x-default": "/en/contact",
    },
    otherLanguage: { name: "English", path: "/en/contact" },
    placeholder: "Esta seção está em construção.",
  },
];

const viewportWidths = [360, 390, 768, 1366, 1440, 1920];

/** Dados pessoais que ficam só no PDF do currículo (CON-RF-09). */
const keptOutOfSite = ["+55", "99395", "São Paulo", "Sao Paulo"];

/** Texto completo do `main`, para as buscas de conteúdo. */
async function mainText(page: Page) {
  return (await page.getByRole("main").textContent()) ?? "";
}

for (const contact of pages) {
  test.describe(`Contact (${contact.locale})`, () => {
    test("tem um h1, a abertura e quatro seções na ordem prevista", async ({
      page,
    }) => {
      await page.goto(contact.path);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        contact.h1,
      );
      await expect(page.getByRole("main")).toContainText(contact.intro);
      await expect(page.getByRole("heading", { level: 2 })).toHaveText(
        contact.headings,
      );

      const sections = page.locator("#contact-channels > section");
      await expect(sections).toHaveCount(4);
      for (const [index, description] of contact.descriptions.entries()) {
        await expect(sections.nth(index)).toContainText(description);
      }
      expect(await mainText(page)).not.toContain(contact.placeholder);
    });

    test("a seção de e-mail mostra o endereço, o link mailto e o botão Copiar", async ({
      page,
    }) => {
      await page.goto(contact.path);
      const section = page.locator("#contact-email");

      await expect(section).toContainText(email);
      const link = section.getByRole("link", {
        name: new RegExp(`^${contact.actions.email}`),
      });
      await expect(link).toHaveAttribute("href", `mailto:${email}`);
      await expect(link).not.toHaveAttribute("target", /.*/);
      await expect(
        section.getByRole("button", { name: contact.copy.button }),
      ).toBeVisible();
    });

    test("copiar coloca o endereço na área de transferência e o aviso volta ao normal", async ({
      page,
      context,
    }) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await page.goto(contact.path);
      const status = page.locator("#contact-email").getByRole("status");

      await expect(status).toHaveText("");
      await page.getByRole("button", { name: contact.copy.button }).click();
      await expect(status).toHaveText(contact.copy.copied);
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        email,
      );

      // O aviso some depois de 3 segundos (CON-RF-03).
      await expect(status).toHaveText("", { timeout: 6000 });
    });

    test("se o navegador recusar a cópia, mostra a mensagem e mantém o endereço selecionável", async ({
      page,
    }) => {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: () => Promise.reject(new Error("recusado")),
          },
        });
      });
      await page.goto(contact.path);
      const section = page.locator("#contact-email");

      await section.getByRole("button", { name: contact.copy.button }).click();
      await expect(section.getByRole("status")).toHaveText(contact.copy.failed);
      await expect(section).toContainText(email);

      const userSelect = await section
        .getByText(email, { exact: true })
        .evaluate((element) => getComputedStyle(element).userSelect);
      expect(userSelect).toBe("all");
    });

    test("sem a Clipboard API não há botão, mas o endereço e o link continuam", async ({
      page,
    }) => {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: undefined,
        });
      });
      await page.goto(contact.path);
      const section = page.locator("#contact-email");

      await expect(section).toContainText(email);
      await expect(
        section.getByRole("link", {
          name: new RegExp(`^${contact.actions.email}`),
        }),
      ).toHaveAttribute("href", `mailto:${email}`);
      await expect(section.getByRole("button")).toHaveCount(0);
      await expect(section.getByRole("status")).toHaveCount(0);
    });

    test.describe("sem JavaScript", () => {
      test.use({ javaScriptEnabled: false });

      test("o endereço e o link mailto estão presentes e não há botão", async ({
        page,
      }) => {
        await page.goto(contact.path);
        const section = page.locator("#contact-email");

        await expect(section).toContainText(email);
        await expect(
          section.getByRole("link", {
            name: new RegExp(`^${contact.actions.email}`),
          }),
        ).toHaveAttribute("href", `mailto:${email}`);
        await expect(section.getByRole("button")).toHaveCount(0);
      });
    });

    test("LinkedIn e GitHub mostram o endereço e abrem em nova aba", async ({
      page,
    }) => {
      await page.goto(contact.path);

      const profiles = [
        {
          id: "#contact-linkedin",
          shown: "linkedin.com/in/bruno-lucildo",
          action: contact.actions.linkedin,
          title: "LinkedIn",
          href: linkedinUrl,
        },
        {
          id: "#contact-github",
          shown: "github.com/brunolucildo",
          action: contact.actions.github,
          title: "GitHub",
          href: githubUrl,
        },
      ];

      for (const profile of profiles) {
        const section = page.locator(profile.id);
        await expect(section, profile.title).toContainText(profile.shown);

        const link = section.getByRole("link");
        await expect(link, profile.title).toHaveCount(1);
        await expect(link, profile.title).toHaveAttribute("href", profile.href);
        await expect(link, profile.title).toHaveAttribute("target", "_blank");
        await expect(link, profile.title).toHaveAttribute(
          "rel",
          "noopener noreferrer",
        );
        // O nome do canal e o aviso de nova aba fazem parte do nome acessível.
        await expect(link, profile.title).toHaveAccessibleName(
          `${profile.action} — ${profile.title} ${contact.newTab}`,
        );
      }
    });

    test("o currículo abre o PDF em nova aba, com o rótulo e o idioma do menu", async ({
      page,
    }) => {
      await page.goto(contact.path);
      const link = page.locator("#contact-resume").getByRole("link");

      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute("href", resumeHref);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await expect(link).toHaveAccessibleName(
        `${contact.actions.resume} — ${contact.headings[3]} ${contact.newTab}`,
      );

      if (contact.resumeLang) {
        await expect(link).toHaveAttribute("lang", contact.resumeLang);
      } else {
        await expect(link).not.toHaveAttribute("lang", /.*/);
      }
    });

    test("o PDF do currículo existe", async ({ request }) => {
      const response = await request.get(resumeHref);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("pdf");
    });

    test("não há percentuais, telefone, cidade, empresa, curso nem mensagens de disponibilidade", async ({
      page,
    }) => {
      await page.goto(contact.path);
      const text = `${await mainText(page)}\n${await page.title()}`;

      expect(text).not.toContain("%");
      expect(findPhrases(text, keptOutOfSite)).toEqual([]);
      expect(findPhrases(text, companyNames)).toEqual([]);
      expect(findPhrases(text, ["Coders", "University"])).toEqual([]);
      expect(findPhrases(text, forbiddenPhrases)).toEqual([]);
      expect(findPhrases(text, jobSeekingPhrases)).toEqual([]);
    });

    test("define metadados indexáveis para o idioma", async ({ page }) => {
      await page.goto(contact.path);

      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        contact.locale,
      );
      await expect(page).toHaveTitle(contact.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        contact.description,
      );
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        contact.openGraphLocale,
      );
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(new URL(canonical ?? "").pathname).toBe(contact.path);

      for (const [hreflang, target] of Object.entries(contact.alternates)) {
        const href = await page
          .locator(`link[rel="alternate"][hreflang="${hreflang}"]`)
          .getAttribute("href");
        expect(new URL(href ?? "").pathname, `hreflang ${hreflang}`).toBe(
          target,
        );
      }
    });

    test("a troca de idioma abre a página equivalente", async ({ page }) => {
      await page.goto(contact.path);
      await page
        .getByRole("link", { name: contact.otherLanguage.name, exact: true })
        .click();
      await expect(page).toHaveURL(
        new RegExp(`${contact.otherLanguage.path}/?$`),
      );
    });

    test("o teclado percorre link, botão Copiar e perfis na ordem visual", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(contact.path);

      const stops: string[] = [];
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        stops.push(
          await page.evaluate(() => {
            const active = document.activeElement;
            return (
              active?.getAttribute("href") ??
              `button:${active?.textContent?.trim() ?? ""}`
            );
          }),
        );
      }

      const mailto = stops.indexOf(`mailto:${email}`);
      const copy = stops.indexOf(`button:${contact.copy.button}`);
      const linkedin = stops.indexOf(linkedinUrl);
      const github = stops.indexOf(githubUrl);
      const resume = stops.indexOf(resumeHref, github);

      expect(stops[0]).toBe("#main");
      for (const position of [mailto, copy, linkedin, github, resume]) {
        expect(position).toBeGreaterThan(0);
      }
      expect(mailto).toBeLessThan(copy);
      expect(copy).toBeLessThan(linkedin);
      expect(linkedin).toBeLessThan(github);
      expect(github).toBeLessThan(resume);
    });

    test("links e botão têm alvo de toque de pelo menos 44 px e foco visível", async ({
      page,
    }) => {
      await page.goto(contact.path);
      const targets = page.locator("#contact-channels").locator("a, button");

      expect(await targets.count()).toBe(5);
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

    test("o Hero da Home e o rodapé levam a esta página", async ({ page }) => {
      await page.goto(contact.locale === "en" ? "/en" : "/pt-BR");
      await page
        .getByRole("main")
        .getByRole("link", {
          name: contact.locale === "en" ? "Get in Touch" : "Entrar em contato",
        })
        .first()
        .click();
      await expect(page).toHaveURL(new RegExp(`${contact.path}/?$`));
    });

    test("os títulos não pulam níveis", async ({ page }) => {
      await page.goto(contact.path);
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
        await page.goto(contact.path);

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
      await page.goto(contact.path);
      const lines = await longestLines(page, "main header p");

      expect(lines.length).toBe(1);
      for (const { width, longestLine } of lines) {
        expect(width).toBeLessThanOrEqual(760);
        expect(longestLine).toBeLessThanOrEqual(80);
      }
    });
  });
}

test("a configuração tem os canais e o currículo esperados", () => {
  expect(siteConfig.contact).toEqual({
    email,
    linkedin: linkedinUrl,
    github: githubUrl,
  });
  expect(siteConfig.resume.en.href).toBe(resumeHref);
  expect(existsSync(path.join(process.cwd(), "public", resumeHref))).toBe(true);
});

test("só os canais definidos em siteConfig.contact são montados, na ordem prevista", () => {
  const keys = (contact: Parameters<typeof buildContactChannels>[0]) =>
    buildContactChannels(contact).map((channel) => channel.key);

  expect(keys(siteConfig.contact)).toEqual(["email", "linkedin", "github"]);
  expect(keys({ email })).toEqual(["email"]);
  expect(keys({ github: githubUrl, email })).toEqual(["email", "github"]);
  expect(keys({ linkedin: linkedinUrl })).toEqual(["linkedin"]);
  expect(keys({})).toEqual([]);

  const [mail, linkedin, github] = buildContactChannels(siteConfig.contact);
  expect(mail).toEqual({
    key: "email",
    value: email,
    href: `mailto:${email}`,
    external: false,
  });
  expect(linkedin).toMatchObject({
    value: "linkedin.com/in/bruno-lucildo",
    external: true,
  });
  expect(github).toMatchObject({
    value: "github.com/brunolucildo",
    external: true,
  });
});

test("o endereço público é exibido sem protocolo, www nem barra final", () => {
  expect(displayUrl("https://www.linkedin.com/in/bruno-lucildo/")).toBe(
    "linkedin.com/in/bruno-lucildo",
  );
  expect(displayUrl("https://github.com/brunolucildo")).toBe(
    "github.com/brunolucildo",
  );
});

test("o código provisório foi removido", () => {
  const root = process.cwd();
  expect(
    existsSync(
      path.join(root, "src", "components", "sections", "PagePlaceholder.tsx"),
    ),
  ).toBe(false);

  const metadata = readFileSync(
    path.join(root, "src", "lib", "seo", "metadata.ts"),
    "utf8",
  );
  expect(metadata).not.toContain("buildPlaceholderMetadata");

  for (const locale of ["en", "pt-BR"]) {
    const content = JSON.parse(
      readFileSync(
        path.join(root, "src", "content", locale, "common.json"),
        "utf8",
      ),
    ) as Record<string, unknown>;
    expect(Object.keys(content), locale).not.toContain("pages");
  }
});

/**
 * Mede, em cada parágrafo longo, a largura do elemento e o maior número de
 * caracteres em uma linha (CON-RNF-02). Só considera nós de texto no início.
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
