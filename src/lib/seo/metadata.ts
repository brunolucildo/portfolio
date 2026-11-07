import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { AppPathname } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";

/** Caminho público da página no idioma informado (ex.: `/pt-BR/sobre`). */
export function localizedPath(locale: Locale, href: AppPathname): string {
  return getPathname({ locale, href });
}

/** Canonical e `hreflang` da página equivalente em cada idioma. */
export function localizedAlternates(
  locale: Locale,
  href: AppPathname,
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localizedPath(locale, href),
    languages: {
      ...Object.fromEntries(
        routing.locales.map((target) => [target, localizedPath(target, href)]),
      ),
      "x-default": localizedPath(routing.defaultLocale, href),
    },
  };
}

type PlaceholderPage =
  | "about"
  | "experience"
  | "projects"
  | "aiLab"
  | "contact";

/**
 * Metadados das páginas provisórias: título próprio, canonical e `hreflang`,
 * e fora dos índices de busca até a SPEC correspondente ser implementada.
 */
export async function buildPlaceholderMetadata({
  locale,
  href,
  page,
}: {
  locale: string;
  href: AppPathname;
  page: PlaceholderPage;
}): Promise<Metadata> {
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "pages" });

  return {
    title: `${t(`${page}.title`)} | ${siteConfig.name}`,
    alternates: localizedAlternates(locale, href),
    robots: { index: false, follow: true },
  };
}
