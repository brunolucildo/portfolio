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
    "/projects/[slug]": {
      en: "/projects/[slug]",
      "pt-BR": "/projetos/[slug]",
    },
    "/technologies": { en: "/technologies", "pt-BR": "/tecnologias" },
    "/ai-lab": "/ai-lab",
    "/ai-lab/[slug]": "/ai-lab/[slug]",
    "/contact": { en: "/contact", "pt-BR": "/contato" },
  },
});

export type Locale = (typeof routing.locales)[number];
