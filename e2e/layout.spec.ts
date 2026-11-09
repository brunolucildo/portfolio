import { expect, type Page, test } from "@playwright/test";
import { routing } from "../src/i18n/routing";
import { findPhrases, forbiddenPhrases } from "./support/content-rules";

type Locale = (typeof routing.locales)[number];

const primaryBorder = "rgb(183, 243, 107)"; // --color-primary (#b7f36b)
const defaultBorder = "rgb(37, 43, 38)"; // --color-border (#252b26)

const texts: Record<
  Locale,
  {
    home: string;
    items: string[];
    resume: string;
    mainNavigation: string;
    footerNavigation: string;
    openMenu: string;
    closeMenu: string;
    language: string;
    channels: string[];
    otherLanguage: { name: string; home: string };
  }
> = {
  en: {
    home: "/en",
    items: [
      "Home",
      "About",
      "Experience",
      "Projects",
      "Technologies",
      "AI Lab",
      "Contact",
    ],
    resume: "Resume",
    mainNavigation: "Main navigation",
    footerNavigation: "Footer navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    channels: ["Email", "LinkedIn", "GitHub"],
    otherLanguage: { name: "PT, Português", home: "/pt-BR" },
  },
  "pt-BR": {
    home: "/pt-BR",
    items: [
      "Início",
      "Sobre",
      "Experiência",
      "Projetos",
      "Tecnologias",
      "AI Lab",
      "Contato",
    ],
    resume: "Currículo",
    mainNavigation: "Navegação principal",
    footerNavigation: "Navegação do rodapé",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    language: "Idioma",
    channels: ["Email", "LinkedIn", "GitHub"],
    otherLanguage: { name: "EN, English", home: "/en" },
  },
};

/** Caminho público de uma rota fixa no idioma (ex.: `/pt-BR/sobre`). */
function pathFor(locale: Locale, key: string): string {
  const entry = routing.pathnames[key as keyof typeof routing.pathnames];
  const segment = typeof entry === "string" ? entry : entry[locale];
  return segment === "/" ? `/${locale}` : `/${locale}${segment}`;
}

/** Rotas fixas, sem parâmetros: todas passam pelo `SiteShell`. */
const fixedRoutes = Object.keys(routing.pathnames).filter(
  (key) => !key.includes("["),
);

/** Itens da navegação principal, na ordem, com a rota de cada um. */
const navigationRoutes = [
  "/",
  "/about",
  "/experience",
  "/projects",
  "/technologies",
  "/ai-lab",
  "/contact",
];

const viewportWidths = [360, 390, 768, 1024, 1100, 1366, 1440, 1920];
const locales = routing.locales;

/**
 * O WebKit do Playwright no Windows não navega por Tab (o foco fica no `body`),
 * e no Safari de verdade o Tab só alcança links com um ajuste do navegador. Os
 * testes de ordem de teclado rodam em Chromium e Firefox; no Safari, à mão.
 */
const webkitTabNote =
  "O WebKit não navega por Tab; a ordem do teclado é conferida em Chromium e Firefox.";

for (const locale of locales) {
  const t = texts[locale];

  test.describe(`Layout global (${locale})`, () => {
    test("toda rota fixa tem skip link, header, main e footer, com o lang do idioma", async ({
      page,
      browserName,
    }) => {
      for (const key of fixedRoutes) {
        await page.goto(pathFor(locale, key));

        await expect(page.locator("html"), key).toHaveAttribute("lang", locale);
        await expect(page.getByRole("banner"), key).toHaveCount(1);
        await expect(page.getByRole("main"), key).toHaveCount(1);
        await expect(page.locator("main#main"), key).toHaveCount(1);
        await expect(page.getByRole("contentinfo"), key).toHaveCount(1);

        if (browserName !== "webkit") {
          await page.keyboard.press("Tab");
          const first = await page.evaluate(() =>
            document.activeElement?.getAttribute("href"),
          );
          expect(first, key).toBe("#main");
        }
      }
    });

    test("a 404 tem o mesmo cabeçalho e rodapé, no idioma da URL", async ({
      page,
    }) => {
      const response = await page.goto(`/${locale}/nao-existe`);

      expect(response?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
      await expect(page.locator("main#main")).toHaveCount(1);
    });

    test("o cabeçalho desktop tem nome, sete itens na ordem, idioma e Resume", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(t.home);
      const header = page.getByRole("banner");

      await expect(
        header.getByRole("link", { name: "Bruno Lucildo" }),
      ).toHaveAttribute("href", t.home);

      const nav = header.getByRole("navigation", { name: t.mainNavigation });
      await expect(nav.getByRole("link")).toHaveText(t.items);
      const hrefs = await nav
        .getByRole("link")
        .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
      expect(hrefs).toEqual(
        navigationRoutes.map((key) => pathFor(locale, key)),
      );

      await expect(
        header.getByRole("list", { name: t.language }),
      ).toBeVisible();
      await expect(
        header.getByRole("link", { name: t.resume, exact: true }),
      ).toHaveAttribute("href", pathFor(locale, "/resume"));
    });

    test("só o item da seção atual fica ativo, inclusive nas páginas filhas", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      const cases = [
        ...navigationRoutes.map((key, index) => ({
          path: pathFor(locale, key),
          active: index,
        })),
        {
          path: `${pathFor(locale, "/projects")}/reelix`,
          active: navigationRoutes.indexOf("/projects"),
        },
        {
          path: `${pathFor(locale, "/ai-lab")}/rag-grounding`,
          active: navigationRoutes.indexOf("/ai-lab"),
        },
      ];

      for (const { path, active } of cases) {
        const response = await page.goto(path);
        expect(response?.status(), path).toBe(200);

        const nav = page
          .getByRole("banner")
          .getByRole("navigation", { name: t.mainNavigation });
        const current = await nav.getByRole("link").evaluateAll((els) =>
          els
            .map((el, index) => ({
              index,
              current: el.getAttribute("aria-current"),
            }))
            .filter((item) => item.current !== null),
        );

        expect(current, path).toEqual([{ index: active, current: "page" }]);
      }
    });

    test("o botão Resume tem borda primary e aria-current só na página do currículo", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const button = () =>
        page
          .getByRole("banner")
          .getByRole("link", { name: t.resume, exact: true });
      const border = () =>
        button().evaluate((el) => getComputedStyle(el).borderTopColor);

      await page.goto(pathFor(locale, "/about"));
      await expect(button()).not.toHaveAttribute("aria-current", /.*/);
      expect(await border()).toBe(defaultBorder);

      await page.goto(pathFor(locale, "/resume"));
      await expect(button()).toHaveAttribute("aria-current", "page");
      expect(await border()).toBe(primaryBorder);
    });

    test("o menu mobile abre e fecha, com aria-expanded e o rótulo do botão", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(pathFor(locale, "/about"));
      const menu = page.locator("#mobile-menu");
      const toggle = page.getByRole("button", { name: t.openMenu });

      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toHaveAttribute("aria-controls", "mobile-menu");
      await expect(menu).toBeHidden();

      await toggle.click();
      const close = page.getByRole("button", { name: t.closeMenu });
      await expect(close).toHaveAttribute("aria-expanded", "true");
      await expect(menu.getByRole("link")).toHaveCount(
        t.items.length + 2 /* idiomas */ + 1 /* Resume */,
      );
      await expect(
        menu.getByRole("link", { name: t.resume, exact: true }),
      ).toBeVisible();
      await expect(menu.getByRole("list", { name: t.language })).toBeVisible();

      await close.click();
      await expect(menu).toBeHidden();
    });

    test("o menu fecha ao acionar o link da página atual, outro link ou o Resume", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      const menu = page.locator("#mobile-menu");
      const open = () => page.getByRole("button", { name: t.openMenu }).click();

      // Link da página em que o visitante já está: a rota não muda.
      await page.goto(pathFor(locale, "/about"));
      await open();
      await menu.getByRole("link", { name: t.items[1], exact: true }).click();
      await expect(menu).toBeHidden();
      await expect(page).toHaveURL(
        new RegExp(`${pathFor(locale, "/about")}/?$`),
      );

      // Outro link: a página muda.
      await open();
      await menu.getByRole("link", { name: t.items[2], exact: true }).click();
      await expect(page).toHaveURL(
        new RegExp(`${pathFor(locale, "/experience")}/?$`),
      );
      await expect(menu).toBeHidden();

      // Resume, e depois o mesmo botão já na página do currículo.
      await open();
      await menu.getByRole("link", { name: t.resume, exact: true }).click();
      await expect(page).toHaveURL(
        new RegExp(`${pathFor(locale, "/resume")}/?$`),
      );
      await expect(menu).toBeHidden();
      await open();
      await menu.getByRole("link", { name: t.resume, exact: true }).click();
      await expect(menu).toBeHidden();
    });

    test("trocar o idioma pelo menu mobile leva à página equivalente e fecha o menu", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(pathFor(locale, "/about"));
      await page.getByRole("button", { name: t.openMenu }).click();
      await page
        .locator("#mobile-menu")
        .getByRole("link", { name: t.otherLanguage.name, exact: true })
        .click();

      const other = locale === "en" ? "pt-BR" : "en";
      await expect(page).toHaveURL(
        new RegExp(`${pathFor(other, "/about")}/?$`),
      );
      await expect(page.locator("#mobile-menu")).toBeHidden();
    });

    test("o nome acessível de links e botões contém o texto visível (WCAG 2.5.3)", async ({
      page,
    }) => {
      await page.goto(pathFor(locale, "/about"));

      const mismatches = await page.evaluate(() => {
        const normalize = (text: string) =>
          text.replace(/\s+/g, " ").trim().toLowerCase();

        return [
          ...document.querySelectorAll<HTMLElement>(
            "header a, header button, footer a, main a, main button",
          ),
        ].flatMap((element) => {
          const label = element.getAttribute("aria-label");
          // biome-ignore lint/performance/useDomNodeTextContent: precisa do texto renderizado (o visível), não do conteúdo do nó.
          const visible = normalize(element.innerText);

          if (!label || !visible || normalize(label).includes(visible)) {
            return [];
          }

          return [`"${visible}" não está em "${label}"`];
        });
      });

      expect(mismatches).toEqual([]);
    });

    test("Escape fecha o menu e devolve o foco ao botão", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(pathFor(locale, "/about"));
      await page.getByRole("button", { name: t.openMenu }).click();
      await expect(page.locator("#mobile-menu")).toBeVisible();

      await page.keyboard.press("Escape");

      await expect(page.locator("#mobile-menu")).toBeHidden();
      await expect(
        page.getByRole("button", { name: t.openMenu }),
      ).toBeFocused();
    });

    test("com o menu aberto, passar ao desktop e voltar ao celular o deixa fechado", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(pathFor(locale, "/about"));
      await page.getByRole("button", { name: t.openMenu }).click();
      await expect(page.locator("#mobile-menu")).toBeVisible();

      await page.setViewportSize({ width: 1280, height: 800 });
      // O botão fica oculto no desktop, mas o atributo continua lido. Esperar o
      // fechamento antes de voltar: duas mudanças de largura seguidas podem ser
      // fundidas em um só evento do navegador.
      await expect(
        page.locator('button[aria-controls="mobile-menu"]'),
      ).toHaveAttribute("aria-expanded", "false");
      await page.setViewportSize({ width: 375, height: 812 });

      await expect(page.locator("#mobile-menu")).toBeHidden();
      await expect(
        page.getByRole("button", { name: t.openMenu }),
      ).toHaveAttribute("aria-expanded", "false");
    });

    test("o rodapé tem o nome, o ano, a navegação com o currículo por último e os canais", async ({
      page,
    }) => {
      await page.goto(pathFor(locale, "/about"));
      const footer = page.getByRole("contentinfo");

      await expect(footer).toContainText("Bruno Lucildo");
      await expect(footer).toContainText(`© ${new Date().getFullYear()}`);

      const nav = footer.getByRole("navigation", { name: t.footerNavigation });
      await expect(nav.getByRole("link")).toHaveText([...t.items, t.resume]);
      const hrefs = await nav
        .getByRole("link")
        .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
      expect(hrefs).toEqual([
        ...navigationRoutes.map((key) => pathFor(locale, key)),
        pathFor(locale, "/resume"),
      ]);

      const channels = footer.getByRole("list").last().getByRole("link");
      await expect(channels).toHaveCount(t.channels.length);
      for (const [index, name] of t.channels.entries()) {
        await expect(channels.nth(index)).toContainText(name);
      }
    });

    test("o skip link fica visível ao receber o foco e leva o foco ao main", async ({
      page,
      browserName,
    }) => {
      test.skip(browserName === "webkit", webkitTabNote);
      await page.goto(pathFor(locale, "/contact"));
      await page.keyboard.press("Tab");

      const skip = page.locator('a[href="#main"]');
      await expect(skip).toBeFocused();
      const box = await skip.boundingBox();
      expect(box?.width ?? 0).toBeGreaterThan(40);
      expect(box?.height ?? 0).toBeGreaterThan(20);

      await page.keyboard.press("Enter");
      await expect(page.locator("main#main")).toBeFocused();
    });

    test("o foco nunca fica atrás do cabeçalho fixo", async ({
      page,
      browserName,
    }) => {
      test.skip(browserName === "webkit", webkitTabNote);
      test.slow(browserName !== "chromium");
      await page.setViewportSize({ width: 1440, height: 600 });
      await page.goto(pathFor(locale, "/projects"));

      const obscured: string[] = [];
      const check = async (key: string) => {
        await page.keyboard.press(key);
        await page.waitForTimeout(40);
        const result = await page.evaluate(() => {
          const active = document.activeElement;
          if (!active || active === document.body) return null;
          if (active.closest("header") || active.matches('a[href="#main"]')) {
            return null;
          }
          const top = active.getBoundingClientRect().top;
          const headerBottom = document
            .querySelector("header")
            ?.getBoundingClientRect().bottom;
          return top < (headerBottom ?? 0) - 1
            ? (active.textContent ?? "").trim().slice(0, 40)
            : null;
        });
        if (result !== null) obscured.push(`${key}: ${result}`);
      };

      for (let i = 0; i < 70; i++) await check("Tab");
      for (let i = 0; i < 70; i++) await check("Shift+Tab");

      expect(obscured).toEqual([]);
    });

    test("alvos do cabeçalho e do rodapé têm 44 px ou mais e foco visível, no desktop e no celular", async ({
      page,
      browserName,
    }) => {
      const measure = async (selectorTargets: ReturnType<Page["locator"]>) => {
        const targets = await selectorTargets.all();
        expect(targets.length).toBeGreaterThan(0);

        for (const target of targets) {
          if (!(await target.isVisible())) continue;
          const box = await target.boundingBox();
          const name = (await target.textContent())?.trim() ?? "";
          expect(box?.height ?? 0, name).toBeGreaterThanOrEqual(44);

          // No WebKit, o foco programático não ativa :focus-visible de forma
          // confiável; o contorno do foco no Safari é conferido à mão.
          if (browserName === "webkit") continue;

          await target.focus();
          const outline = await target.evaluate(
            (element) => getComputedStyle(element).outlineStyle,
          );
          expect(outline, name).not.toBe("none");
        }
      };

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(pathFor(locale, "/about"));
      // Firefox e WebKit só mostram o foco (:focus-visible) em foco programático
      // depois de uma interação de teclado, como o Chromium já faz no celular.
      await page.keyboard.press("Shift");
      await measure(page.getByRole("banner").locator("a, button"));
      await measure(page.getByRole("contentinfo").locator("a"));

      // Sem novo `goto` na mesma URL: no Firefox, ele deixa o clique seguinte
      // esperando uma navegação que não termina. O CSS já refaz o layout.
      await page.setViewportSize({ width: 375, height: 812 });
      await page.getByRole("button", { name: t.openMenu }).click();
      // Depois de um clique, o foco programático só mostra o contorno
      // (:focus-visible) se a última interação foi o teclado. No Chromium basta
      // uma tecla modificadora; o Firefox exige uma tecla de navegação.
      await page.keyboard.press(browserName === "firefox" ? "Tab" : "Shift");
      await measure(page.getByRole("banner").locator("a, button"));
      await measure(page.getByRole("contentinfo").locator("a"));
    });

    for (const width of viewportWidths) {
      test(`${width} px: sem rolagem horizontal e sem sobreposição no cabeçalho`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });

        for (const key of ["/", "/contact", "/resume"]) {
          await page.goto(pathFor(locale, key));

          const overflow = await page.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth,
          );
          expect(overflow, key).toBeLessThanOrEqual(0);

          const overlaps = await page.evaluate(() => {
            const boxes = [
              ...document.querySelectorAll(
                "header > div a, header > div button",
              ),
            ]
              .filter((el) => (el as HTMLElement).offsetParent !== null)
              .map((el) => {
                const rect = el.getBoundingClientRect();
                return {
                  text: (el.textContent ?? "").trim(),
                  left: rect.left,
                  right: rect.right,
                  top: rect.top,
                  bottom: rect.bottom,
                };
              });
            const found: string[] = [];
            for (let i = 0; i < boxes.length; i++) {
              for (let j = i + 1; j < boxes.length; j++) {
                const a = boxes[i];
                const b = boxes[j];
                if (!a || !b) continue;
                const horizontal = a.left < b.right - 1 && b.left < a.right - 1;
                const vertical = a.top < b.bottom - 1 && b.top < a.bottom - 1;
                if (horizontal && vertical) found.push(`${a.text} x ${b.text}`);
              }
            }
            return found;
          });
          expect(overlaps, key).toEqual([]);
        }
      });
    }

    test("o cabeçalho e o rodapé não têm mensagens de disponibilidade nem (EN)", async ({
      page,
    }) => {
      await page.goto(t.home);
      const header = (await page.getByRole("banner").textContent()) ?? "";
      const footer = (await page.getByRole("contentinfo").textContent()) ?? "";
      const text = `${header}\n${footer}`;

      expect(findPhrases(text, forbiddenPhrases)).toEqual([]);
      expect(text).not.toContain("(EN)");
    });

    test("os três navs têm nome, e só um dos principais fica visível por vez", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(pathFor(locale, "/about"));

      const main = page.getByRole("navigation", { name: t.mainNavigation });
      await expect(main).toHaveCount(1);
      await expect(
        page.getByRole("navigation", { name: t.footerNavigation }),
      ).toHaveCount(1);

      await page.setViewportSize({ width: 375, height: 812 });
      await expect(main).toHaveCount(0);
      await page.getByRole("button", { name: t.openMenu }).click();
      await expect(main).toHaveCount(1);
    });
  });
}

test("o Resume não entra em mainNavigation: cabeçalho e rodapé o tratam à parte", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/about");

  const mainNav = page
    .getByRole("banner")
    .getByRole("navigation", { name: "Main navigation" });
  await expect(mainNav.getByRole("link", { name: "Resume" })).toHaveCount(0);
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Resume", exact: true }),
  ).toHaveCount(1);
});

test("a ordem do teclado no cabeçalho é nome, itens, idioma e Resume", async ({
  page,
  browserName,
}) => {
  test.skip(browserName === "webkit", webkitTabNote);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/about");

  const stops: string[] = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    stops.push(
      await page.evaluate(
        () => document.activeElement?.getAttribute("href") ?? "",
      ),
    );
  }

  expect(stops).toEqual([
    "#main",
    "/en",
    ...navigationRoutes.map((key) => pathFor("en", key)),
    "/en/about",
    "/pt-BR/sobre",
    "/en/resume",
  ]);
});
