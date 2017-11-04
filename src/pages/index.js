import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Helmet from 'react-helmet';

import Header from '../components/Header';
import Bio from '../components/Bio';
import Posts from '../components/Posts';

class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const work = get(this, 'props.data.allJsFrontmatter.edges');

    return (
      <div>
        <Helmet title={get(this, 'props.data.site.siteMetadata.title')} />
        <Header>
          <div className="title">
            <h1>
              Hello, I'm Fabian &mdash; a{' '}
              <em>product designer and developer</em> based in Potsdam, Germany.
            </h1>
          </div>
          <div className="summary">
            <p>
              As a designer, I like to focus on projects in the travel and
              leisure industry. I work both as a product designer and a frontend
              developer. Take a look at my work here, or browse my side
              projects.
            </p>
          </div>
        </Header>
        <Posts posts={work} />
      </div>
    );
  }
}

BlogIndex.propTypes = {
  route: PropTypes.object,
};

export default BlogIndex;

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allJsFrontmatter(filter: { data: { isWork: { eq: true } } }) {
      edges {
        node {
          data {
            error
            title
            path
            cover
            subtitle
            isWork
          }
        }
      }
    }
  }
`;
