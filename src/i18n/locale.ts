import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { type Locale, routing } from "./routing";

/** Valida o parâmetro de rota `locale` e responde 404 quando ele não é suportado. */
export function requireLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) {
    notFound();
  }

  return value;
}
