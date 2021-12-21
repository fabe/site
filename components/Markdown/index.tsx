import React, { FC } from 'react';
import dynamic from 'next/dynamic';
import { MarkdownProps } from './MarkdownRenderer';

const MarkdownRenderer = dynamic(() => import('./MarkdownRenderer'));

const Markdown: FC<MarkdownProps> = ({ ...props }) => {
  return <MarkdownRenderer {...props} />;
};

export default Markdown;
