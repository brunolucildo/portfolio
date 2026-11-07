"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("languageSwitcher");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const { slug } = useParams<{ slug?: string }>();

  // Em rotas com parâmetro (detalhe de projeto), o slug é o mesmo nos dois idiomas.
  const href: ComponentProps<typeof Link>["href"] =
    pathname === "/projects/[slug]"
      ? { pathname, params: { slug: slug ?? "" } }
      : pathname;

  return (
    <ul
      aria-label={t("label")}
      className={cn("flex items-center gap-1", className)}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;

        return (
          <li key={locale}>
            <Link
              href={href}
              locale={locale}
              lang={locale}
              hrefLang={locale}
              aria-label={t(`options.${locale}`)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-3 text-small font-medium transition-colors duration-(--duration-fast) ease-standard",
                isActive
                  ? "bg-surface-elevated text-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {locale.slice(0, 2).toUpperCase()}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
