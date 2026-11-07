/**
 * Formata um mês `AAAA-MM` no idioma informado, com mês abreviado e ano
 * (ex.: "May 2023" em `en` e "mai. 2023" em `pt-BR`).
 */
export function formatMonth(locale: string, isoMonth: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(isoMonth);
  if (!match) {
    throw new Error(`Mês inválido: ${isoMonth}`);
  }

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  const parts = new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(date);

  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  return `${month} ${year}`;
}
