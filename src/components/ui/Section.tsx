import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Container, type ContainerVariant } from "./Container";

type SectionProps = Omit<ComponentProps<"section">, "title"> & {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  containerVariant?: ContainerVariant;
};

export function Section({
  id,
  title,
  description,
  containerVariant = "main",
  className,
  children,
  ...props
}: SectionProps) {
  const titleId = title ? `${id}-title` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn("py-20 md:py-24", className)}
      {...props}
    >
      <Container variant={containerVariant}>
        {title || description ? (
          <header className="mb-12 max-w-reading">
            {title ? (
              <h2 id={titleId} className="text-h2 text-foreground">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-body-lg text-muted">{description}</p>
            ) : null}
          </header>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
