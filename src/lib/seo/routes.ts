import { experimentsWithDetail } from "@/config/aiLab";
import { projectsWithDetail } from "@/config/projects";
import type { AppHref } from "./metadata";

/** Páginas fixas, uma por entrada do menu mais a Home (SPEC-013, SEO-RF-03). */
const staticPages = [
  "/",
  "/about",
  "/experience",
  "/projects",
  "/technologies",
  "/ai-lab",
  "/contact",
  "/resume",
] as const satisfies readonly AppHref[];

/**
 * Todas as páginas públicas e indexáveis, sem repetir por idioma: a lista vem
 * das mesmas fontes das rotas (`projectsWithDetail` e `experimentsWithDetail`),
 * então uma página nova entra no sitemap sem outra edição.
 */
export function publicPages(): AppHref[] {
  return [
    ...staticPages,
    ...projectsWithDetail.map(
      ({ slug }): AppHref => ({
        pathname: "/projects/[slug]",
        params: { slug },
      }),
    ),
    ...experimentsWithDetail.map(
      ({ slug }): AppHref => ({
        pathname: "/ai-lab/[slug]",
        params: { slug },
      }),
    ),
  ];
}
