import type { Locale } from "@/i18n/routing";
import { normalizeSiteUrl } from "@/lib/seo/indexing";

export type ContactChannels = {
  email?: string;
  linkedin?: string;
  github?: string;
};

/** Canais públicos de contato. Somente os definidos são exibidos. */
const contact: ContactChannels = {
  email: "bruno.lucsilva@gmail.com",
  linkedin: "https://www.linkedin.com/in/bruno-lucildo/",
  github: "https://github.com/brunolucildo",
};

/** Um currículo em PDF e o mês em que o arquivo foi atualizado. */
export type ResumeFile = {
  /** Caminho público do PDF, dentro de `public/`. */
  href: string;
  /** Mês da última atualização do arquivo, no formato `AAAA-MM`. Revisar a cada troca do PDF. */
  updatedAt: string;
};

/** Currículos em PDF disponíveis, por idioma (SPEC-009). */
const resume: Partial<Record<Locale, ResumeFile>> & { en: ResumeFile } = {
  en: {
    href: "/documents/resume/bruno-lucildo-resume-en.pdf",
    updatedAt: "2026-11",
  },
};

export const siteConfig = {
  name: "Bruno Lucildo",
  /** URL base usada em canonical e Open Graph. Defina NEXT_PUBLIC_SITE_URL com o domínio definitivo. */
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  contact,
  resume,
  /** Fotografia do Hero, versionada em public/images/hero/. */
  heroPhoto: {
    src: "/images/hero/bruno-lucildo-portrait.png",
    width: 574,
    height: 811,
  },
};

/** Indica se existe um currículo no idioma, e não apenas o fallback em inglês. */
export function hasLocalizedResume(locale: Locale): boolean {
  return locale in siteConfig.resume;
}

/** Retorna o currículo do idioma ou, na ausência dele, a versão em inglês. */
export function getResumeFile(locale: Locale): ResumeFile {
  return siteConfig.resume[locale] ?? siteConfig.resume.en;
}

/** Caminho público do PDF do idioma ou, na ausência dele, o da versão em inglês. */
export function getResumeHref(locale: Locale): string {
  return getResumeFile(locale).href;
}
