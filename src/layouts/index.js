import React from 'react';
import PropTypes from 'prop-types';
import { observer, Provider } from 'mobx-react';
import { create } from 'mobx-persist';
import Img from 'gatsby-image';

import '~/src/styles/style.scss';

import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

import Store from '../stores/store';

const store = new Store();

if (typeof window !== `undefined`) {
  const hydrate = create();

  hydrate('site', store).then(args => {
    console.log('hydrated!', args);
  });

  hydrate('articles', store).then(args => {
    console.log('hydrated!', args);
  });
}

@observer
class Template extends React.Component {
  constructor(props) {
    super(props);
    store.setArticles(props.data.allJsFrontmatter.edges);
    store.setSite(props.data.site);
  }
  componentDidMount() {
    console.log(this.props);
  }

  render() {
    const { location, children } = this.props;

    return (
      <div>
        <Topbar />
        <Provider store={store}>
          <main className="container">{children()}</main>
        </Provider>
        <Footer />
      </div>
    );
  }
}

Template.propTypes = {
  children: PropTypes.func,
  location: PropTypes.object,
  route: PropTypes.object,
  data: PropTypes.object,
};

export default Template;

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allJsFrontmatter(
      filter: { data: { isWork: { eq: true } } }
      sort: { fields: [data___date], order: DESC }
    ) {
      edges {
        node {
          data {
            error
            title
            path
            cover {
              childImageSharp {
                # Specify the image processing steps right in the query
                # Makes it trivial to update as your page's design changes.
                sizes(maxWidth: 1400, quality: 90) {
                  ...GatsbyImageSharpSizes
                }
              }
            }
            details {
              title
              description
            }
            contain
            background
            subtitle
            isWork
          }
        }
      }
    }
  }
`;
