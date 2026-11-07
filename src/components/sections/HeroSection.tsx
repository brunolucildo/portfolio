import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { publicAssetExists } from "@/lib/utils/public-asset";

export async function HeroSection() {
  const t = await getTranslations("home.hero");
  const { heroPhoto } = siteConfig;
  const hasPhoto = publicAssetExists(heroPhoto.src);

  return (
    <section aria-labelledby="hero-title" className="relative overflow-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
      >
        <div className="hero-parallax hero-parallax-back absolute -top-24 -right-32 size-[44rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-primary)_14%,transparent),transparent)]" />
        <div className="hero-parallax hero-parallax-mid absolute top-20 right-[7%] size-[30rem] rounded-full border border-border" />
        <div className="hero-parallax hero-parallax-front absolute top-[58%] left-[54.5%] size-14 rotate-12 rounded-md border border-primary/30" />
      </div>

      <Container
        className={cn(
          "relative grid items-center gap-12 py-20 md:py-28 lg:py-32",
          hasPhoto && "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16",
        )}
      >
        <div className="hero-enter">
          <p className="text-body text-muted">{t("eyebrow")}</p>
          <h1 id="hero-title" className="mt-4 text-display text-foreground">
            {t("headline")}
          </h1>
          <p className="mt-6 max-w-reading text-body-lg text-muted">
            {t("subheadline")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/projects"
              className={buttonStyles({ variant: "primary", size: "lg" })}
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/contact"
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        {hasPhoto ? (
          <div className="relative mx-auto w-full max-w-portrait lg:max-w-none">
            <Image
              src={heroPhoto.src}
              alt={t("photoAlt")}
              width={heroPhoto.width}
              height={heroPhoto.height}
              priority
              sizes="(min-width: 1024px) 447px, 384px"
              className="h-auto w-full rounded-xl saturate-[0.85] [-webkit-mask-image:linear-gradient(to_bottom,black_62%,transparent)] [mask-image:linear-gradient(to_bottom,black_62%,transparent)]"
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
