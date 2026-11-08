import type { Locale } from "@/i18n/routing";

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

/** Currículos em PDF disponíveis, por idioma. */
const resume: Partial<Record<Locale, string>> & { en: string } = {
  en: "/documents/resume/bruno-lucildo-resume-en.pdf",
};

export const siteConfig = {
  name: "Bruno Lucildo",
  /** URL base usada em canonical e Open Graph. Defina NEXT_PUBLIC_SITE_URL com o domínio definitivo. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
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
export function getResumeHref(locale: Locale): string {
  return siteConfig.resume[locale] ?? siteConfig.resume.en;
}
