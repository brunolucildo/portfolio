import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { localizedPath } from "./metadata";
import { serializeJsonLd } from "./serialize";

type JsonLdData = Record<string, unknown>;

/** Bloco `application/ld+json` com os dados informados. */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD precisa de texto bruto; `serializeJsonLd` escapa o `<`.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

const absolute = (path: string) => new URL(path, siteConfig.url).toString();

/** Perfis públicos do Bruno que aparecem no site (LinkedIn e GitHub). */
function sameAs(): string[] {
  const { linkedin, github } = siteConfig.contact;
  return [linkedin, github].filter((url): url is string => Boolean(url));
}

/**
 * `Person` com o que o site mostra: nome, cargo (o do Hero), descrição da
 * página e perfis. Sem empresa, e-mail, telefone ou métricas (SEO-RF-10).
 */
async function person(
  locale: Locale,
  description: string,
  options: { withImage: boolean },
): Promise<JsonLdData> {
  const t = await getTranslations({ locale, namespace: "home.hero" });

  return {
    "@type": "Person",
    "@id": absolute("/#person"),
    name: siteConfig.name,
    jobTitle: t("eyebrow"),
    url: absolute(localizedPath(locale, "/")),
    description,
    sameAs: sameAs(),
    ...(options.withImage ? { image: absolute(siteConfig.heroPhoto.src) } : {}),
  };
}

/** Home: `WebSite` e `Person` (SEO-RF-08). */
export async function buildHomeJsonLd(locale: Locale): Promise<JsonLdData> {
  const t = await getTranslations({ locale, namespace: "home.metadata" });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": absolute("/#website"),
        name: siteConfig.name,
        url: absolute(localizedPath(locale, "/")),
        inLanguage: locale,
      },
      await person(locale, t("description"), { withImage: true }),
    ],
  };
}

/** About: `ProfilePage` com o `Person` como entidade principal (SEO-RF-09). */
export async function buildProfilePageJsonLd(
  locale: Locale,
): Promise<JsonLdData> {
  const t = await getTranslations({ locale, namespace: "about.metadata" });

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absolute(localizedPath(locale, "/about")),
    inLanguage: locale,
    mainEntity: await person(locale, t("description"), { withImage: false }),
  };
}
