import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { DetailExperiment } from "@/config/aiLab";
import { socialImageSize } from "@/config/brand";
import { siteConfig } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";

/** Destino de uma página: caminho fixo ou rota dinâmica com seus parâmetros. */
export type AppHref = Parameters<typeof getPathname>[0]["href"];

/** Caminho público da página no idioma informado (ex.: `/pt-BR/sobre`). */
export function localizedPath(locale: Locale, href: AppHref): string {
  return getPathname({ locale, href });
}

/** Canonical e `hreflang` da página equivalente em cada idioma. */
export function localizedAlternates(
  locale: Locale,
  href: AppHref,
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

/**
 * Imagem de compartilhamento do idioma (SPEC-011): o cartão gerado em
 * `[locale]/opengraph-image`, com `alt` traduzido, para `og:image` e para o
 * cartão grande do Twitter. O `metadataBase` do layout torna a URL absoluta.
 */
export async function socialImage(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    url: `${localizedPath(locale, "/")}/opengraph-image`,
    width: socialImageSize.width,
    height: socialImageSize.height,
    alt: t("ogImageAlt"),
  };
}

const openGraphLocale: Record<Locale, string> = {
  en: "en_US",
  "pt-BR": "pt_BR",
};

/**
 * `og:locale` do idioma da página e `og:locale:alternate` com os demais
 * (I18N-RF-06 e I18N-RF-08).
 */
export function openGraphLocales(locale: Locale) {
  return {
    locale: openGraphLocale[locale],
    alternateLocale: routing.locales
      .filter((other) => other !== locale)
      .map((other) => openGraphLocale[other]),
  };
}

const aiLabExperimentPrefix = "aiLab.experiments.";

/** Namespace de um experimento do AI Lab com página de detalhe. */
type AiLabExperimentNamespace =
  `${typeof aiLabExperimentPrefix}${DetailExperiment["key"]}`;

type PageMetadataNamespace =
  | "about.metadata"
  | "experience.metadata"
  | "projects.metadata"
  | "technologies.metadata"
  | "aiLab.metadata"
  | "contact.metadata"
  | "resume.metadata"
  | AiLabExperimentNamespace
  | "projects.detail.football.metadata"
  | "projects.detail.reelix.metadata";

function isAiLabExperimentNamespace(
  namespace: PageMetadataNamespace,
): namespace is AiLabExperimentNamespace {
  return namespace.startsWith(aiLabExperimentPrefix);
}

/** Título e descrição de um experimento: o resumo de uma frase vira a descrição. */
async function aiLabExperimentTexts(
  locale: Locale,
  key: DetailExperiment["key"],
): Promise<{ title: string; description: string }> {
  const t = await getTranslations({ locale, namespace: "aiLab" });
  return {
    title: `${t(`experiments.${key}.name`)} | ${t("title")} | ${siteConfig.name}`,
    description: t(`experiments.${key}.summary`),
  };
}

/**
 * Título e descrição de cada página, lidos do conteúdo. O `switch` mantém as
 * chaves verificadas pelo TypeScript, já que o tipo das traduções não alcança
 * namespaces tão profundos como os dos detalhes de projeto.
 */
async function pageTexts(
  locale: Locale,
  namespace: PageMetadataNamespace,
): Promise<{ title: string; description: string }> {
  if (isAiLabExperimentNamespace(namespace)) {
    return aiLabExperimentTexts(
      locale,
      namespace.slice(aiLabExperimentPrefix.length) as DetailExperiment["key"],
    );
  }

  switch (namespace) {
    case "contact.metadata": {
      const t = await getTranslations({ locale, namespace });
      return { title: t("title"), description: t("description") };
    }
    case "resume.metadata": {
      const t = await getTranslations({ locale, namespace });
      return { title: t("title"), description: t("description") };
    }
    case "aiLab.metadata": {
      const t = await getTranslations({ locale, namespace });
      return { title: t("title"), description: t("description") };
    }
    case "about.metadata": {
      const t = await getTranslations({ locale, namespace });
      return { title: t("title"), description: t("description") };
    }
    case "experience.metadata": {
      const t = await getTranslations({ locale, namespace });
      return { title: t("title"), description: t("description") };
    }
    case "projects.metadata": {
      const t = await getTranslations({ locale, namespace });
      return { title: t("title"), description: t("description") };
    }
    case "technologies.metadata": {
      const t = await getTranslations({ locale, namespace });
      return { title: t("title"), description: t("description") };
    }
    case "projects.detail.football.metadata": {
      const t = await getTranslations({
        locale,
        namespace: "projects.detail.football",
      });
      return {
        title: t("metadata.title"),
        description: t("metadata.description"),
      };
    }
    case "projects.detail.reelix.metadata": {
      const t = await getTranslations({
        locale,
        namespace: "projects.detail.reelix",
      });
      return {
        title: t("metadata.title"),
        description: t("metadata.description"),
      };
    }
  }
}

/**
 * Metadados de uma página implementada: título e descrição do conteúdo,
 * canonical, `hreflang` e Open Graph, indexável.
 */
export async function buildPageMetadata({
  locale,
  href,
  namespace,
}: {
  locale: string;
  href: AppHref;
  namespace: PageMetadataNamespace;
}): Promise<Metadata> {
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const { title, description } = await pageTexts(locale, namespace);
  const image = await socialImage(locale);

  return {
    title,
    description,
    alternates: localizedAlternates(locale, href),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url: localizedPath(locale, href),
      images: [image],
      ...openGraphLocales(locale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
