import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { HeaderNav } from "./HeaderNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="relative mx-auto flex h-16 w-full max-w-main items-center justify-between gap-6 px-5 md:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center font-display text-h4 font-semibold tracking-tight text-foreground"
        >
          {siteConfig.name}
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
