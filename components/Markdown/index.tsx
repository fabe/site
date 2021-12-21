import { FC } from 'react';
import MarkdownRenderer from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownProps {
  source: string;
  className?: string;
}

const Markdown: FC<MarkdownProps> = ({ source, className, ...rest }) => {
  return (
    <MarkdownRenderer
      {...rest}
      className={`${className} type`}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeSanitize]]}
    >
      {source}
    </MarkdownRenderer>
  );
};

export default Markdown;
