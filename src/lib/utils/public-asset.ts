import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Indica se um arquivo de `public/` existe no momento do build. Permite que
 * ativos mantidos fora do Git sejam opcionais sem quebrar a página.
 */
export function publicAssetExists(src: string): boolean {
  return existsSync(path.join(process.cwd(), "public", src));
}
