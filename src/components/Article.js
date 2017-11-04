import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Header from './Header';
import Intro from './Intro';
import HGroup from './HGroup';

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
      contain,
      background,
    } = this.props;

    console.log(data);

    return (
      <div>
        <Header
          cover={cover}
          external={external}
          contain={contain}
          background={background}
        >
          <div className="title">
            <HGroup large title={title} subtitle={subtitle} />
          </div>
          <Intro details={details}>{intro}</Intro>
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
          <div>{children}</div>
        </article>
      </div>
    );
  }
}

export default Article;
