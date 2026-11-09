import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { expectedPaths } from "./support/routes";

/**
 * Acessibilidade automatizada (QA.md, seção 6): axe-core com as regras WCAG 2.0,
 * 2.1 e 2.2 níveis A e AA e as boas práticas, em todas as páginas públicas e nas
 * 404, em tela larga e em tela de celular. Ferramenta automática não substitui o
 * teste com leitor de tela; o contraste de texto sobre gradiente e sobre o
 * Canvas, que o axe não decide, está medido no relatório de QA.
 */

const tags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

const pages = [
  ...expectedPaths().map(({ path }) => path),
  "/en/nao-existe",
  "/pt-BR/nao-existe",
];

const viewports = [
  { name: "desktop 1440", width: 1440, height: 900 },
  { name: "mobile 390", width: 390, height: 844 },
];

/** Percorre a página para disparar as revelações por rolagem antes de medir. */
async function scrollThrough(page: Page) {
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );

  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(40);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

test("o conjunto de páginas auditadas é o das 34 páginas públicas e das 2 404", () => {
  expect(pages).toHaveLength(36);
});

for (const viewport of viewports) {
  test.describe(`axe (${viewport.name})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const path of pages) {
      test(`${path} não tem violações WCAG 2.2 AA`, async ({ page }) => {
        await page.goto(path, { waitUntil: "networkidle" });
        await scrollThrough(page);

        const { violations } = await new AxeBuilder({ page })
          .withTags(tags)
          .analyze();

        expect(
          violations.map((violation) => ({
            regra: violation.id,
            impacto: violation.impact,
            nos: violation.nodes.map((node) => node.target.join(" ")),
          })),
        ).toEqual([]);
      });
    }
  });
}

test("o axe acusa os defeitos que o teste promete pegar (controle)", async ({
  page,
}) => {
  await page.goto("/en", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document
      .querySelector("main")
      ?.insertAdjacentHTML(
        "beforeend",
        '<p style="color:#555;background:#444;font-size:14px">baixo contraste</p><img src="/images/hero/bruno-lucildo-portrait.png"><button></button>',
      );
  });

  const { violations } = await new AxeBuilder({ page })
    .withTags(tags)
    .analyze();

  expect(violations.map((violation) => violation.id).sort()).toEqual(
    expect.arrayContaining(["button-name", "color-contrast", "image-alt"]),
  );
});
