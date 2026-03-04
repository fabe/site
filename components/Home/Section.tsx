import type { ReactNode } from "react";

interface HomeSectionProps {
  /** Section title — a string renders as an h3, or pass a ReactNode for custom markup */
  title: ReactNode;
  children: ReactNode;
  /** Extra classes on the dt element */
  dtClassName?: string;
  /** Extra classes on the dd element */
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
      <dt className={`list-title${dtClassName ? ` ${dtClassName}` : ""}`}>
        {typeof title === "string" ? (
          <h3 className="text-neutral-500 dark:text-silver-dark">{title}</h3>
        ) : (
          title
        )}
      </dt>
      <dd className={`list-content${ddClassName ? ` ${ddClassName}` : ""}`}>
        {children}
      </dd>
    </dl>
  );
}
