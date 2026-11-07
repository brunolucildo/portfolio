import type { routing } from "@/i18n/routing";

export type AppPathname = keyof typeof routing.pathnames;

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
