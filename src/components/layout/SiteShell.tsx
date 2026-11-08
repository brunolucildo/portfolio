import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import { inter, spaceGrotesk } from "@/app/fonts";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";

type SiteShellProps = {
  locale: string;
  children: ReactNode;
};

/**
 * Documento completo do site (`html`, cabeçalho, conteúdo e rodapé), usado pelo
 * layout do idioma e pela 404 global, para que as duas tenham a mesma estrutura
 * e o mesmo `lang`.
 */
export async function SiteShell({ locale, children }: SiteShellProps) {
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        {/* Apenas os namespaces usados por Client Components vão ao navegador. */}
        <NextIntlClientProvider
          messages={{
            navigation: messages.navigation,
            languageSwitcher: messages.languageSwitcher,
          }}
        >
          <SkipLink />
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
