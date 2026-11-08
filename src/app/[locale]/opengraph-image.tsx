import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { brandColors, socialImageSize } from "@/config/brand";
import { siteConfig } from "@/config/site";
import { requireLocale } from "@/i18n/locale";
import { routing } from "@/i18n/routing";

export const size = socialImageSize;
export const contentType = "image/png";

type Props = { params: Promise<{ locale: string }> };

/** Gera um cartão por idioma no build, em vez de a cada requisição. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Imagem de compartilhamento (SPEC-011): um cartão tipográfico por idioma, com
 * o nome, o posicionamento e o título do Hero. Sem fotografia. Margem de 80 px
 * e nada a menos de 40 px das bordas, para o corte dos aplicativos.
 */
export default async function OpenGraphImage({ params }: Props) {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "home.hero" });

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: brandColors.background,
        color: brandColors.foreground,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            width: 96,
            height: 6,
            marginBottom: 40,
            background: brandColors.primary,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 96,
            letterSpacing: -2,
            WebkitTextStroke: `2px ${brandColors.foreground}`,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 36,
            color: brandColors.muted,
          }}
        >
          {t("eyebrow")}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 64, letterSpacing: -1 }}>
        {t("headline")}
      </div>
    </div>,
    { ...socialImageSize },
  );
}
