import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Header from '../components/Header';
import Intro from '../components/Intro';

export default ({
  children,
  cover,
  caption,
  dark,
  subtitle,
  title,
  intro,
  details,
  external,
}) => (
  <div>
    <Header
      slim
      cover={cover}
      caption={caption}
      dark={dark}
      external={external}
    >
      <h6>{subtitle}</h6>
      <h1>{title}</h1>
    </Header>
    <article id="content">
      <Helmet title={`${title} |ddd`} />
      <div className="container">
        <Intro details={details}>{intro}</Intro>
        {children}
      </div>
    </article>
  </div>
);
