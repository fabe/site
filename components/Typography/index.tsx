import type React from "react";
import { cn } from "@/lib/cn";

export const mutedTextClass = "text-neutral-500 dark:text-silver-dark";
export const smallMutedTextClass =
  "text-sm text-neutral-500 [font-variation-settings:'opsz'_14] dark:text-silver-dark";
export const pageTitleClass =
  "text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:text-3xl";
export const pageTitleSpacedClass = cn("pb-6 sm:pb-12", pageTitleClass);
export const captionClass =
  "text-sm text-neutral-500 dark:text-silver-dark text-balance text-center pt-4";

export function PageTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h1 className={cn(pageTitleSpacedClass, className)}>{children}</h1>;
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h3 className={cn(mutedTextClass, className)}>{children}</h3>;
}
