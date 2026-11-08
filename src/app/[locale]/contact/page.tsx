import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactContent } from "@/components/contact/ContactContent";
import { requireLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    href: "/contact",
    namespace: "contact.metadata",
  });
}

export default async function ContactPage({ params }: Props) {
  setRequestLocale(requireLocale((await params).locale));
  return <ContactContent />;
}
