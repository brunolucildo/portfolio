/**
 * Expressões que não podem aparecer nas páginas públicas (CLAUDE.md, seção 7,
 * e SPEC-002, seção 3.2). A busca ignora maiúsculas e minúsculas.
 */
export const forbiddenPhrases = [
  "Open to Work",
  "Available for Opportunities",
  "Available for Hire",
  "Looking for a New Job",
  "Hire Me",
  "paixão por tecnologia",
  "passion for technology",
] as const;

/** Informações profissionais que não entram no About nem na Home (SPEC-002). */
export const withheldFromAbout = ["Açovisa", "80%"] as const;

export function findPhrases(
  text: string,
  phrases: readonly string[],
): string[] {
  const haystack = text.toLowerCase();
  return phrases.filter((phrase) => haystack.includes(phrase.toLowerCase()));
}
