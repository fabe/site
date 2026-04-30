import type React from "react";
import { captionClass } from "@/components/Typography";
import { cn } from "@/lib/cn";

export default function Caption({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <figcaption className={cn(captionClass, className)}>{children}</figcaption>;
}
