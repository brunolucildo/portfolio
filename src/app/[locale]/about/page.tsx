import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PagePlaceholder } from "@/components/sections/PagePlaceholder";
import { requireLocale } from "@/i18n/locale";
import { buildPlaceholderMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPlaceholderMetadata({ locale, href: "/about", page: "about" });
}

export default async function AboutPage({ params }: Props) {
  setRequestLocale(requireLocale((await params).locale));
  return <PagePlaceholder page="about" />;
}
