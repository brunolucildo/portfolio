import type { MetadataRoute } from "next";

/**
 * Regras do `robots.txt` (SPEC-013, SEO-RF-01 e SEO-RF-05). Indexável: tudo
 * liberado, com o endereço do sitemap. Não indexável: tudo bloqueado e sem
 * sitemap. `/documents/` não é bloqueado de propósito: o PDF do currículo já
 * sai com `X-Robots-Tag: noindex`, e bloquear o caminho impediria o robô de ler
 * esse cabeçalho.
 */
export function buildRobots(
  indexable: boolean,
  siteUrl: string,
): MetadataRoute.Robots {
  if (!indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
