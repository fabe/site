import React from 'react';
import PropTypes from 'prop-types';
import { observer, Provider } from 'mobx-react';
import { create } from 'mobx-persist';
import Img from 'gatsby-image';

import '~/src/styles/style.scss';

import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

import Store from '../stores/Store';

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
    super();

    // Have to manually set the covers because github.com/gatsbyjs/gatsby/issues/2929
    let articles = props.data.allJsFrontmatter.edges.map(item => {
      item.node.data.cover = props.data[item.node.data.id];
      return item;
    });

    store.setArticles(articles);
    store.setSite(props.data.site);
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
            id
            error
            title
            path
            devOnly
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
    # Covers for /work
    # Really nasty workaround, thanks to \`gatsby-transformer-javascript-static-exports\` taking
    # issue working together with \`gatsby-image\`. Issue for this: github.com/gatsbyjs/gatsby/issues/2929
    momenta: file(relativePath: { eq: "work/momenta/momenta.png" }) {
      ...Cover
    }
    dsk: file(relativePath: { eq: "work/dsk-companion/dsk.png" }) {
      ...Cover
    }
    delivery: file(relativePath: { eq: "work/delivery/delivery.png" }) {
      ...Cover
    }
    metroc: file(relativePath: { eq: "work/metroc/metroc.png" }) {
      ...Cover
    }
    leastauthority: file(
      relativePath: { eq: "work/least-authority/least-authority.png" }
    ) {
      ...Cover
    }
    wimdu: file(
      relativePath: { eq: "work/wimdu-help-center/wimdu-help-center.png" }
    ) {
      ...Cover
    }
    digitalmenu: file(
      relativePath: { eq: "work/digital-menu/digital-menu.png" }
    ) {
      ...Cover
    }
  }

  fragment Cover on File {
    childImageSharp {
      sizes(maxWidth: 1100, quality: 90) {
        ...GatsbyImageSharpSizes_withWebp
      }
    }
  }
`;
