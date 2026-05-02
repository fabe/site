import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SectionTitle } from "../Typography";

interface HomeSectionProps {
  title: ReactNode;
  children: ReactNode;
  dtClassName?: string;
  ddClassName?: string;
}

export default function HomeSection({
  title,
  children,
  dtClassName,
  ddClassName,
}: HomeSectionProps) {
  return (
    <dl className="list-container">
      <dt className={cn("list-title", dtClassName)}>
        {typeof title === "string" ? <SectionTitle>{title}</SectionTitle> : title}
      </dt>
      <dd className={cn("list-content", ddClassName)}>{children}</dd>
    </dl>
  );
}
