import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Fora do middleware de idioma: API, arquivos do Next, qualquer caminho com
  // ponto e os ícones gerados por código (`/icon/...` e `/apple-icon`), que não
  // têm prefixo de idioma (SPEC-011).
  matcher: "/((?!api|_next|_vercel|icon/|apple-icon|.*\\..*).*)",
};
