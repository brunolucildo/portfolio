import { expect, type Page, test } from "@playwright/test";
import {
  CLOSING_RATIO,
  createFrameMonitor,
  degrade,
  densityFor,
  isLowCapacity,
  MAX_DEGRADES,
  MIN_NODES,
  nodeCount,
  parallaxModeFor,
  pixelRatioCap,
  SLOW_FRAME_MS,
  SLOW_FRAME_WINDOW,
} from "../src/components/ai-lab/neural/neuralConfig";
import { aiLabExperiments, experimentNumber } from "../src/config/aiLab";
import { findPhrases, jobSeekingPhrases } from "./support/content-rules";

/**
 * SPEC-012: ambiente neural do AI Lab. Textos aprovados em 2026-11-08; os
 * números de densidade e degradação vêm da SPEC (NEU-RF-05 a NEU-RF-08).
 */

type Locale = {
  locale: "en" | "pt-BR";
  path: string;
  detailPath: (slug: string) => string;
  hero: { headline: string; description: string; cta: string };
  philosophy: {
    title: string;
    items: { title: string; text: string }[];
  };
  experiments: {
    title: string;
    filters: { all: string; experiments: string; research: string };
    showing: string;
    of: string;
    featured: string;
  };
  log: { title: string; context: string; learned: string; read: string };
  closing: string;
};

const locales: Locale[] = [
  {
    locale: "en",
    path: "/en/ai-lab",
    detailPath: (slug) => `/en/ai-lab/${slug}`,
    hero: {
      headline: "Exploring the intelligence behind the code.",
      description:
        "Experiments, research and ideas exploring the possibilities of artificial intelligence.",
      cta: "Explore experiments",
    },
    philosophy: {
      title: "The philosophy",
      items: [
        {
          title: "Explore",
          text: "Investigate models and emerging technologies.",
        },
        {
          title: "Experiment",
          text: "Test ideas, architectures and techniques.",
        },
        {
          title: "Understand",
          text: "Learn from results, failures and discoveries.",
        },
      ],
    },
    experiments: {
      title: "Experiments & Research",
      filters: { all: "All", experiments: "Experiments", research: "Research" },
      showing: "Showing",
      of: "of",
      featured: "Featured experiment",
    },
    log: {
      title: "Research log",
      context: "Context",
      learned: "What I learned",
      read: "Read the experiment",
    },
    closing: "Curiosity never stops.",
  },
  {
    locale: "pt-BR",
    path: "/pt-BR/ai-lab",
    detailPath: (slug) => `/pt-BR/ai-lab/${slug}`,
    hero: {
      headline: "Explorando a inteligência por trás do código.",
      description:
        "Experimentos, pesquisa e ideias que exploram as possibilidades da inteligência artificial.",
      cta: "Explorar experimentos",
    },
    philosophy: {
      title: "A filosofia",
      items: [
        {
          title: "Explorar",
          text: "Investigar modelos e tecnologias emergentes.",
        },
        {
          title: "Experimentar",
          text: "Testar ideias, arquiteturas e técnicas.",
        },
        {
          title: "Entender",
          text: "Aprender com resultados, falhas e descobertas.",
        },
      ],
    },
    experiments: {
      title: "Experimentos e pesquisa",
      filters: {
        all: "Todos",
        experiments: "Experimentos",
        research: "Pesquisa",
      },
      showing: "Mostrando",
      of: "de",
      featured: "Experimento em destaque",
    },
    log: {
      title: "Registro de pesquisa",
      context: "Contexto",
      learned: "O que aprendi",
      read: "Ler o experimento",
    },
    closing: "A curiosidade não para.",
  },
];

const tileCount = aiLabExperiments.length;
const detailCount = aiLabExperiments.filter((item) => item.slug).length;
const heroNetwork = '[data-neural-variant="hero"]';
const closingNetwork = '[data-neural-variant="closing"]';

/** Espera a rede terminar de iniciar (canvas animado ou quadro estático). */
async function ready(page: Page, selector: string, state = "running") {
  await expect(page.locator(selector)).toHaveAttribute(
    "data-neural-state",
    state,
  );
}

/** Quantidade de pixels pintados no canvas da rede. */
function paintedPixels(page: Page, selector: string) {
  return page.evaluate((root) => {
    const canvas = document.querySelector<HTMLCanvasElement>(`${root} canvas`);
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return -1;
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let painted = 0;
    for (let i = 3; i < data.length; i += 4) if ((data[i] ?? 0) > 0) painted++;
    return painted;
  }, selector);
}

function snapshot(page: Page, selector: string) {
  return page.evaluate(
    (root) =>
      document
        .querySelector<HTMLCanvasElement>(`${root} canvas`)
        ?.toDataURL() ?? "",
    selector,
  );
}

test.describe("regras puras da rede (NEU-RF-05 a NEU-RF-08)", () => {
  test("a densidade é 90, 56 e 32 nós por faixa de largura", () => {
    expect([1920, 1440, 1024].map(densityFor)).toEqual([90, 90, 90]);
    expect([1023, 800, 768].map(densityFor)).toEqual([56, 56, 56]);
    expect([767, 390, 320].map(densityFor)).toEqual([32, 32, 32]);
  });

  test("o parallax é completo no desktop, só de scroll no tablet e desligado no celular", () => {
    expect(parallaxModeFor(1440)).toBe("full");
    expect(parallaxModeFor(1024)).toBe("full");
    expect(parallaxModeFor(1023)).toBe("scroll");
    expect(parallaxModeFor(768)).toBe("scroll");
    expect(parallaxModeFor(767)).toBe("off");
    expect(parallaxModeFor(390)).toBe("off");
  });

  test("o encerramento usa 40% dos nós do Hero e aparelhos fracos começam na densidade do tablet", () => {
    expect(CLOSING_RATIO).toBe(0.4);
    expect(nodeCount("hero", 1440)).toBe(90);
    expect(nodeCount("closing", 1440)).toBe(36);
    expect(nodeCount("hero", 800)).toBe(56);
    expect(nodeCount("closing", 390)).toBe(13);

    for (const weak of [
      { hardwareConcurrency: 4 },
      { deviceMemory: 4 },
      { saveData: true },
    ]) {
      expect(isLowCapacity(weak)).toBe(true);
      expect(nodeCount("hero", 1440, weak)).toBe(56);
      expect(nodeCount("closing", 1440, weak)).toBe(22);
    }
    const strong = { hardwareConcurrency: 8, deviceMemory: 8 };
    expect(isLowCapacity(strong)).toBe(false);
    expect(isLowCapacity({})).toBe(false);
    expect(nodeCount("hero", 1440, strong)).toBe(90);
    // O celular já está abaixo da densidade do tablet: não muda.
    expect(nodeCount("hero", 390, { saveData: true })).toBe(32);
  });

  test("a degradação reduz 30% dos nós, nunca abaixo de 20", () => {
    expect(MIN_NODES).toBe(20);
    expect(MAX_DEGRADES).toBe(2);
    expect(degrade(90)).toBe(63);
    expect(degrade(63)).toBe(44);
    expect(degrade(32)).toBe(22);
    expect(degrade(22)).toBe(20);
    expect(degrade(20)).toBe(20);
    expect(degrade(13)).toBe(20);
  });

  test("o monitor só decide depois de 90 quadros e usa a média acima de 22 ms", () => {
    expect(SLOW_FRAME_MS).toBe(22);
    expect(SLOW_FRAME_WINDOW).toBe(90);

    const slow = createFrameMonitor();
    for (let i = 0; i < 89; i++) expect(slow.push(40)).toBe("collecting");
    expect(slow.push(40)).toBe("slow");

    const fast = createFrameMonitor();
    for (let i = 0; i < 89; i++) fast.push(16.7);
    expect(fast.push(16.7)).toBe("ok");

    // Média exatamente no limite não degrada; um pouco acima, sim.
    const limit = createFrameMonitor();
    for (let i = 0; i < 89; i++) limit.push(22);
    expect(limit.push(22)).toBe("ok");
    const over = createFrameMonitor();
    for (let i = 0; i < 89; i++) over.push(22.1);
    expect(over.push(22.1)).toBe("slow");

    // Uma janela nova começa do zero e `reset` descarta o que foi medido.
    const again = createFrameMonitor();
    for (let i = 0; i < 90; i++) again.push(40);
    expect(again.push(10)).toBe("collecting");
    again.reset();
    for (let i = 0; i < 89; i++) expect(again.push(40)).toBe("collecting");
  });

  test("a resolução do canvas é limitada a 2x no desktop e 1,5x no celular", () => {
    expect(pixelRatioCap(1440)).toBe(2);
    expect(pixelRatioCap(1024)).toBe(2);
    expect(pixelRatioCap(1023)).toBe(1.5);
    expect(pixelRatioCap(390)).toBe(1.5);
  });
});

test("o destaque e a numeração EXP seguem a ordem da lista", () => {
  expect(aiLabExperiments.filter((item) => item.featured)).toHaveLength(1);
  expect(aiLabExperiments[0]?.featured).toBe(true);
  expect(aiLabExperiments.map((item) => experimentNumber(item.key))).toEqual([
    "EXP / 001",
    "EXP / 002",
    "EXP / 003",
    "EXP / 004",
    "EXP / 005",
    "EXP / 006",
    "EXP / 007",
    "EXP / 008",
  ]);
});

for (const lab of locales) {
  test.describe(`AI Lab neural (${lab.locale})`, () => {
    test("as cinco seções aparecem na ordem prevista, com os textos aprovados", async ({
      page,
    }) => {
      await page.goto(lab.path);
      const main = page.getByRole("main");

      await expect(main.getByRole("heading", { level: 2 })).toHaveText([
        lab.philosophy.title,
        lab.experiments.title,
        lab.log.title,
        lab.closing,
      ]);
      await expect(main).toContainText(lab.hero.description);
      await expect(
        main.getByRole("link", { name: lab.hero.cta, exact: true }),
      ).toHaveAttribute("href", "#experiments");

      await expect(
        page.locator("#philosophy").getByRole("heading", { level: 3 }),
      ).toHaveText(lab.philosophy.items.map((item) => item.title));
      for (const item of lab.philosophy.items) {
        await expect(page.locator("#philosophy")).toContainText(item.text);
      }
    });

    test("o CTA leva à seção de experimentos", async ({ page }) => {
      await page.goto(lab.path);
      await page.getByRole("link", { name: lab.hero.cta, exact: true }).click();

      await expect(page).toHaveURL(/#experiments$/);
      await expect(page.locator("#experiments")).toBeInViewport();
    });

    test("a filosofia usa três blocos com marca gráfica, não cards", async ({
      page,
    }) => {
      await page.goto(lab.path);
      const marks = page.locator("#philosophy svg");

      await expect(marks).toHaveCount(3);
      for (const mark of await marks.all()) {
        await expect(mark).toHaveAttribute("aria-hidden", "true");
      }
      await expect(page.locator("#philosophy .neural-tile")).toHaveCount(0);
    });

    test("o destaque é o primeiro experimento e a numeração EXP aparece nos itens", async ({
      page,
    }) => {
      await page.goto(lab.path);
      const tiles = page.locator("#ai-lab-list > li");

      await expect(tiles).toHaveCount(tileCount);
      await expect(
        page.locator("#ai-lab-list > li[data-featured]"),
      ).toHaveCount(1);
      await expect(tiles.first()).toHaveAttribute("data-featured", "true");
      await expect(tiles.first()).toContainText(lab.experiments.featured);

      for (const [index, item] of aiLabExperiments.entries()) {
        await expect(tiles.nth(index)).toContainText(
          experimentNumber(item.key),
        );
      }
    });

    test("o destaque é maior que os demais itens", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(lab.path);
      const tiles = page.locator("#ai-lab-list > li");
      const featured = await tiles.first().boundingBox();
      const other = await tiles.nth(2).boundingBox();

      expect(featured?.width ?? 0).toBeGreaterThan(other?.width ?? 0);
      expect(featured?.height ?? 0).toBeGreaterThan(other?.height ?? 0);
    });

    test("os filtros mostram só as categorias existentes e filtram sem recarregar", async ({
      page,
    }) => {
      await page.goto(lab.path);
      await page.evaluate(() => {
        (window as unknown as { marker: string }).marker = "same-page";
      });

      const filters = page.getByRole("group", {
        name: /filter|filtrar/i,
      });
      const buttons = filters.getByRole("button");
      const status = page.getByRole("status");
      const visible = page.locator("#ai-lab-list > li:visible");
      const { all, experiments, research } = lab.experiments.filters;

      await expect(buttons).toHaveText([all, experiments, research]);
      await expect(buttons.first()).toHaveAttribute("aria-pressed", "true");
      await expect(visible).toHaveCount(tileCount);
      await expect(status).toHaveText(
        `${lab.experiments.showing} 8 ${lab.experiments.of} 8`,
      );

      await buttons.nth(1).click();
      await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true");
      await expect(buttons.first()).toHaveAttribute("aria-pressed", "false");
      await expect(visible).toHaveCount(2);
      await expect(status).toHaveText(
        `${lab.experiments.showing} 2 ${lab.experiments.of} 8`,
      );

      await buttons.nth(2).click();
      await expect(visible).toHaveCount(6);
      await expect(status).toHaveText(
        `${lab.experiments.showing} 6 ${lab.experiments.of} 8`,
      );

      await buttons.first().click();
      await expect(visible).toHaveCount(tileCount);

      expect(
        await page.evaluate(
          () => (window as unknown as { marker: string }).marker,
        ),
      ).toBe("same-page");
    });

    test("cada filtro mostra os itens do tipo certo, na ordem original", async ({
      page,
    }) => {
      await page.goto(lab.path);
      const buttons = page.getByRole("group", { name: /filter|filtrar/i });
      const types = (selector: string) =>
        page.locator(`${selector} .neural-tile`).count();

      await buttons.getByRole("button").nth(1).click();
      const proof = await page
        .locator("#ai-lab-list > li:visible")
        .evaluateAll((items) =>
          items.map((item) => item.getAttribute("data-filter")),
        );
      expect(proof).toEqual(["experiments", "experiments"]);

      await buttons.getByRole("button").nth(2).click();
      const research = await page
        .locator("#ai-lab-list > li:visible")
        .evaluateAll((items) =>
          items.map((item) => item.getAttribute("data-filter")),
        );
      expect(research).toEqual(Array(6).fill("research"));
      expect(await types("#ai-lab-list > li:visible")).toBe(6);

      // Os itens escondidos continuam no HTML e saem da ordem de tabulação.
      await expect(page.locator("#ai-lab-list > li")).toHaveCount(tileCount);
      await expect(page.locator("#ai-lab-list > li[hidden]")).toHaveCount(2);
    });

    test("os filtros funcionam pelo teclado e têm alvo de toque de 44 px", async ({
      page,
    }) => {
      await page.goto(lab.path);
      const buttons = page
        .getByRole("group", { name: /filter|filtrar/i })
        .getByRole("button");

      for (const button of await buttons.all()) {
        const box = await button.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }

      await buttons.nth(1).focus();
      await page.keyboard.press("Enter");
      await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator("#ai-lab-list > li:visible")).toHaveCount(2);

      await buttons.nth(2).focus();
      await page.keyboard.press("Space");
      await expect(page.locator("#ai-lab-list > li:visible")).toHaveCount(6);

      const outline = await buttons
        .first()
        .evaluate((el) => (el as HTMLElement).focus())
        .then(() =>
          buttons.first().evaluate((el) => getComputedStyle(el).outlineStyle),
        );
      expect(outline).not.toBe("none");
    });

    test("o Research Log lista os experimentos com detalhe, sem datas", async ({
      page,
    }) => {
      await page.goto(lab.path);
      const items = page.locator("#research-log ol > li");
      const tiles = page.locator("#ai-lab-list > li");

      await expect(items).toHaveCount(detailCount);

      for (let index = 0; index < detailCount; index++) {
        const item = items.nth(index);
        const tile = tiles.nth(index);
        const item0 = aiLabExperiments[index];

        await expect(item.getByRole("heading", { level: 3 })).toHaveText(
          (await tile.getByRole("heading", { level: 3 }).textContent()) ?? "",
        );
        await expect(item).toContainText(
          experimentNumber(item0?.key ?? "ragGrounding"),
        );
        await expect(item).toContainText(`${lab.log.context}:`);
        await expect(item).toContainText(`${lab.log.learned}:`);
        await expect(
          item.getByRole("link", { name: new RegExp(`^${lab.log.read}`) }),
        ).toHaveAttribute("href", lab.detailPath(item0?.slug ?? ""));
      }

      const text = (await page.locator("#research-log").textContent()) ?? "";
      expect(text).not.toMatch(/\b(19|20)\d{2}\b/);
      expect(text).not.toMatch(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/);
    });

    test("o Research Log revela os registros no scroll e os deixa visíveis sem movimento", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(lab.path);
      const list = page.locator("#research-log ol");
      const last = page.locator("#research-log ol > li").last();

      await expect(list).toHaveAttribute("data-revealing", "true");
      await expect(last).toHaveCSS("opacity", "0");

      await last.scrollIntoViewIfNeeded();
      await expect(last).toHaveAttribute("data-visible", "true");
      await expect(last).toHaveCSS("opacity", "1");
    });

    test("com movimento reduzido nada fica escondido e as animações param", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(lab.path);

      await expect(page.locator("#research-log ol")).not.toHaveAttribute(
        "data-revealing",
        "true",
      );
      for (const item of await page.locator("#research-log ol > li").all()) {
        await expect(item).toHaveCSS("opacity", "1");
      }
      for (const mark of await page
        .locator("#philosophy svg *[class*='neural-mark-']")
        .all()) {
        await expect(mark).toHaveCSS("animation-name", "none");
      }
    });

    test("os links do Research Log têm alvo de toque de 44 px", async ({
      page,
    }) => {
      await page.goto(lab.path);
      for (const link of await page
        .locator("#research-log")
        .getByRole("link")
        .all()) {
        const box = await link.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }
    });

    test("os textos novos não têm percentuais nem expressões de busca de emprego", async ({
      page,
    }) => {
      await page.goto(lab.path);
      const text = (await page.getByRole("main").textContent()) ?? "";

      expect(text).not.toContain("%");
      expect(findPhrases(text, jobSeekingPhrases)).toEqual([]);
    });

    test("o detalhe mostra o identificador EXP do experimento", async ({
      page,
    }) => {
      for (const [index, item] of aiLabExperiments.entries()) {
        if (!item.slug) continue;
        await page.goto(lab.detailPath(item.slug));

        await expect(
          page.getByRole("main").locator("header"),
          item.slug,
        ).toContainText(`EXP / ${String(index + 1).padStart(3, "0")}`);
      }
    });
  });
}

test.describe("rede neural: estado, densidade e interação", () => {
  test("no desktop o Hero roda com 90 nós, parallax completo e o encerramento com 36", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/ai-lab");
    await ready(page, heroNetwork);

    const hero = page.locator(heroNetwork);
    await expect(hero).toHaveAttribute("data-neural-nodes", "90");
    await expect(hero).toHaveAttribute("data-neural-parallax", "full");
    await expect(hero).toHaveAttribute("data-neural-degraded", "0");
    await expect(page.locator(closingNetwork)).toHaveAttribute(
      "data-neural-nodes",
      "36",
    );
    expect(await paintedPixels(page, heroNetwork)).toBeGreaterThan(0);
  });

  test("no tablet a rede tem 56 nós e só parallax de scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    await page.goto("/en/ai-lab");
    await ready(page, heroNetwork);

    const hero = page.locator(heroNetwork);
    await expect(hero).toHaveAttribute("data-neural-nodes", "56");
    await expect(hero).toHaveAttribute("data-neural-parallax", "scroll");
  });

  test("no celular a rede tem 32 nós e o parallax fica desligado", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/ai-lab");
    await ready(page, heroNetwork);

    const hero = page.locator(heroNetwork);
    await expect(hero).toHaveAttribute("data-neural-nodes", "32");
    await expect(hero).toHaveAttribute("data-neural-parallax", "off");
    await expect(page.locator(closingNetwork)).toHaveAttribute(
      "data-neural-nodes",
      "13",
    );

    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(300);
    expect(
      await hero.evaluate((el) =>
        (el as HTMLElement).style.getPropertyValue("--neural-shift"),
      ),
    ).toBe("");
  });

  test("a rede reinicia com a densidade da nova faixa ao redimensionar", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/ai-lab");
    await ready(page, heroNetwork);
    await expect(page.locator(heroNetwork)).toHaveAttribute(
      "data-neural-nodes",
      "90",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator(heroNetwork)).toHaveAttribute(
      "data-neural-nodes",
      "32",
    );
    await ready(page, heroNetwork);
  });

  test("a rede anima enquanto está visível e pára fora da tela", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/ai-lab");
    await ready(page, heroNetwork);

    const before = await snapshot(page, heroNetwork);
    await expect
      .poll(() => snapshot(page, heroNetwork), { timeout: 3000 })
      .not.toBe(before);

    await page.evaluate(() =>
      document.querySelector("#research-log")?.scrollIntoView(),
    );
    await page.waitForTimeout(600);
    const paused = await snapshot(page, heroNetwork);
    await page.waitForTimeout(600);
    expect(await snapshot(page, heroNetwork)).toBe(paused);
  });

  test("o cursor sobre o Hero ativa a interação e a saída a desativa", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/ai-lab");
    await ready(page, heroNetwork);
    const hero = page.locator(heroNetwork);

    await expect(hero).toHaveAttribute("data-neural-pointer", "idle");
    await page.mouse.move(1000, 400);
    await page.mouse.move(1010, 410);
    await expect(hero).toHaveAttribute("data-neural-pointer", "active");

    await page.mouse.move(1010, 1500).catch(() => undefined);
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.mouse.move(700, 300);
    await expect(hero).toHaveAttribute("data-neural-pointer", "idle");
  });

  test("o scroll move a camada da rede no desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/ai-lab");
    await ready(page, heroNetwork);

    const shift = () =>
      page.locator(heroNetwork).evaluate((el) => {
        const value = (el as HTMLElement).style.getPropertyValue(
          "--neural-shift",
        );
        return value === "" ? Number.NaN : Number.parseFloat(value);
      });

    await expect.poll(shift).not.toBeNaN();
    const top = await shift();
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect.poll(shift).toBeGreaterThan(top + 20);
  });

  test("o encerramento mostra a rede também no fim da página", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/ai-lab");
    await page.locator("#closing").scrollIntoViewIfNeeded();
    await ready(page, closingNetwork);

    await expect
      .poll(() => paintedPixels(page, closingNetwork))
      .toBeGreaterThan(500);

    // O parallax é relativo à seção: a camada não sai do encerramento.
    const shift = await page
      .locator(closingNetwork)
      .evaluate((el) =>
        Number.parseFloat(
          (el as HTMLElement).style.getPropertyValue("--neural-shift") || "0",
        ),
      );
    expect(Math.abs(shift)).toBeLessThan(200);
  });

  test("com movimento reduzido a rede é um quadro estático", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/ai-lab");
    await ready(page, heroNetwork, "static");

    expect(await paintedPixels(page, heroNetwork)).toBeGreaterThan(0);
    const first = await snapshot(page, heroNetwork);
    await page.mouse.move(900, 400);
    await page.waitForTimeout(700);
    expect(await snapshot(page, heroNetwork)).toBe(first);
    expect(
      await page
        .locator(heroNetwork)
        .evaluate((el) =>
          (el as HTMLElement).style.getPropertyValue("--neural-shift"),
        ),
    ).toBe("");
  });

  test("sem contexto 2D o desenho estático continua visível", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = () => null;
    });
    await page.goto("/en/ai-lab");

    await expect(page.locator(heroNetwork)).toHaveAttribute(
      "data-neural-state",
      "fallback",
    );
    await expect(page.locator(`${heroNetwork} svg`)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("a rede degrada quando os quadros ficam lentos", async ({ page }) => {
    test.slow();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/ai-lab");
    await ready(page, heroNetwork);

    // Bloqueia a thread principal por 70 ms a cada 100 ms: quadros lentos, mas
    // abaixo dos 250 ms que o app descarta como pausa. Emular uma CPU mais lenta
    // dependia da máquina: com ela disputada, os quadros passavam de 250 ms e a
    // rede nunca degradava.
    await page.evaluate(() => {
      (window as unknown as { __stress?: number }).__stress =
        window.setInterval(() => {
          const end = performance.now() + 70;
          while (performance.now() < end) {
            // espera ocupada
          }
        }, 100);
    });

    await expect
      .poll(
        async () =>
          Number(
            await page
              .locator(heroNetwork)
              .getAttribute("data-neural-degraded"),
          ),
        { timeout: 50_000, intervals: [1000] },
      )
      .toBeGreaterThanOrEqual(1);

    await page.evaluate(() => {
      window.clearInterval(
        (window as unknown as { __stress?: number }).__stress,
      );
    });
  });

  test("ao sair da página os ouvintes da rede são removidos", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const active = new Map<string, number>();
      const key = (target: EventTarget, type: string) =>
        `${target === window ? "window" : target === document ? "document" : "node"}:${type}`;
      const watched = new Set(["pointermove", "visibilitychange"]);
      const add = EventTarget.prototype.addEventListener;
      const remove = EventTarget.prototype.removeEventListener;

      EventTarget.prototype.addEventListener = function (
        this: EventTarget,
        type: string,
        ...rest: [EventListenerOrEventListenerObject, ...unknown[]]
      ) {
        if (watched.has(type)) {
          const id = key(this, type);
          active.set(id, (active.get(id) ?? 0) + 1);
        }
        return add.call(this, type, ...(rest as [EventListener]));
      } as typeof add;
      EventTarget.prototype.removeEventListener = function (
        this: EventTarget,
        type: string,
        ...rest: [EventListenerOrEventListenerObject, ...unknown[]]
      ) {
        if (watched.has(type)) {
          const id = key(this, type);
          active.set(id, Math.max(0, (active.get(id) ?? 0) - 1));
        }
        return remove.call(this, type, ...(rest as [EventListener]));
      } as typeof remove;
      (
        window as unknown as { __active: () => Record<string, number> }
      ).__active = () => Object.fromEntries(active);
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/ai-lab");
    await ready(page, heroNetwork);
    const during = await page.evaluate(() =>
      (
        window as unknown as { __active: () => Record<string, number> }
      ).__active(),
    );
    expect(during["window:pointermove"]).toBeGreaterThanOrEqual(1);
    expect(during["document:visibilitychange"]).toBeGreaterThanOrEqual(1);

    // Navegação no cliente: a página não recarrega e os componentes desmontam.
    await page
      .getByRole("banner")
      .getByRole("link", { name: "Home", exact: true })
      .click();
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.locator("[data-neural-variant]")).toHaveCount(0);

    const after = await page.evaluate(() =>
      (
        window as unknown as { __active: () => Record<string, number> }
      ).__active(),
    );
    expect(after["window:pointermove"] ?? 0).toBe(0);
    expect(after["document:visibilitychange"] ?? 0).toBe(0);
  });

  test("a luz e a inclinação de um item acompanham o cursor", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/ai-lab");
    const tile = page.locator("#ai-lab-list .neural-tile").nth(2);
    const light = () =>
      tile.evaluate((el) =>
        Number.parseFloat(
          (el as HTMLElement).style.getPropertyValue("--mx") || "NaN",
        ),
      );

    await tile.scrollIntoViewIfNeeded();
    await tile.hover({ position: { x: 40, y: 30 } });
    await expect.poll(light).toBeCloseTo(40, -1);
    await tile.hover({ position: { x: 120, y: 60 } });
    await expect.poll(light).toBeGreaterThan(100);
  });

  test("com movimento reduzido o item não se inclina nem segue o cursor", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/ai-lab");
    const tile = page.locator("#ai-lab-list .neural-tile").nth(2);

    await tile.scrollIntoViewIfNeeded();
    await tile.hover({ position: { x: 60, y: 40 } });
    await page.waitForTimeout(300);
    expect(
      await tile.evaluate((el) =>
        (el as HTMLElement).style.getPropertyValue("--mx"),
      ),
    ).toBe("");
    await expect(tile).toHaveCSS("transform", "none");
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("o conteúdo, o desenho estático e os oito experimentos continuam visíveis", async ({
    page,
  }) => {
    await page.goto("/en/ai-lab");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Exploring the intelligence behind the code.",
    );
    await expect(page.locator(`${heroNetwork} svg`)).toBeVisible();
    await expect(page.locator(heroNetwork)).toHaveAttribute(
      "data-neural-state",
      "fallback",
    );
    await expect(page.locator("#ai-lab-list > li:visible")).toHaveCount(
      tileCount,
    );
    // Sem JavaScript a barra de filtros não aparece (NEU-RF-17).
    await expect(page.getByRole("group")).toHaveCount(0);
    await expect(page.getByRole("status")).toHaveCount(0);
    for (const item of await page.locator("#research-log ol > li").all()) {
      await expect(item).toHaveCSS("opacity", "1");
    }
  });
});
