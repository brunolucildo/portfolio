"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";

type Href = ComponentProps<typeof Link>["href"];

/**
 * Destino do seletor. Nas rotas com parâmetro (detalhe de projeto e de
 * experimento) o slug é o mesmo nos dois idiomas. Na 404 não há slug válido: o
 * seletor leva à lista da seção no outro idioma e, para um caminho sem rota, à
 * Home dele (I18N-RF-12).
 */
function targetHref(
  pathname: ReturnType<typeof usePathname>,
  slug: string | undefined,
): Href {
  if (!(pathname in routing.pathnames)) {
    return "/";
  }

  if (pathname === "/projects/[slug]") {
    return slug ? { pathname, params: { slug } } : "/projects";
  }

  if (pathname === "/ai-lab/[slug]") {
    return slug ? { pathname, params: { slug } } : "/ai-lab";
  }

  return pathname;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("languageSwitcher");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const { slug } = useParams<{ slug?: string }>();

  const href = targetHref(pathname, slug);

  return (
    <ul
      aria-label={t("label")}
      className={cn("flex items-center gap-1", className)}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;
        const code = locale.slice(0, 2).toUpperCase();

        return (
          <li key={locale}>
            <Link
              href={href}
              locale={locale}
              lang={locale}
              hrefLang={locale}
              // O nome acessível começa pelo texto visível (WCAG 2.5.3): quem
              // controla a página por voz diz "EN" ou "PT".
              aria-label={`${code}, ${t(`options.${locale}`)}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-3 text-small font-medium transition-colors duration-(--duration-fast) ease-standard",
                isActive
                  ? "bg-surface-elevated text-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {code}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
