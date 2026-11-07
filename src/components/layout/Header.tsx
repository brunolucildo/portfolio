import { hasLocale } from "next-intl";
import { getLocale } from "next-intl/server";
import { getResumeHref, hasLocalizedResume, siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { HeaderNav } from "./HeaderNav";

export async function Header() {
  const current = await getLocale();
  const locale = hasLocale(routing.locales, current)
    ? current
    : routing.defaultLocale;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="relative mx-auto flex h-16 w-full max-w-main items-center justify-between gap-6 px-5 md:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-h4 font-semibold tracking-tight text-foreground"
        >
          {siteConfig.name}
        </Link>
        <HeaderNav
          resumeHref={getResumeHref(locale)}
          resumeLocalized={hasLocalizedResume(locale)}
        />
      </div>
    </header>
  );
}
