interface QuoteProps {
  children: JSX.Element | string;
  cite?: string;
}

export default function Quote({ children, cite }: QuoteProps) {
  return (
    <blockquote className="flex flex-col my-8 pl-6 relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-neutral-800/10 dark:bg-white/10 rounded-full"></div>
      <span className="text-neutral-800 dark:text-white italic">
        {children}
      </span>
      {cite && (
        <cite className="text-sm pt-2 not-italic text-neutral-500 dark:text-silver-dark">
          {cite}
        </cite>
      )}
    </blockquote>
  );
}
