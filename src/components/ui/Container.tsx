import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export type ContainerVariant = "main" | "reading" | "full";

const variants: Record<ContainerVariant, string> = {
  main: "max-w-main",
  reading: "max-w-reading",
  full: "max-w-none",
};

type ContainerProps = ComponentProps<"div"> & {
  variant?: ContainerVariant;
};

export function Container({
  variant = "main",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 md:px-6 lg:px-8",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
