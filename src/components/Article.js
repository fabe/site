import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import { observer, inject } from 'mobx-react';

import Header from './Header';
import Intro from './Intro';
import HGroup from './HGroup';

@inject('store')
@observer
class Article extends React.Component {
  render() {
    const {
      children,
      cover,
      subtitle,
      title,
      details,
      path,
      data,
      contain,
      background,
      transition,
      store,
    } = this.props;

    return (
      <div style={transition && transition.style}>
        <Header cover={cover} contain={contain} background={background}>
          <div className="title">
            <HGroup large title={title} subtitle={subtitle} />
          </div>
          <Intro details={details} />
        </Header>
        <article id="content">
          <Helmet title={`Fabian W. Schultz | ${subtitle}`}>
            <meta property="og:image:url" content={cover} />
            <meta property="og:image:type" content="image/png" />
            <meta
              property="og:url"
              content={`https://fabianschultz.com${path}`}
            />
            <meta
              property="og:title"
              content={`Fabian W. Schultz | ${subtitle}`}
            />
          </Helmet>
          <div>{children}</div>
        </article>
      </div>
    );
  }
}

export default Article;
