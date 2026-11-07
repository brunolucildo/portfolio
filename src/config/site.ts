import type { Locale } from "@/i18n/routing";

type ContactChannels = {
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
  contact,
  resume,
};

/** Retorna o currículo do idioma ou, na ausência dele, a versão em inglês. */
export function getResumeHref(locale: Locale): string {
  return siteConfig.resume[locale] ?? siteConfig.resume.en;
}
