import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteShell } from "@/components/layout/SiteShell";
import { siteConfig } from "@/config/site";
import { requireLocale } from "@/i18n/locale";
import { routing } from "@/i18n/routing";
import "../globals.css";

/** Regenera as páginas diariamente para manter o ano do footer atualizado. */
export const revalidate = 86400;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: requireLocale(locale),
    namespace: "metadata",
  });

  return {
    metadataBase: new URL(siteConfig.url),
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <SiteShell locale={locale}>{children}</SiteShell>;
}
