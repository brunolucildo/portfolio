import en from "./en/common.json";
import ptBR from "./pt-BR/common.json";

/**
 * Garante em tempo de compilação (pnpm typecheck) que `en` e `pt-BR` têm
 * exatamente a mesma estrutura de chaves. Este arquivo não é importado pela
 * aplicação.
 */
export const ptBRMatchesEn: typeof en = ptBR;
export const enMatchesPtBR: typeof ptBR = en;
