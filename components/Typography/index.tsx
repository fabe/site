import type React from "react";
import { cn } from "@/lib/cn";

export function PageTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "pb-6 text-2xl text-heading [font-variation-settings:'opsz'_32,_'wght'_500] sm:pb-12 sm:text-3xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h3 className={cn("text-muted", className)}>{children}</h3>;
}
