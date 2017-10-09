import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/templates/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

export const data = {
  isWork: true,
  title: 'Helping athletes to cope with injuries',
  subtitle: 'DSK Companion',
  date: '2015-05-28T22:40:32.169Z',
  path: '/work/dsk-companion',
  cover: '/covers/dsk.png',
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

export default () => <Article {...data}>Yello!</Article>;
