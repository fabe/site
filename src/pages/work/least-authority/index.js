import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

export const data = {
  isWork: true,
  title: 'New website for the privacy–focused startup Least Authority',
  subtitle: 'Least Authority',
  date: '2017-02-01',
  path: '/work/least-authority',
  cover: './least-authority.png',
  contain: true,
  background: '#333',
  caption: 'For developers',
  dark: true,
  intro:
    'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.',
  details: [
    {
      title: 'Responsibility',
      description: 'Design & Development',
    },
    {
      title: 'Date',
      description: 'Q1 2017',
    },
    {
      title: 'Technology',
      description: 'Static Site, LektorCMS',
    },
  ],
};

export default props => (
  <Article path={data.path} {...props}>
    Hello!
  </Article>
);


