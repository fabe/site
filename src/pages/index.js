import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Helmet from 'react-helmet';
import { observer, inject } from 'mobx-react';

import Header from '../components/Header';
import Bio from '../components/Bio';
import Posts from '../components/Posts';

@inject('store')
@observer
class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.store.site.siteMetadata.title');
    const articles = get(this, 'props.store.articles');
    const { transition } = this.props;

    return (
      <div style={transition && transition.style}>
        <Helmet title={get(this, 'props.store.site.siteMetadata.title')} />
        <Header cover={this.props.data.hero}>
          <div className="title">
            <h1>
              Hello, I’m Fabian &mdash; a{' '}
              <em>product designer and developer</em> based in Potsdam, Germany.
            </h1>
          </div>
          <div className="summary">
            <p>
              I’ve been working both as a product designer and frontend
              developer for over 5 years now. I particularly enjoy working with
              companies that try to meet broad and unique user&nbsp;needs.
            </p>
            <p>
              Currently, I study Interface Design at the University of Applied
              Sciences in Potsdam, Germany.
            </p>
          </div>
        </Header>
        <Posts posts={articles} />
      </div>
    );
  }
}

BlogIndex.propTypes = {
  route: PropTypes.object,
};

export default BlogIndex;

export const query = graphql`
  query GatsbyImageHeroIndexQuery {
    hero: file(relativePath: { eq: "hero-bw.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 1400, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp_tracedSVG
        }
      }
    }
  }
`;
