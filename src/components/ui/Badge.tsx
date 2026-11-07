import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-caption text-muted",
        className,
      )}
      {...props}
    />
  );
}
