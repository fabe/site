import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';

import Header from './Header';
import Intro from './Intro';
import Post from './Post';
import Block from './Block';
import HGroup from './HGroup';
import SEO from './SEO';

class Article extends React.Component {
  render() {
    const { children, transition, pathContext } = this.props;
    const { frontmatter } = pathContext;
    const {
      subtitle,
      title,
      details,
      path,
      cover,
      contain,
      background,
    } = frontmatter;

    return (
      <div style={transition ? transition.style : { opacity: 0 }}>
        <Header cover={cover} contain={contain} background={background}>
          <div className="title">
            <HGroup large title={title} subtitle={subtitle} />
          </div>
          <Intro details={details} />
        </Header>
        <article id="content">
          <Helmet title={`Fabian W. Schultz | ${subtitle}`} />
          <SEO postPath={path} postNode={frontmatter} postSEO />
          <div>{children}</div>
          <hr />
          <div className="pagination">
            <header>
              <h2>Browse more work</h2>
              <Link to="/#work">View all</Link>
            </header>
            <Block pull>
              <Post post={pathContext.prevArticle} />
            </Block>
            <Block align="right" pull>
              <Post post={pathContext.nextArticle} />
            </Block>
          </div>
        </article>
      </div>
    );
  }
}

export default Article;
