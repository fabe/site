import type { AnchorHTMLAttributes, ReactNode } from "react";

type NoteProps = {
  children?: ReactNode;
};

export const mdxComponents = {
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="link" target="_blank" rel="noopener noreferrer" {...props} />
  ),

  Note: ({ children }: NoteProps) => (
    <div className="mb-5 rounded border border-gray-200 bg-gray-50 p-4 text-sm font-ui-sm dark:border-neutral-800 dark:bg-neutral-800/75 [&>p]:mt-0">
      {children}
    </div>
  ),
};
