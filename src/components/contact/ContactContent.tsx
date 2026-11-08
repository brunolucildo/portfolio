import { hasLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { measure } from "@/components/projects/layout";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getResumeHref, hasLocalizedResume, siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { ContactChannelSection } from "./ContactChannelSection";
import { CopyEmailButton } from "./CopyEmailButton";
import { buildContactChannels } from "./channels";

const linkClass = buttonStyles({ variant: "text", size: "md" });

/** Conteúdo da página Contact (SPEC-007): abertura e uma seção por canal. */
export async function ContactContent() {
  const t = await getTranslations("contact");
  const tNav = await getTranslations("navigation");
  const current = await getLocale();
  const locale = hasLocale(routing.locales, current)
    ? current
    : routing.defaultLocale;
  const channels = buildContactChannels(siteConfig.contact);
  const resumeLocalized = hasLocalizedResume(locale);

  return (
    <div className="py-20 md:py-24">
      <Container>
        <header className="pb-16 md:pb-20">
          <h1 className="text-h1 text-foreground">{t("title")}</h1>
          <p className={`mt-6 text-body-lg text-muted ${measure}`}>
            {t("intro")}
          </p>
        </header>

        <div id="contact-channels">
          {channels.map(({ key, value, href, external }) => (
            <ContactChannelSection
              key={key}
              id={`contact-${key}`}
              title={t(`channels.${key}.title`)}
              description={t(`channels.${key}.description`)}
              value={value}
            >
              <a
                href={href}
                className={linkClass}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {t(`channels.${key}.action`)}
                <span className="sr-only">
                  {" — "}
                  {t(`channels.${key}.title`)}
                  {external ? ` ${tNav("newTab")}` : ""}
                </span>
              </a>
              {key === "email" ? (
                <CopyEmailButton
                  address={value}
                  labels={{
                    copy: t("channels.email.copy"),
                    copied: t("channels.email.copied"),
                    failed: t("channels.email.copyFailed"),
                  }}
                />
              ) : null}
            </ContactChannelSection>
          ))}

          <ContactChannelSection
            id="contact-resume"
            title={t("channels.resume.title")}
            description={t("channels.resume.description")}
          >
            <a
              href={getResumeHref(locale)}
              target="_blank"
              rel="noopener noreferrer"
              lang={resumeLocalized ? undefined : "en"}
              className={linkClass}
            >
              {resumeLocalized
                ? t("channels.resume.action")
                : t("channels.resume.actionFallback")}
              <span className="sr-only">
                {" — "}
                {t("channels.resume.title")} {tNav("newTab")}
              </span>
            </a>
          </ContactChannelSection>
        </div>
      </Container>
    </div>
  );
}
