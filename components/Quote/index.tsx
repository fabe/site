interface QuoteProps {
  children: JSX.Element | string;
  cite?: string;
}

export default function Quote({ children, cite }: QuoteProps) {
  return (
    <blockquote className="text-4xl [font-variation-settings:'opsz'_36,_'wght'_700] lg:-ml-40 lg:-mr-40 pb-12 text-center flex flex-col text-neutral-800 dark:text-white">
      <span className="text-balance">{children}</span>
      <cite className="not-italic text-base pt-4 [font-variation-settings:'opsz'_15,_'wght'_600] leading-normal text-neutral-800 dark:text-silver">
        {cite}
      </cite>
    </blockquote>
  );
}
