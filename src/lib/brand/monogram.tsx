import { ImageResponse } from "next/og";
import { brandColors } from "@/config/brand";

/**
 * Monograma "BL" do site (SPEC-011): letras em `primary` sobre `background`,
 * quadrado, em qualquer tamanho. O gerador de imagens só traz a fonte Geist em
 * peso normal; o contorno da mesma cor engrossa as letras, que continuam
 * legíveis em 16 px, sem arquivo de fonte novo.
 */
export function monogramResponse(size: number): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: brandColors.background,
        color: brandColors.primary,
        fontSize: Math.round(size * 0.55),
        letterSpacing: Math.round(size * -0.02),
        WebkitTextStroke: `${Math.max(1, Math.round(size * 0.027))}px ${brandColors.primary}`,
      }}
    >
      BL
    </div>,
    { width: size, height: size },
  );
}
