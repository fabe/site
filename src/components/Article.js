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
  constructor(props) {
    super(props);

    const { store } = props;
    const article = store.getArticleByPath(props.path);

    const index = store.articles.findIndex(
      a => a.node.data.path == article.path
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

    this.state = {
      nextArticle,
      prevArticle,
      article,
    };
  }
  render() {
    const { children, transition } = this.props;
    const {
      cover,
      subtitle,
      title,
      details,
      path,
      contain,
      background,
    } = this.state.article;

    return (
      <div style={transition ? transition.style : { opacity: 0 }}>
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
              content={cover.childImageSharp.sizes.base64}
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
              <Post post={this.state.prevArticle} />
            </Block>
            <Block align="right" pull>
              <Post post={this.state.nextArticle} />
            </Block>
          </div>
        </article>
      </div>
    );
  }
}

export default Article;
