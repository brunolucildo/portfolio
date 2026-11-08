import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AiLabHighlight } from "@/components/sections/AiLabHighlight";
import { ExperienceHighlights } from "@/components/sections/ExperienceHighlights";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { HeroSection } from "@/components/sections/HeroSection";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import {
  localizedAlternates,
  localizedPath,
  openGraphLocales,
  socialImage,
} from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "home.metadata" });
  const image = await socialImage(locale);

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
      images: [image],
      ...openGraphLocales(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [image],
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
      <FeaturedProjects />
      <AiLabHighlight />
    </>
  );
}
