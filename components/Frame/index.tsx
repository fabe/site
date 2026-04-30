import React from "react";
import { cn } from "@/lib/cn";

export const roundedFrameClass = "rounded-xl sm:rounded-2xl";
export const frameClass = cn(
  "relative overflow-hidden bg-gray-100 dark:bg-neutral-800/75",
  roundedFrameClass,
);
export const mediaBorderClass = cn(
  "absolute inset-0 pointer-events-none box-border border border-neutral-800/5 dark:border-white/5",
  roundedFrameClass,
);
export const glassBackdropClass =
  "bg-gray-50/80 dark:bg-neutral-900/80 backdrop-blur-[50px] backdrop-saturate-[2]";

export function MediaBorder({ className }: { className?: string }) {
  return <div className={cn(mediaBorderClass, className)} />;
}

export const MediaFrame = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function MediaFrame({ children, className, ...props }, ref) {
  return (
    <div ref={ref} className={cn(frameClass, className)} {...props}>
      {children}
    </div>
  );
});
