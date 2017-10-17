import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Header from '../components/Header';
import Intro from '../components/Intro';

export default ({
  children,
  cover,
  dark,
  subtitle,
  title,
  intro,
  details,
  external,
  path,
}) => (
  <div>
    <Header slim readOn cover={cover} dark={dark} external={external}>
      <h6>{subtitle}</h6>
      <h1>{title}</h1>
    </Header>
    <article id="content">
      <Helmet title={`${title} | Fabian W. Schultz`}>
        <meta property="og:image:url" content={cover} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:url" content={`https://fabianschultz.com${path}`} />
        <meta property="og:title" content={`${title} | Fabian W. Schultz`} />
      </Helmet>
      <div className="container">
        <Intro details={details}>{intro}</Intro>
        {children}
      </div>
    </article>
  </div>
);
