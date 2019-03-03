import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';

import Header from './Header';
import Intro from './Intro';
import Post from './Post';
import Block from './Block';
import HGroup from './HGroup';
import SEO from './SEO';
import Layout from './Layout';

class Article extends React.Component {
  render() {
    const { children, pageContext } = this.props;
    const { frontmatter } = pageContext;
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
      <Layout>
        <Header cover={cover} contain={contain} background={background}>
          <div className="title">
            <HGroup large title={title} subtitle={subtitle} />
          </div>
          <Intro details={details} />
        </Header>
        <article id="content">
          <Helmet title={`Fabian Schultz | ${subtitle}`} />
          <SEO postPath={path} postNode={frontmatter} postSEO />
          <div>{children}</div>
          <hr />
          <div className="pagination">
            <header>
              <h2>Browse more work</h2>
              <Link to="/#work">View all</Link>
            </header>
            <Block pull>
              <Post post={pageContext.prevArticle} />
            </Block>
            <Block align="right" pull>
              <Post post={pageContext.nextArticle} />
            </Block>
          </div>
        </article>
      </Layout>
    );
  }
}

export default Article;
