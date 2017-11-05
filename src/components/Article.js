import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import { observer, inject } from 'mobx-react';

import Header from './Header';
import Intro from './Intro';
import Post from './Post';
import Block from './Block';
import HGroup from './HGroup';

@inject('store')
@observer
class Article extends React.Component {
  render() {
    const { children, transition, store } = this.props;
    const article = store.getArticleByPath(this.props.path);
    console.log(article);

    const {
      cover,
      subtitle,
      title,
      details,
      path,
      contain,
      background,
    } = article;

    const index = store.articles.findIndex(
      article => article.node.data.path == path
    );

    let nextIndex = index + 1;
    if (nextIndex === store.articles.length) {
      nextIndex = 0;
    }

    let prevIndex = index - 1;
    if (prevIndex < 0) {
      prevIndex = store.articles.length - 1;
    }

    const nextArticle = store.articles[nextIndex];
    const prevArticle = store.articles[prevIndex];

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
            <meta
              property="og:image:url"
              content={cover.childImageSharp.sizes.src}
            />
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
          <hr />
          <div className="pagination">
            <header>
              <h2>Browse more work</h2>
              <Link to="/#work">View all</Link>
            </header>
            <Block pull>
              <Post post={prevArticle} />
            </Block>
            <Block align="right" pull>
              <Post post={nextArticle} />
            </Block>
          </div>
        </article>
      </div>
    );
  }
}

export default Article;
