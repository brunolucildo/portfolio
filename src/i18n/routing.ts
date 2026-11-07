import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt-BR"],
  defaultLocale: "en",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/about": { en: "/about", "pt-BR": "/sobre" },
    "/experience": { en: "/experience", "pt-BR": "/experiencia" },
    "/projects": { en: "/projects", "pt-BR": "/projetos" },
    "/ai-lab": "/ai-lab",
    "/contact": { en: "/contact", "pt-BR": "/contato" },
  },
});

export type Locale = (typeof routing.locales)[number];
