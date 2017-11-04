import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Article from '~/src/components/Article';

import Block from '~/src/components/Block';
import Figure from '~/src/components/Figure';

import screens from './screens.webp';

export const data = {
  isWork: true,
  title: 'Developing the website for a Toronto-based college',
  subtitle: 'Metro College of Technology',
  date: '2016-08-01',
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
      description: 'Mid 2016',
    },
  ],
};

export default props => (
  <Article {...data} {...props}>
    <Block>
      <p>
        Metro College of Technology is a career college, founded in 1992 and
        located in the dynamic city of Toronto, Ontario. Their mission is to
        prepare students for today’s competitive job market and develop their
        long-term career perspectives. (Source:{' '}
        <a href="http://metroc.ca/about-us">metroc.ca</a>)
      </p>
    </Block>
    <Block align="right">
      <p>
        In Mid 2016 I was asked to develop their new website (designed by{' '}
        <a href="http://killnicole.github.io/">Victoria Leontieva</a>) and help
        them scale their online enrollment business. Required by the client was
        a swift transition from their old website, while using the same
        Wordpress-powered stack.
      </p>
    </Block>
    <hr />
    <Block pull>
      <h2>See it live</h2>
    </Block>
    <Block align="right" pull>
      <a href="http://metroc.ca" className="button">
        Visit metroc.ca
      </a>
    </Block>
    <Block align="center">
      <Figure background src={screens} />
    </Block>
  </Article>
);
