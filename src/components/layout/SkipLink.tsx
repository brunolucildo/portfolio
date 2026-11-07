import { getTranslations } from "next-intl/server";

export async function SkipLink() {
  const t = await getTranslations("navigation");

  return (
    <a
      href="#main"
      className="sr-only rounded-md bg-primary px-4 py-3 font-medium text-on-primary focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
    >
      {t("skipToContent")}
    </a>
  );
}
