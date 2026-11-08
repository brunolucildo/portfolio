import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TechnologiesContent } from "@/components/technologies/TechnologiesContent";
import { requireLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    href: "/technologies",
    namespace: "technologies.metadata",
  });
}

export default async function TechnologiesPage({ params }: Props) {
  setRequestLocale(requireLocale((await params).locale));
  return <TechnologiesContent />;
}
