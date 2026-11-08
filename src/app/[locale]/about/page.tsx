import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AboutContent } from "@/components/sections/AboutContent";
import { requireLocale } from "@/i18n/locale";
import { buildProfilePageJsonLd, JsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    href: "/about",
    namespace: "about.metadata",
  });
}

export default async function AboutPage({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={await buildProfilePageJsonLd(locale)} />
      <AboutContent />
    </>
  );
}
