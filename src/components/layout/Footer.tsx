import { getTranslations } from "next-intl/server";
import { mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { Container } from "../ui/Container";

const linkClass =
  "inline-flex min-h-11 items-center text-small text-muted transition-colors duration-(--duration-fast) ease-standard hover:text-foreground";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("navigation");
  const { email, linkedin, github } = siteConfig.contact;

  const channels = [
    email ? { label: "Email", href: `mailto:${email}`, external: false } : null,
    linkedin ? { label: "LinkedIn", href: linkedin, external: true } : null,
    github ? { label: "GitHub", href: github, external: true } : null,
  ].filter((channel) => channel !== null);

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-10 py-12 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-h4 font-semibold text-foreground">
            {siteConfig.name}
          </p>
          <p className="mt-2 text-small text-muted">
            © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}
          </p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:gap-16">
          <nav aria-label={t("navigationLabel")}>
            <ul>
              {mainNavigation.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} className={linkClass}>
                    {tNav(`items.${key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/resume" className={linkClass}>
                  {tNav("resume")}
                </Link>
              </li>
            </ul>
          </nav>

          {channels.length > 0 ? (
            <ul aria-label={t("contactLabel")}>
              {channels.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    className={linkClass}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {label}
                    {external ? (
                      <span className="sr-only"> {tNav("newTab")}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
