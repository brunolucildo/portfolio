import { monogramResponse } from "@/lib/brand/monogram";

export const dynamic = "force-static";

/**
 * Atende quem pede `/favicon.ico` sem ler o HTML (robôs e navegadores antigos).
 * O Next não gera `favicon` por código; esta rota devolve o monograma em PNG,
 * que os navegadores aceitam com esse nome.
 */
export function GET() {
  return monogramResponse(48);
}
