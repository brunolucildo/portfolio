import "./globals.css";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { SiteShell } from "@/components/layout/SiteShell";

/**
 * 404 de todo o site. O layout raiz usa um segmento dinâmico (`[locale]`), o
 * que impede o Next de montar a 404 a partir de `not-found.tsx`: o HTML sairia
 * como um shell vazio, sem `lang` nem conteúdo. O idioma vem da requisição,
 * resolvida pelo middleware do `next-intl`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: t("documentTitle") };
}

export default async function GlobalNotFound() {
  const locale = await getLocale();

  return (
    <SiteShell locale={locale}>
      <NotFoundContent />
    </SiteShell>
  );
}
