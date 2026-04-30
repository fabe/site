import React from "react";
import { cn } from "@/lib/cn";

export function MediaBorder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 box-border rounded-xl border border-line/5 sm:rounded-2xl dark:border-line/5",
        className,
      )}
    />
  );
}

export const MediaFrame = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function MediaFrame({ children, className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl bg-surface-muted sm:rounded-2xl dark:bg-surface/75",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
