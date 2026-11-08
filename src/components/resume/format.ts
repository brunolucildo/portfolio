import { statSync } from "node:fs";
import path from "node:path";

/** Mês e ano de uma data `AAAA-MM`, no idioma informado (ex.: "November 2026"). */
export function formatResumeMonth(updatedAt: string, locale: string): string {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(updatedAt);
  if (!match) {
    throw new Error(
      `Data do currículo inválida: "${updatedAt}" (use AAAA-MM).`,
    );
  }

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Tamanho em KB, ou em MB a partir de 1 MB (ex.: "358 KB", "1.2 MB"). */
export function formatFileSize(bytes: number, locale: string): string {
  const kilobytes = bytes / 1024;

  if (kilobytes >= 1024) {
    const megabytes = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
    }).format(kilobytes / 1024);
    return `${megabytes} MB`;
  }

  const rounded = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.max(1, kilobytes));
  return `${rounded} KB`;
}

/**
 * Tamanho do PDF em bytes, lido de `public/` no servidor. Devolve `undefined`
 * se o arquivo não puder ser lido: a página omite a linha (RES-RNF-03).
 */
export function readPublicFileSize(href: string): number | undefined {
  try {
    return statSync(path.join(process.cwd(), "public", href)).size;
  } catch {
    return undefined;
  }
}

/** Nome do arquivo de um caminho público, usado no atributo `download`. */
export function fileNameOf(href: string): string {
  return href.slice(href.lastIndexOf("/") + 1);
}
