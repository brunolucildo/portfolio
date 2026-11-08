/**
 * Cores da marca usadas fora do CSS: o ícone do site e a imagem de
 * compartilhamento (SPEC-011), gerados por `next/og`, que não lê variáveis CSS.
 * Espelham `src/styles/tokens.css`; um teste (`e2e/assets.spec.ts`) confere que
 * os valores continuam iguais.
 */
export const brandColors = {
  background: "#0b0d0c",
  foreground: "#f3f5f2",
  muted: "#929a91",
  primary: "#b7f36b",
} as const;

/** Dimensões da imagem de compartilhamento, em pixels. */
export const socialImageSize = { width: 1200, height: 630 } as const;
