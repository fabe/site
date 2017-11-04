import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

import articleFragment from '~/src/pages';

export const data = {
  isWork: true,
  title: 'Helping athletes to cope with injuries',
  subtitle: 'DSK Companion',
  date: '2017-07-01',
  path: '/work/dsk-companion',
  cover: '/covers/webp/dsk.webp',
  caption: 'A Google Design Sprint',
  dark: true,
  intro:
    'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.',
  details: [
    {
      title: 'Responsibility',
      description: 'Service Design, Visual Design, Design Sprint',
    },
    {
      title: 'Date',
      description: 'Summer 2017',
    },
  ],
};

export default props => (
  <Article {...data} {...props}>
    Yello!
  </Article>
);
