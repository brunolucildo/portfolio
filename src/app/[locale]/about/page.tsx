import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AboutContent } from "@/components/sections/AboutContent";
import { requireLocale } from "@/i18n/locale";
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
  setRequestLocale(requireLocale((await params).locale));
  return <AboutContent />;
}
