import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedPath } from "./metadata";
import { publicPages } from "./routes";

/**
 * Entradas do sitemap: uma por página e idioma, com a URL canônica absoluta e
 * as alternativas `hreflang` (`en`, `pt-BR` e `x-default`) iguais às do HTML
 * (SPEC-013, SEO-RF-02). Sem `lastmod`: não há data real de alteração por
 * página (Q4).
 */
export function buildSitemap(siteUrl: string): MetadataRoute.Sitemap {
  const absolute = (path: string) => new URL(path, siteUrl).toString();

  return publicPages().flatMap((href) => {
    const languages = {
      ...Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          absolute(localizedPath(locale, href)),
        ]),
      ),
      "x-default": absolute(localizedPath(routing.defaultLocale, href)),
    };

    return routing.locales.map((locale) => ({
      url: absolute(localizedPath(locale, href)),
      alternates: { languages },
    }));
  });
}
