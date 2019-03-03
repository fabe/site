import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import Header from '../components/Header';
import Bio from '../components/Bio';
import Posts from '../components/Posts';
import SEO from '../components/SEO';

class Index extends React.Component {
  render() {
    const { transition, data } = this.props;
    const { site, allJavascriptFrontmatter } = data;
    const articles = allJavascriptFrontmatter.edges;

    return (
      <div style={transition ? transition.style : { opacity: 0 }}>
        <Helmet
          title={`${site.siteMetadata.title} | Designer and Frontend Developer`}
        />
        <SEO postEdges={articles} />
        <Header cover={this.props.data.hero}>
          <div className="title">
            <h1>
              Hello, I’m Fabian &mdash; a designer and front-end developer based
              in Potsdam, Germany.
            </h1>
          </div>
          <div className="summary">
            <p>
              I’m focused on turning ideas into delightful, practical software,
              doing my best work when collaborating closely with founders,
              designers, and developers.
            </p>
            <p>
              Currently, I’m studying Interface Design at the University of
              Applied Sciences in Potsdam, Germany.
            </p>
          </div>
        </Header>
        <Posts posts={articles} />
      </div>
    );
  }
}

Index.propTypes = {
  route: PropTypes.object,
};

export default Index;

export const query = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allJavascriptFrontmatter(
      filter: { frontmatter: { isWork: { eq: true } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            path
            devOnly
            background
            subtitle
            cover {
              childImageSharp {
                sizes(maxWidth: 1100, quality: 100) {
                  ...GatsbyImageSharpSizes_withWebp
                }
              }
            }
          }
        }
      }
    }
    hero: file(relativePath: { eq: "hero-bw.jpg" }) {
      childImageSharp {
        sizes(maxWidth: 1400, quality: 90) {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
  }
`;
