import React, { FC } from 'react';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkTextr from 'remark-textr';
import MarkdownRenderer from 'react-markdown';
import textrQuotes from 'typographic-quotes';
export interface MarkdownProps {
  source: string;
  className?: string;
}

function ellipses(input: string) {
  return input.replace(/\.{3}/gim, '…');
}

function apostrophes(input: string) {
  return input
    .replace(/ 'n' /gim, ' ’n’ ')
    .replace(/'n'/gim, '’n’')
    .replace(/(\S)'(\S)/gim, '$1’$2')
    .replace(/'(\d0s)/gim, '’$1');
}

function quotes(input: string) {
  return textrQuotes(input, { locale: 'en-us' });
}

const Markdown: FC<MarkdownProps> = ({ source, className, ...rest }) => {
  return (
    <MarkdownRenderer
      {...rest}
      className={`${className ? className : ''} prose`}
      remarkPlugins={[
        remarkGfm,
        [
          remarkTextr,
          {
            plugins: [ellipses, apostrophes, quotes],
          },
        ],
      ]}
      rehypePlugins={[[rehypeSanitize]]}
    >
      {source}
    </MarkdownRenderer>
  );
};

export default Markdown;
