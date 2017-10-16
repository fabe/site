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
        <Header caption="Portofino, Italy" isLocation>
          <h1>
            Hello, I'm Fabian &mdash; a <em>product designer and developer</em>{' '}
            based in Potsdam, Germany.
          </h1>
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
