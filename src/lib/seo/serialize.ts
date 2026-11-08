/**
 * Serializa o JSON-LD para dentro de um `<script>`: cada `<` vira a sequência
 * de escape Unicode "u003c" (com a barra invertida), então um texto com
 * `</script>` não fecha o elemento (SPEC-013, SEO-RF-10).
 */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
