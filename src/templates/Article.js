import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Header from '../components/Header';
import Intro from '../components/Intro';

class Article extends React.Component {
  render() {
    const {
      children,
      cover,
      dark,
      subtitle,
      title,
      intro,
      details,
      external,
      path,
      data,
    } = this.props;

    console.log(data);

    return (
      <div>
        <Header cover={cover} external={external}>
          <h1>{title}</h1>
          <h6>{subtitle}</h6>
        </Header>
        <article id="content">
          <Helmet title={`${title} | Fabian W. Schultz`}>
            <meta property="og:image:url" content={cover} />
            <meta property="og:image:type" content="image/png" />
            <meta
              property="og:url"
              content={`https://fabianschultz.com${path}`}
            />
            <meta
              property="og:title"
              content={`${title} | Fabian W. Schultz`}
            />
          </Helmet>
          <div className="container">
            <Intro details={details}>{intro}</Intro>
            {children}
          </div>
        </article>
      </div>
    );
  }
}

export default Article;
