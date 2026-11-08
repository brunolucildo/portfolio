/**
 * Guarda de indexação e validação da URL do site (SPEC-013, SEO-RF-05 e
 * SEO-RF-06). Sem importações: `next.config.ts` também usa este arquivo e não
 * resolve o alias `@/`.
 */

/** URL usada quando `NEXT_PUBLIC_SITE_URL` não existe (desenvolvimento local). */
export const defaultSiteUrl = "http://localhost:3000";

/** Valor de `SITE_INDEXING` que autoriza a indexação. Qualquer outro bloqueia. */
export const indexingAllowValue = "allow";

export type IndexingPolicy = {
  /** `true` só em ambiente de produção autorizado explicitamente. */
  indexable: boolean;
  /** Motivo do bloqueio, para o aviso do build; vazio quando indexável. */
  reason: string;
};

function isLocalHost(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();

  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "127.0.0.1" ||
    host === "::1"
  );
}

/**
 * Valida e normaliza a URL pública do site: absoluta, `http` ou `https`, sem
 * caminho, parâmetros ou fragmento. A barra final é removida. Valor ausente ou
 * vazio usa a URL local; valor inválido lança um erro com a causa.
 */
export function normalizeSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();

  if (!value) {
    return defaultSiteUrl;
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL inválida: "${value}" não é uma URL absoluta (ex.: https://seu-dominio.dev).`,
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL inválida: use http ou https, recebido "${url.protocol}".`,
    );
  }

  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL inválida: informe só o domínio, sem caminho, parâmetros ou fragmento (recebido "${value}").`,
    );
  }

  return url.origin;
}

/**
 * Decide se o ambiente é indexável. O padrão é bloquear: só `SITE_INDEXING=allow`
 * libera, e só com uma URL `https` fora de `localhost`. `SITE_INDEXING=allow`
 * com outra URL é erro de configuração e derruba o build.
 */
export function getIndexingPolicy(env: {
  siteUrl: string | undefined;
  indexing: string | undefined;
}): IndexingPolicy {
  const siteUrl = normalizeSiteUrl(env.siteUrl);

  if (env.indexing?.trim() !== indexingAllowValue) {
    return {
      indexable: false,
      reason: `SITE_INDEXING não é "${indexingAllowValue}": o site pede aos buscadores que não o indexem.`,
    };
  }

  const url = new URL(siteUrl);

  if (url.protocol !== "https:" || isLocalHost(url.hostname)) {
    throw new Error(
      `SITE_INDEXING=${indexingAllowValue} exige NEXT_PUBLIC_SITE_URL com https e fora de localhost (recebido "${siteUrl}").`,
    );
  }

  return { indexable: true, reason: "" };
}

/** Política do ambiente atual, lida das variáveis de ambiente do processo. */
export function currentIndexingPolicy(): IndexingPolicy {
  return getIndexingPolicy({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    indexing: process.env.SITE_INDEXING,
  });
}
