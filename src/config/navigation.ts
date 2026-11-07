import type { routing } from "@/i18n/routing";

/** Rotas com parâmetros (ex.: `/projects/[slug]`), que não são destinos fixos. */
type DynamicPathname = `${string}[${string}]${string}`;

/** Caminhos fixos do site, usados no menu, no rodapé e nos metadados. */
export type AppPathname = Exclude<
  keyof typeof routing.pathnames,
  DynamicPathname
>;

type NavigationItem = {
  /** Chave da tradução em `navigation.items`. */
  key: "home" | "about" | "experience" | "projects" | "aiLab" | "contact";
  href: AppPathname;
};

export const mainNavigation: readonly NavigationItem[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "experience", href: "/experience" },
  { key: "projects", href: "/projects" },
  { key: "aiLab", href: "/ai-lab" },
  { key: "contact", href: "/contact" },
];
