import { aiLabExperiments } from "../../src/config/aiLab";
import { projects } from "../../src/config/projects";
import { routing } from "../../src/i18n/routing";

type Locale = (typeof routing.locales)[number];

/** Caminhos públicos esperados, derivados das rotas (e não do sitemap). */
export function expectedPaths(): { locale: Locale; path: string }[] {
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
