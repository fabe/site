import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/templates/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

import landing from './landing.png';

export const data = {
  isWork: true,
  title: 'Share your design work, clutter-free',
  subtitle: 'Delivery',
  date: '2015-05-28T22:40:32.169Z',
  path: '/work/delivery',
  cover: '/covers/delivery.png',
  caption: 'An Emoji™ Product',
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
      description: 'Q2 2017',
    },
    {
      title: 'Technology',
      description: 'React, Next.js, Node.js',
    },
  ],
};

export default () => (
  <Article {...data}>
    <Figure src={landing} caption="Landing Page" fullWidth background link />
    <Block align="center">
      <h2>The Landing Page</h2>
      <p>
        Far far away, behind the word mountains, far from the countries Vokalia.
      </p>
    </Block>
    <Figure src={landing} caption="Landing Page" fullWidth background slim />
    <Figure
      src={landing}
      caption="Landing Page"
      fullWidth
      background
      slim
      align="right"
    />
    <Block>
      <p>
        Far far away, behind the word mountains, far from the countries Vokalia
        and Consonantia, there live the blind texts. Separated they live in
        Bookmarksgrove right at the coast of the Semantics, a large language
        ocean. A small river named Duden flows by their place and supplies it
        with the necessary regelialia.
      </p>
    </Block>

    <Block align="right">
      <p>
        Far far away, behind the word mountains, far from the countries Vokalia
        and Consonantia, there live the blind texts. Separated they live in
        Bookmarksgrove right at the coast of the Semantics, a large language
        ocean. A small river named Duden flows by their place and supplies it
        with the necessary regelialia.
      </p>
    </Block>
  </Article>
);
