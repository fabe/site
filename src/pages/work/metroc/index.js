import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

export const data = {
  isWork: true,
  title: 'Developing the website for a Toronto-based college',
  subtitle: 'Metro College of Technology',
  date: '2017-07-01T10:00:00.284Z',
  path: '/work/metroc',
  cover: '/covers/webp/metroc.webp',
  contain: true,
  background: '#26272C',
  details: [
    {
      title: 'Responsibility',
      description: 'Web Development, Wordpress',
    },
    {
      title: 'Date',
      description: 'Winter 2015',
    },
  ],
};

export default () => <Article {...data}>Yello!</Article>;
