import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AiLabHighlight } from "@/components/sections/AiLabHighlight";
import { ExperienceHighlights } from "@/components/sections/ExperienceHighlights";
import { FeaturedProject } from "@/components/sections/FeaturedProject";
import { HeroSection } from "@/components/sections/HeroSection";
import { siteConfig } from "@/config/site";
import { type Locale, routing } from "@/i18n/routing";
import { localizedAlternates, localizedPath } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

const openGraphLocale: Record<Locale, string> = {
  en: "en_US",
  "pt-BR": "pt_BR",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "home.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates(locale, "/"),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: t("title"),
      description: t("description"),
      url: localizedPath(locale, "/"),
      locale: openGraphLocale[locale],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ExperienceHighlights />
      <FeaturedProject />
      <AiLabHighlight />
    </>
  );
}
