import type React from "react";
import { cn } from "@/lib/cn";

export default function Caption({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figcaption
      className={cn(
        "pt-4 text-center text-sm text-muted text-balance",
        className,
      )}
    >
      {children}
    </figcaption>
  );
}
