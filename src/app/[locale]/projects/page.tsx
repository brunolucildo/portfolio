import { setRequestLocale } from "next-intl/server";
import { PagePlaceholder } from "@/components/sections/PagePlaceholder";

type Props = { params: Promise<{ locale: string }> };

export default async function ProjectsPage({ params }: Props) {
  setRequestLocale((await params).locale);
  return <PagePlaceholder page="projects" />;
}
